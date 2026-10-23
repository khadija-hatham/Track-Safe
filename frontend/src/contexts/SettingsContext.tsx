import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type DeductionMode = 'manual' | 'auto-deduct' | 'auto-ignore';
type ThemeMode = 'light' | 'dark';
type TimeFormat = '12h' | '24h';
type Language = 'en' | 'ar';

interface DeductionPrices {
  [key: string]: number;
}

interface SettingsContextType {
  deductionMode: DeductionMode;
  setDeductionMode: (mode: DeductionMode) => void;
  deductionPrices: DeductionPrices;
  updateDeductionPrice: (violationType: string, price: number) => void;
  timeFormat: TimeFormat;
  setTimeFormat: (format: TimeFormat) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const defaultDeductionPrices = {
  'Missing Helmet': 200,
  'Missing Boots': 150,
  'Missing Vest': 100,
  'Missing Face Protector': 180,
  'Missing Gloves': 80,
  'Missing Safety Glasses': 120,
};

const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Load settings from localStorage or use defaults
  const [deductionMode, setDeductionMode] = useState<DeductionMode>(() => {
    const saved = localStorage.getItem('trackSafe_deductionMode');
    return (saved as DeductionMode) || 'manual';
  });
  
  const [deductionPrices, setDeductionPrices] = useState<DeductionPrices>(() => {
    const saved = localStorage.getItem('trackSafe_deductionPrices');
    return saved ? JSON.parse(saved) : defaultDeductionPrices;
  });
  
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(() => {
    const saved = localStorage.getItem('trackSafe_timeFormat');
    return (saved as TimeFormat) || '24h';
  });
  
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('trackSafe_theme');
    return (saved as ThemeMode) || 'light';
  });
  
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('trackSafe_language');
    return (saved as Language) || 'en';
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('trackSafe_deductionMode', deductionMode);
  }, [deductionMode]);
  
  useEffect(() => {
    localStorage.setItem('trackSafe_deductionPrices', JSON.stringify(deductionPrices));
  }, [deductionPrices]);
  
  useEffect(() => {
    localStorage.setItem('trackSafe_timeFormat', timeFormat);
  }, [timeFormat]);
  
  useEffect(() => {
    localStorage.setItem('trackSafe_theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('trackSafe_language', language);
  }, [language]);

  const updateDeductionPrice = (violationType: string, price: number) => {
    setDeductionPrices(prev => ({
      ...prev,
      [violationType]: price
    }));
  };

  return (
    <SettingsContext.Provider value={{
      deductionMode,
      setDeductionMode,
      deductionPrices,
      updateDeductionPrice,
      timeFormat,
      setTimeFormat,
      theme,
      setTheme,
      language,
      setLanguage
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);