import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from './en';
import kn from './kn';

const translations = { en, kn };

const LanguageContext = createContext({
  lang: 'kn',
  setLang: () => {},
  t: (key, fallback) => fallback || key
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('terravision_lang');
      return saved === 'en' || saved === 'kn' ? saved : 'kn';
    } catch {
      return 'kn';
    }
  });

  const setLang = useCallback((newLang) => {
    if (newLang === 'en' || newLang === 'kn') {
      setLangState(newLang);
      try {
        localStorage.setItem('terravision_lang', newLang);
      } catch (e) {
        console.warn('Unable to persist language to localStorage:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = useCallback((key, fallback) => {
    const currentDict = translations[lang] || translations.kn;
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key];
    }
    const fallbackDict = translations.en;
    if (fallbackDict && fallbackDict[key] !== undefined) {
      return fallbackDict[key];
    }
    return fallback !== undefined ? fallback : key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLang must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
