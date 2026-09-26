"use client";

import { createContext, createElement, useContext, useMemo, useState, type ReactNode } from "react";
import { Language, languageCookieName, languageStorageKey, translate, TranslationKey } from "@/lib/i18n";

type LanguageContextValue = {
  language: Language;
  setLanguage: (next: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function persistLanguage(next: Language) {
  window.localStorage.setItem(languageStorageKey, next);
  document.cookie = `${languageCookieName}=${next}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.lang = next;
}

export function LanguageProvider({ initialLanguage, children }: { initialLanguage: Language; children: ReactNode }) {
  const [language, setLanguageState] = useState(initialLanguage);
  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage(next: Language) {
      setLanguageState(next);
      persistLanguage(next);
    },
    t: (key: TranslationKey) => translate(language, key),
  }), [language]);
  return createElement(LanguageContext.Provider, { value }, children);
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage requires LanguageProvider");
  return context;
}
