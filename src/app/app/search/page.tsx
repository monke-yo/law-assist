"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ChatUI from "./ChatUI";

export default function SearchPage() {
  const { data: session, status } = useSession();
  const [hasSearched, setHasSearched] = useState(false);

  if (status === "loading") {
    return null; // or a loading spinner
  }

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative blob - top right */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-main rounded-bl-[150px] translate-x-1/4 -translate-y-1/4 opacity-20" />

        <div
          className={`max-w-6xl mx-auto px-6 relative z-10 transition-all duration-700 ease-in-out ${
            !hasSearched ? "min-h-screen flex flex-col justify-center" : "py-12"
          }`}
        >
          {/* Title Above Search - Centered */}
          <div
            className={`text-center mb-6 transition-all duration-700 ${
              hasSearched ? "opacity-0 h-0 overflow-hidden mb-0" : "opacity-100"
            }`}
          >
            <h1 className="text-8xl font-heading leading-tight">
              Unlock
              <br />
              Legal
              <br />
              Answers
            </h1>
          </div>

          {/* Search Bar Section */}
          <div
            className={`bg-white border-2 border-border rounded-base shadow-shadow p-4 transition-all duration-700 ${
              !hasSearched ? "transform scale-105" : ""
            }`}
          >
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <ChatUI onSearchStateChange={setHasSearched} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
