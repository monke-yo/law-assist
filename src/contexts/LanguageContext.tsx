"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi" | "mr";

export const languages = {
  en: { code: "en", name: "English", flag: "🇺🇸" },
  hi: { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  mr: { code: "mr", name: "मराठी", flag: "🇮🇳" },
} as const;

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  getLanguageName: (code: Language) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  const getLanguageName = (code: Language) => {
    return languages[code].name;
  };

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, setLanguage, getLanguageName }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
