"use client";

import React, { useState } from "react";
import { useLanguage, languages, Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export default function LanguageDropdown() {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (languageCode: Language) => {
    setLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLang = languages[currentLanguage];

  return (
    <div className="relative">
      <Button onClick={() => setIsOpen(!isOpen)}>
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium text-gray-700">
          {currentLang.name}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 shadow-lg z-50">
          <div className="py-1">
            {Object.entries(languages).map(([code, lang]) => (
              <Button
                key={code}
                onClick={() => handleLanguageSelect(code as Language)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm  ${
                  currentLanguage === code
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {currentLanguage === code && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
