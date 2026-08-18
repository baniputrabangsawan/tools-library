"use client";

import { useEffect, useState } from "react";
import { Language, languageStorageKey, translate } from "@/lib/i18n";

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(languageStorageKey);
    const initial = saved === "id" ? "id" : "en";
    setLanguageState(initial);
    document.documentElement.lang = initial;
  }, []);

  function setLanguage(next: Language) {
    setLanguageState(next);
    window.localStorage.setItem(languageStorageKey, next);
    document.documentElement.lang = next;
  }

  return { language, setLanguage, t: (key: Parameters<typeof translate>[1]) => translate(language, key) };
}
