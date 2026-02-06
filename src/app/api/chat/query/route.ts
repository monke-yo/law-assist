import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// Initialize Gemini AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);

// Function to generate embeddings using Gemini
async function generateEmbedding(text: string) {
  const model = genAI.getGenerativeModel({
    model: "models/gemini-embedding-001",
  });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// Function to search similar documents in Supabase
async function searchSimilarDocuments(
  queryEmbedding: number[],
  matchCount: number = 5,
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
        { status: 400 },
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
Your role is to provide clear, accurate legal information in a conversational manner.

IMPORTANT INSTRUCTIONS:
- Provide direct, actionable legal guidance based on the question asked
- Use the provided legal documents below as reference when available
- NEVER mention whether documents contain information or not - just answer the question
- DO NOT say things like "the documents don't contain" or "based on the documents provided"
- Provide practical guidance as if you're a knowledgeable legal expert
- Explain legal processes step-by-step when asked
- When relevant to cybercrime/digital offenses, reference the Indian IT Act 2000 and associated rules
- Mention specific sections of the IT Act when applicable to provide legal context

CRITICAL: You MUST ALWAYS generate a workflow for ANY legal query, even general questions.
For EVERY response, you must create a step-by-step workflow process that helps the user understand what actions to take.

After your conversational response, you MUST include a JSON workflow structure in this EXACT format:

WORKFLOW_START
{
  "title": "Brief descriptive title of the legal process",
  "steps": [
    {
      "id": "1a",
      "title": "Step Title",
      "description": "Brief description",
      "phase": 1,
      "parallel": 0
    }
  ]
}
WORKFLOW_END

WORKFLOW RULES:
- ALWAYS include a workflow, even for simple questions
- Each step needs: id, title, description, phase, and parallel
- **DESCRIPTION MUST BE A HOW-TO GUIDE**: Don't just say WHAT to do, explain HOW to do it with actionable instructions
- Phase number groups steps sequentially (1, 2, 3, etc.)
- Parallel number determines if steps happen at the same time within a phase (0, 1, 2, etc.)
- Steps in the same phase with different parallel numbers happen simultaneously
- id format: "{phase}{letter}" (e.g., "1a", "1b", "2a", "3a", "3b", "3c")
- Include 6-15 steps for a comprehensive workflow
- Make it practical and actionable for the user's situation

IMPORTANT RESOURCES TO INCLUDE WHEN RELEVANT:
- For cybercrime/online complaints: Mention "Visit cybercrime.gov.in to file online complaint"
- For legal consultation: Include "Contact lawyer at +91 85300 76989 via WhatsApp for assistance"
- Use these naturally in step descriptions where appropriate

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

Based on the legal documents provided above, please answer the user's question AND provide a workflow:`;

    // Step 6: Generate content with RAG
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    // Step 7: Extract workflow from the response
    let workflowData = null;
    let cleanedText = text;

    const workflowMatch = text.match(
      /WORKFLOW_START\s*([\s\S]*?)\s*WORKFLOW_END/,
    );
    if (workflowMatch) {
      try {
        workflowData = JSON.parse(workflowMatch[1].trim());
        // Remove workflow from the text to keep the response clean
        cleanedText = text
          .replace(/WORKFLOW_START[\s\S]*?WORKFLOW_END/, "")
          .trim();
      } catch (error) {
        console.error("Error parsing workflow JSON:", error);
      }
    }

    return NextResponse.json({
      ok: true,
      reply: cleanedText,
      workflow: workflowData,
      sources: similarDocs.length, // Number of sources used
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 },
    );
  }
}
