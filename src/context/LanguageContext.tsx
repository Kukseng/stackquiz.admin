"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "kh";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("language") as Language | null;
    if (stored) setLanguage(stored);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === "en" ? "kh" : "en";
      localStorage.setItem("language", next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
