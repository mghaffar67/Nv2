import React, { createContext, useContext, useState, useEffect } from 'react';
import { GlobalConfig } from '../types';

interface ConfigContextType {
  config: GlobalConfig;
  updateConfig: (newConfig: Partial<GlobalConfig>) => void;
}

const defaultConfig: GlobalConfig = {
  appName: "Noor V3",
  currency: "PKR",
  maintenanceMode: false,
  broadcastMessage: "Welcome to Noor! Withdrawals take 24 hours to process.",
  branding: {
    companyName: "Noor Official",
    logo: "",
    banner: "",
    contactPhone: "03068665907",
    supportPhone: "03068665907",
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
    { name: 'EasyPaisa', accountNumber: '03068665907', accountTitle: 'M Ghaffar' },
    { name: 'JazzCash', accountNumber: '03068665907', accountTitle: 'M Ghaffar' }
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
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    themePreset: 'indigo'
  },
  appearance: {
    heroTitle: "Daily Earnings. Simple Work.",
    heroSubtitle: "Join the most trusted platform in Pakistan.",
    heroSlides: [
      { image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1920", title: "Empowering Pakistan.", subtitle: "Simple tasks, daily earnings." }
    ],
    reviews: [
      { name: "Ali Ahmed", comment: "Bohot achi app hai, payment time par milti hai.", rating: 5 },
      { name: "Sara Khan", comment: "Trusted platform for students.", rating: 5 }
    ],
    showFakePayouts: true,
    companyBanner: ""
  },
  seo: {
    metaTitle: "Noor V3 - Premium Earning Platform",
    metaDescription: "Join Noor V3 for daily earning opportunities in Pakistan. Secure tasks and fast payouts via EasyPaisa and JazzCash.",
    keywords: "online earning pakistan, easypaisa earning, jazzcash earning, earn money online"
  },
  streakRewards: [10, 10, 15, 20, 25, 50, 100]
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<GlobalConfig>(() => {
    const saved = localStorage.getItem('noor_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultConfig, ...parsed };
      } catch (e) {
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
    
    // SEO Dynamic Update
    if (config.seo) {
      document.title = config.seo.metaTitle || "Noor V3";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', config.seo.metaDescription);
    }
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