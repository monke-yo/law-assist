import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// Initialize Gemini AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// Function to generate embeddings using Gemini
async function generateEmbedding(text: string) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// Function to search similar documents in Supabase
async function searchSimilarDocuments(
  queryEmbedding: number[],
  matchCount: number = 5
) {
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: matchCount,
  });

  if (error) {
    console.error("Error searching documents:", error);
    return [];
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { ok: false, error: "Message is required" },
        { status: 400 }
      );
    }

    // Step 1: Generate embedding for the user's query
    const queryEmbedding = await generateEmbedding(message);

    // Step 2: Search for similar documents in the vector database
    const similarDocs = await searchSimilarDocuments(queryEmbedding, 5);

    // Step 3: Build context from retrieved documents
    const context = similarDocs
      .map((doc: { content: string; similarity: number }, idx: number) => {
        return `Document ${idx + 1} (Similarity: ${(
          doc.similarity * 100
        ).toFixed(1)}%):\n${doc.content}`;
      })
      .join("\n\n");

    // Step 4: Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Step 5: Create a prompt with legal context and retrieved documents
    const systemPrompt = `You are a helpful legal assistant specializing in Indian law. 
Your role is to provide clear, accurate legal information in a conversational manner based on the provided legal documents.

IMPORTANT INSTRUCTIONS:
- Use the provided legal documents below as your primary source of information
- When citing information, reference the document it came from
- If the documents don't contain relevant information, say so and provide general guidance
- Explain legal processes step-by-step when asked

${
  message.includes("[Language: Hindi]")
    ? "Respond in Hindi."
    : message.includes("[Language: Marathi]")
    ? "Respond in Marathi."
    : "Respond in English."
}

RETRIEVED LEGAL DOCUMENTS:
${context}

---

User query: ${message}

Based on the legal documents provided above, please answer the user's question:`;

    // Step 6: Generate content with RAG
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      ok: true,
      reply: text,
      sources: similarDocs.length, // Number of sources used
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 }
    );
  }
}
