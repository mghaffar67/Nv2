export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

export interface SiteReview {
  name: string;
  comment: string;
  rating: number;
}

export interface FinanceSettings {
  minWithdraw: number;
  maxWithdraw: number;
  withdrawFeePercent: number;
  referralRequirementActive: boolean;
  requiredReferralCount: number;
}

export interface BrandingConfig {
  companyName: string;
  logo: string;
  banner: string;
  contactPhone: string;
  supportPhone: string;
  showHelpSection: boolean;
}

export interface AppearanceConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroSlides: HeroSlide[];
  reviews: SiteReview[];
  showFakePayouts: boolean;
  companyBanner: string;
}

export interface ThemeSettings {
  primaryColor: string;
  fontFamily: string;
  themePreset: 'indigo' | 'emerald' | 'rose' | 'amber' | 'sky';
}

export interface GlobalConfig {
  appName: string;
  currency: string;
  maintenanceMode: boolean;
  broadcastMessage: string;
  branding: BrandingConfig;
  financeSettings: FinanceSettings;
  referralSettings: {
    level1Percent: number;
    level2Percent: number;
    level3Percent: number;
  };
  paymentGateways: {
    name: string;
    accountNumber: string;
    accountTitle: string;
  }[];
  modules: {
    allowDeposits: boolean;
    allowWithdrawals: boolean;
    isRegistrationOpen: boolean;
    allowTaskSubmission: boolean;
    showHelpSection: boolean;
  };
  theme: ThemeSettings;
  appearance: AppearanceConfig;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  streakRewards: number[];
}