"use client";

import { useState, useRef } from "react";
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
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<unknown>(null);
  const hasStartedRef = useRef(false);
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

  // Detect language from text content
  const detectLanguage = (text: string): string => {
    // Check for Devanagari script (Hindi/Marathi)
    const devanagariRegex = /[\u0900-\u097F]/;
    if (devanagariRegex.test(text)) {
      // Try to distinguish between Hindi and Marathi
      // Marathi has some unique characters
      const marathiRegex = /[\u0950\u0904]/;
      return marathiRegex.test(text) ? "mr-IN" : "hi-IN";
    }
    return "en-US";
  };

  // Text-to-speech function
  const speakText = (text: string, index: number) => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // If already speaking this message, stop
    if (speakingIndex === index) {
      setSpeakingIndex(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const lang = detectLanguage(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Try to find a voice for the detected language
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) =>
      voice.lang.startsWith(lang.split("-")[0])
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setSpeakingIndex(index);
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    window.speechSynthesis.speak(utterance);
  };

  // Speech-to-text function - SIMPLIFIED VERSION
  const startSpeechRecognition = () => {
    console.log("🎤 STARTING SPEECH RECOGNITION");

    // Detect Opera browser (has known Web Speech API issues)
    const isOpera = /OPR|Opera/.test(navigator.userAgent);
    if (isOpera) {
      alert(
        "⚠️ OPERA BROWSER DETECTED\n\n" +
          "Opera has incomplete Web Speech API support.\n" +
          "Speech recognition may not work.\n\n" +
          "Please use instead:\n" +
          "• Google Chrome (recommended)\n" +
          "• Microsoft Edge\n\n" +
          "Download Chrome: https://www.google.com/chrome/"
      );
      // Continue anyway in case Opera has fixed it
    }

    // Clean up
    if (recognitionRef.current) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (recognitionRef.current as any).abort();
      } catch {
        // Ignore errors during cleanup
      }
      recognitionRef.current = null;
    }

    hasStartedRef.current = false;

    // Check browser support
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition: any =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitSpeechRecognition ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "❌ Speech recognition not supported in this browser.\n\nPlease use:\n• Google Chrome\n• Microsoft Edge\n• Safari"
      );
      return;
    }

    // Check if internet is available (speech recognition requires it)
    if (!navigator.onLine) {
      alert(
        "❌ No internet connection.\n\nSpeech recognition requires an active internet connection."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    // CRITICAL: Set properties BEFORE adding event handlers
    const langMap: Record<string, string> = {
      en: "en-US",
      hi: "hi-IN",
      mr: "mr-IN",
    };
    recognition.lang = langMap[currentLanguage] || "en-US";
    recognition.continuous = true; // Changed back to true for better reliability
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    console.log(
      "📋 Config: lang=" +
        recognition.lang +
        ", continuous=true, interimResults=true"
    );

    // Event handlers
    recognition.onstart = () => {
      console.log("✅✅✅ STARTED! Speak now!");
      hasStartedRef.current = true;
      setIsRecording(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      console.log("📝 RESULT!");
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
          console.log("✅ Final:", result[0].transcript);
        }
      }

      if (finalTranscript) {
        setQuery((prev) => (prev + " " + finalTranscript).trim());
      }
    };

    recognition.onaudiostart = () => {
      console.log("🎙️ AUDIO STARTED");
      hasStartedRef.current = true;
      setIsRecording(true);
    };

    recognition.onspeechstart = () => console.log("🗣️ SPEECH DETECTED");
    recognition.onaudioend = () => console.log("🔇 AUDIO ENDED");
    recognition.onspeechend = () => console.log("⏸️ SPEECH ENDED");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error("❌ ERROR:", event.error);

      switch (event.error) {
        case "not-allowed":
        case "service-not-allowed":
          alert(
            "❌ Microphone blocked!\n\n1. Click 🔒 in address bar\n2. Reset permissions\n3. Refresh page (F5)\n4. Try again"
          );
          break;
        case "network":
          alert("❌ Network error. Speech recognition needs internet.");
          break;
        case "audio-capture":
          alert(
            "❌ Can't access microphone.\n\nCheck:\n• Microphone is connected\n• No other app is using it\n• Browser has permission"
          );
          break;
        case "no-speech":
          console.log("⚠️ No speech - but continuing...");
          return; // Don't stop on no-speech
        case "aborted":
          console.log("ℹ️ Aborted by user");
          break;
        default:
          console.error("Unknown error:", event.error);
      }

      setIsRecording(false);
    };

    recognition.onend = () => {
      console.log("⏹️ ENDED. Had started:", hasStartedRef.current);
      setIsRecording(false);
      recognitionRef.current = null;
    };

    // Store ref
    recognitionRef.current = recognition;

    // START - with detailed logging
    console.log("🚀 Calling start()...");
    try {
      recognition.start();
      console.log("✅ start() returned");

      // Diagnostic timeout
      setTimeout(() => {
        if (!hasStartedRef.current) {
          console.error("❌❌❌ FAILED - onstart/onaudiostart never fired!");
          console.log("🔍 Debug info:");
          console.log("  Navigator.onLine:", navigator.onLine);
          console.log("  Location:", window.location.href);
          console.log("  User agent:", navigator.userAgent);

          const isChrome = /Chrome/.test(navigator.userAgent);
          const isEdge = /Edg/.test(navigator.userAgent);

          alert(
            "❌ Speech service failed to start.\n\n" +
              (isChrome || isEdge
                ? ""
                : "⚠️ You're not using Chrome/Edge!\n\n") +
              "Solutions:\n" +
              "1. Press F5 to refresh\n" +
              "2. Close other tabs using microphone\n" +
              "3. Restart browser\n" +
              "4. Check Windows Privacy → Microphone is ON\n" +
              "5. Try in Chrome Incognito mode\n\n" +
              "Still broken? The speech service may be temporarily unavailable."
          );

          setIsRecording(false);
        }
      }, 3000);
    } catch (error) {
      console.error("❌ Exception:", error);
      alert("Exception starting recognition:\n" + error);
      setIsRecording(false);
    }
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

    const res = await fetch("/api/chat/query", {
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
        <div className="flex gap-3 items-center">
          <div className="flex-1 flex gap-3 items-center">
            <div className="w-12 h-12 border-2 border-border rounded-base flex items-center justify-center bg-white flex-shrink-0">
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
                  const formEvent = e as unknown as React.FormEvent;
                  await handleSubmit(formEvent);
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (isRecording) {
                  console.log("🛑 Stopping recognition");
                  if (recognitionRef.current) {
                    try {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (recognitionRef.current as any).stop();
                    } catch (e) {
                      console.error("Error stopping:", e);
                    }
                  }
                  setIsRecording(false);
                  recognitionRef.current = null;
                } else {
                  startSpeechRecognition();
                }
              }}
              className={`w-12 h-12 border-2 border-border rounded-base transition-all flex items-center justify-center flex-shrink-0 ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              title={isRecording ? "Stop recording" : "Voice input"}
              aria-label={isRecording ? "Stop recording" : "Voice input"}
            >
              {isRecording ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              )}
            </button>
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
                  {msg.role === "ai" && (
                    <button
                      onClick={() => speakText(msg.content, i)}
                      className={`ml-2 p-2 rounded-lg border-2 border-border transition-all hover:bg-gray-100 ${
                        speakingIndex === i
                          ? "bg-blue-100 text-blue-600"
                          : "bg-white text-gray-600"
                      }`}
                      aria-label="Speak text"
                      title="Listen to response"
                    >
                      {speakingIndex === i ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
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
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                          />
                        </svg>
                      )}
                    </button>
                  )}
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
