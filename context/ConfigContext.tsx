
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GlobalConfig } from '../types';

interface ConfigContextType {
  config: GlobalConfig;
  updateConfig: (newConfig: Partial<GlobalConfig>) => void;
}

const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
};

const defaultConfig: GlobalConfig = {
  appName: "Noor Official",
  currency: "PKR",
  maintenanceMode: false,
  financeSettings: {
    minWithdraw: 500,
    referralRequiredForWithdraw: false,
    withdrawFeePercent: 10
  },
  referralSettings: {
    level1Percent: 15,
    level2Percent: 5,
    level3Percent: 2,
    signupBonus: 0
  },
  paymentGateways: [
    { name: 'EasyPaisa', accountNumber: '03001234567', accountTitle: 'Noor Admin' },
    { name: 'JazzCash', accountNumber: '03451122334', accountTitle: 'Noor Admin' },
    { name: 'Bank Transfer', accountNumber: 'PK72 MEZN 0012 3456 7890 1234', accountTitle: 'Noor Official Ltd' }
  ],
  modules: {
    allowDeposits: true,
    allowWithdrawals: true,
    isRegistrationOpen: true,
    isChatSupportActive: true,
    allowTaskSubmission: true
  },
  theme: {
    primaryColor: '#0ea5e9',
    secondaryColor: '#6366f1',
    accentColor: '#6366f1',
    darkMode: false,
    fontFamily: "'Inter', sans-serif",
    fontWeight: "700"
  },
  appearance: {
    heroTitle: "Start Earning Daily From Your Home.",
    heroSubtitle: "Join the most trusted platform in Pakistan. Get paid directly to your mobile wallet.",
    announcementText: "New High-Value Tasks are now live! Claim your daily rewards.",
    heroSlides: [
      { image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1920", title: "Empowering Pakistani Youth.", subtitle: "Earn consistently with simple daily digital assignments." },
      { image: "https://images.unsplash.com/photo-1522071823991-b1ae5e6a3028?q=80&w=1920", title: "Direct Mobile Payments.", subtitle: "Get your earnings in EasyPaisa/JazzCash instantly within 24 hours." }
    ],
    siteStats: {
      totalMembers: "12,500+",
      totalPaid: "5,400,000",
      activeUsers: "3,200"
    },
    reviews: [
      { name: "Ali Ahmed", comment: "The best part about Noor Official is the instant payout. I withdrew Rs. 1500 today and it was in my EasyPaisa within 2 hours!", rating: 5 },
      { name: "Zainab Malik", comment: "Very simple tasks. I spend just 10 minutes a day and my monthly phone bills are covered. Great platform!", rating: 5 },
      { name: "Sohail Khan", comment: "Trustworthy and professional. The team support on WhatsApp is very helpful whenever I have a doubt.", rating: 5 }
    ],
    showFakePayouts: true
  },
  seo: {
    metaTitle: "Noor Official - Pakistan's #1 Earning Platform",
    metaDescription: "Noor Official V3 is a premium Pakistani platform for online earning.",
    keywords: "online earning pakistan, easypaisa earning, jazzcash earning"
  },
  streakRewards: [5, 5, 5, 10, 10, 15, 100]
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<GlobalConfig>(() => {
    const saved = localStorage.getItem('noor_config');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.theme.primaryColor);
    root.style.setProperty('--primary-rgb', hexToRgb(config.theme.primaryColor));
    root.style.setProperty('--secondary-color', config.theme.secondaryColor);
    root.style.setProperty('--secondary-rgb', hexToRgb(config.theme.secondaryColor));
    
    const fontString = config.theme.fontFamily || "'Inter', sans-serif";
    const weightString = config.theme.fontWeight || "700";
    
    root.style.setProperty('--global-font', fontString);
    root.style.setProperty('--global-weight', weightString);
    
    document.title = config.seo.metaTitle;
    
    localStorage.setItem('noor_config', JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<GlobalConfig>) => {
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
  if (!context) throw new Error('useConfig must be used within ConfigProvider');
  return context;
};
