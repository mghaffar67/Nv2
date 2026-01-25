
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  theme: any;
  setTheme: (config: any) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('noor_config');
    if (saved) {
      return JSON.parse(saved).theme;
    }
    return {
      primaryColor: '#6366f1',
      secondaryColor: '#0ea5e9',
      fontFamily: "'Inter', sans-serif"
    };
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--global-font', theme.fontFamily);
    
    // Listen for global config updates to sync theme
    const handleSync = () => {
      const updated = JSON.parse(localStorage.getItem('noor_config') || '{}');
      if (updated.theme) setTheme(updated.theme);
    };
    
    window.addEventListener('noor_db_update', handleSync);
    return () => window.removeEventListener('noor_db_update', handleSync);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
