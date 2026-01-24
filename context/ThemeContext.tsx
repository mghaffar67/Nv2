
import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeName = 'ocean' | 'gold' | 'dark';

interface ThemeConfig {
  primary: string;
  secondary: string;
  bg: string;
  text: string;
  card: string;
  accent: string;
}

const themes: Record<ThemeName, ThemeConfig> = {
  ocean: {
    primary: '#6366f1',
    secondary: '#0ea5e9',
    bg: '#f8f9fc',
    text: '#0f172a',
    card: '#ffffff',
    accent: '#38bdf8'
  },
  gold: {
    primary: '#eab308',
    secondary: '#d97706',
    bg: '#1c1917',
    text: '#fef3c7',
    card: '#292524',
    accent: '#fbbf24'
  },
  dark: {
    primary: '#6366f1',
    secondary: '#a855f7',
    bg: '#0a0c10',
    text: '#f1f5f9',
    card: '#12151c',
    accent: '#818cf8'
  }
};

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (name: ThemeName) => void;
  config: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    return (localStorage.getItem('noor_theme') as ThemeName) || 'ocean';
  });

  const config = themes[theme];

  useEffect(() => {
    const root = document.documentElement;
    const c = themes[theme];
    
    root.style.setProperty('--color-primary', c.primary);
    root.style.setProperty('--color-secondary', c.secondary);
    root.style.setProperty('--color-accent', c.accent);
    root.style.setProperty('--bg-base', c.bg);
    root.style.setProperty('--text-base', c.text);
    root.style.setProperty('--card-base', c.card);
    
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    localStorage.setItem('noor_theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState, config }}>
      <div style={{ backgroundColor: config.bg, color: config.text, minHeight: '100vh' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
