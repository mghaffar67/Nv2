import React, { createContext, useContext, useState, useEffect } from 'react';
import { GlobalConfig } from '../types';

interface ConfigContextType {
  config: GlobalConfig;
  updateConfig: (newConfig: Partial<GlobalConfig>) => void;
}

const defaultConfig: GlobalConfig = {
  appName: "Noor Official V3",
  currency: "PKR",
  maintenanceMode: false,
  broadcastMessage: "Welcome to Noor! Withdrawals take 24 hours to process.",
  branding: {
    companyName: "Noor Official",
    logo: "",
    banner: "",
    contactPhone: "03001234567",
    supportPhone: "03007654321",
    showHelpSection: true
  },
  financeSettings: {
    minWithdraw: 500,
    maxWithdraw: 50000,
    withdrawFeePercent: 10,
    referralRequirementActive: false,
    requiredReferralCount: 2
  },
  referralSettings: {
    level1Percent: 15,
    level2Percent: 5,
    level3Percent: 2
  },
  paymentGateways: [
    { name: 'EasyPaisa', accountNumber: '03001234567', accountTitle: 'Noor Admin' },
    { name: 'JazzCash', accountNumber: '03451122334', accountTitle: 'Noor Admin' }
  ],
  modules: {
    allowDeposits: true,
    allowWithdrawals: true,
    isRegistrationOpen: true,
    allowTaskSubmission: true,
    showHelpSection: true
  },
  theme: {
    primaryColor: '#6366f1',
    fontFamily: "'Inter', sans-serif",
    themePreset: 'indigo'
  },
  appearance: {
    heroTitle: "Start Earning Daily From Your Home.",
    heroSubtitle: "Join the most trusted platform in Pakistan.",
    heroSlides: [
      { image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1920", title: "Empowering Pakistan.", subtitle: "Simple tasks, daily profits." }
    ],
    reviews: [
      { name: "Ali Ahmed", comment: "Bohot achi app hai, payment time par milti hai.", rating: 5 },
      { name: "Sara Khan", comment: "Trusted platform for students.", rating: 5 }
    ],
    showFakePayouts: true,
    companyBanner: ""
  },
  seo: {
    metaTitle: "Noor Official V3 - Best Earning App",
    metaDescription: "Earn daily profits with simple tasks in Pakistan.",
    keywords: "earning app, pakistan, online work"
  },
  streakRewards: [5, 10, 15, 20, 25, 50, 100]
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<GlobalConfig>(() => {
    const saved = localStorage.getItem('noor_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure new sections like 'appearance' exist by merging with defaults
        return {
          ...defaultConfig,
          ...parsed,
          branding: { ...defaultConfig.branding, ...parsed.branding },
          financeSettings: { ...defaultConfig.financeSettings, ...parsed.financeSettings },
          modules: { ...defaultConfig.modules, ...parsed.modules },
          theme: { ...defaultConfig.theme, ...parsed.theme },
          appearance: { ...defaultConfig.appearance, ...parsed.appearance },
          seo: { ...defaultConfig.seo, ...parsed.seo }
        };
      } catch (e) {
        console.error("Config migration failed, using defaults", e);
        return defaultConfig;
      }
    }
    return defaultConfig;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.theme.primaryColor);
    root.style.setProperty('--global-font', config.theme.fontFamily);
    localStorage.setItem('noor_config', JSON.stringify(config));
    window.dispatchEvent(new Event('noor_db_update'));
  }, [config]);

  const updateConfig = (newConfig: any) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig failed');
  return context;
};