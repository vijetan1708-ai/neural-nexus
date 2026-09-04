import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '../types/user';
import { TranslationKeys } from '../locales/types';
import { getTranslation, SUPPORTED_LANGUAGES, LanguageMeta } from '../locales';
import { StorageService } from '../services/storageService';

interface LanguageContextType {
  language: SupportedLanguage;
  t: TranslationKeys;
  setLanguage: (lang: SupportedLanguage) => void;
  supportedLanguages: LanguageMeta[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const prefs = StorageService.getUserPreferences();
    return prefs.preferredLanguage || 'en';
  });

  const [t, setT] = useState<TranslationKeys>(() => getTranslation(language));

  useEffect(() => {
    setT(getTranslation(language));
    const prefs = StorageService.getUserPreferences();
    prefs.preferredLanguage = language;
    StorageService.saveUserPreferences(prefs);
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
