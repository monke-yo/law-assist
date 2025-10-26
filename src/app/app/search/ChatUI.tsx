"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import WorkflowDiagram from "./WorkflowDiagram";
import { useLanguage } from "@/contexts/LanguageContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ChatUI({
  onSearchStateChange,
}: {
  onSearchStateChange?: (hasSearched: boolean) => void;
}) {
  const { currentLanguage } = useLanguage();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
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
    if (!hasSearched) {
      setHasSearched(true);
      onSearchStateChange?.(true);
    }

    // Detect if this query should show a workflow
    const workflowInfo = detectLegalProcess(query);

    // Prepare the message with language context for the LLM (hidden from user)
    const languageNames = {
      en: "English",
      hi: "Hindi",
      mr: "Marathi",
    };

    const messageWithLanguage = `[Language: ${languageNames[currentLanguage]}] ${query}`;

    const res = await fetch("http://localhost:3001/api/chat/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageWithLanguage }),
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
    }

    setQuery("");
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {/* Search Input Form */}
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 items-start">
          <div className="flex-1 flex gap-3 items-center">
            <div className="w-10 h-10 border-2 border-border rounded-base flex items-center justify-center bg-white">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by legal topic or use filters"
              className="flex-1 border-2 border-border rounded-base px-4 py-3 focus:outline-none focus:ring-2 focus:ring-main resize-none text-lg"
              rows={1}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  await handleSubmit(e as any);
                }
              }}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="bg-main text-main-foreground border-2 border-border hover:translate-x-boxShadowX hover:translate-y-boxShadowY"
          >
            {loading ? "Searching..." : "Find"}
          </Button>
        </div>
      </form>

      {/* Chat History */}
      {history.length > 0 && (
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {history.map((msg, i) => (
            <div key={i} className="space-y-3">
              <div
                className={`p-4 rounded-base border-2 border-border ${
                  msg.role === "human"
                    ? "bg-white shadow-shadow"
                    : "bg-secondary-background/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full border-2 border-border flex items-center justify-center text-sm font-heading ${
                      msg.role === "human"
                        ? "bg-accent text-foreground"
                        : "bg-main text-white"
                    }`}
                  >
                    {msg.role === "human" ? "Q" : "⚖️"}
                  </div>
                  <div className="flex-1">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
              {msg.role === "ai" && msg.showWorkflow && (
                <WorkflowDiagram processType={msg.workflowType} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
