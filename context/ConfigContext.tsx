
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
  appName: "Noor Official V3",
  currency: "PKR",
  maintenanceMode: false,
  broadcastMessage: "Welcome to Noor! Naye plans live hain. Withdrawals 24 hours mein milenge.",
  branding: {
    logo: "",
    siteIcon: "",
    copyright: "© 2024 Noor Official V3. All Rights Reserved."
  } as any,
  financeSettings: {
    minWithdraw: 500,
    // Added missing maxWithdraw property to satisfy FinanceSettings interface
    maxWithdraw: 50000,
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
    { name: 'EasyPaisa', accountNumber: '03001234567', accountTitle: 'Noor Admin Main' },
    { name: 'JazzCash', accountNumber: '03451122334', accountTitle: 'Noor Finance Hub' }
  ],
  modules: {
    allowDeposits: true,
    allowWithdrawals: true,
    isRegistrationOpen: true,
    isChatSupportActive: true,
    allowTaskSubmission: true,
    demoLoginEnabled: true
  } as any,
  theme: {
    primaryColor: '#6366f1',
    secondaryColor: '#0ea5e9',
    accentColor: '#6366f1',
    darkMode: false,
    fontFamily: "'Inter', sans-serif",
    fontWeight: "700"
  },
  appearance: {
    heroTitle: "Earn Online Daily.",
    heroSubtitle: "Join Pakistan's most trusted platform.",
    announcementText: "New High-Value Tasks are now live!",
    heroSlides: [
      { image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1920", title: "Empowering Pakistan.", subtitle: "Simple tasks, daily profits." }
    ],
    siteStats: {
      totalMembers: "15,000+",
      totalPaid: "8,500,000",
      activeUsers: "3,200"
    },
    reviews: [
      { name: "Ali Ahmed", comment: "Bohot achi app hai, payment time par milti hai.", rating: 5 }
    ],
    showFakePayouts: true
  },
  seo: {
    metaTitle: "Noor Official V3 - Earn Online",
    metaDescription: "Daily tasks and payouts in Pakistan.",
    keywords: "earning, jazzcash, easypaisa"
  },
  streakRewards: [5, 10, 15, 20, 25, 30, 100]
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
  if (!context) throw new Error('useConfig failed');
  return context;
};
