"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import WorkflowDiagram from "./WorkflowDiagram";

export default function ChatUI() {
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    {
      role: "human" | "ai";
      content: string;
      showWorkflow?: boolean;
      workflowType?: string;
    }[]
  >([]);

  // Function to detect if query is asking about a legal process
  const detectLegalProcess = (
    query: string
  ): { shouldShow: boolean; processType: string } => {
    const lowerQuery = query.toLowerCase();

    // Divorce-related keywords
    if (
      lowerQuery.includes("divorce") ||
      lowerQuery.includes("separation") ||
      lowerQuery.includes("custody") ||
      lowerQuery.includes("alimony") ||
      lowerQuery.includes("marital") ||
      lowerQuery.includes("spouse")
    ) {
      return { shouldShow: true, processType: "divorce" };
    }

    // Contract-related keywords
    if (
      lowerQuery.includes("contract") ||
      lowerQuery.includes("breach") ||
      lowerQuery.includes("agreement") ||
      lowerQuery.includes("dispute") ||
      lowerQuery.includes("violation") ||
      lowerQuery.includes("terms")
    ) {
      return { shouldShow: true, processType: "contract" };
    }

    // General legal process keywords
    if (
      lowerQuery.includes("process") ||
      lowerQuery.includes("procedure") ||
      lowerQuery.includes("steps") ||
      lowerQuery.includes("how to") ||
      lowerQuery.includes("what should i do") ||
      lowerQuery.includes("legal action")
    ) {
      return { shouldShow: true, processType: "general" };
    }

    return { shouldShow: false, processType: "general" };
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setReply(null);

    // Detect if this query should show a workflow
    const workflowInfo = detectLegalProcess(query);

    const res = await fetch("http://localhost:3001/api/chat/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: query }),
    });

    const data = await res.json();

    if (data.ok) {
      setHistory((prev) => [
        ...prev,
        { role: "human", content: query },
        {
          role: "ai",
          content: data.reply,
          showWorkflow: workflowInfo.shouldShow,
          workflowType: workflowInfo.processType,
        },
      ]);
      setReply(data.reply);
    }

    setQuery("");
    setLoading(false);
  }

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a legal question..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {history.map((msg, i) => (
          <div key={i}>
            <div
              className={`p-3 rounded ${
                msg.role === "human" ? "bg-gray-200" : "bg-gray-100"
              }`}
            >
              <strong>{msg.role === "human" ? "You" : "⚖️"}:</strong>{" "}
              <div className="prose prose-sm max-w-none mt-1">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
            {msg.role === "ai" && msg.showWorkflow && (
              <WorkflowDiagram processType={msg.workflowType} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
