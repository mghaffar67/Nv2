
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
  referralRequiredForWithdraw: boolean;
  withdrawFeePercent: number;
}

export interface ReferralSettings {
  level1Percent: number;
  level2Percent: number;
  level3Percent: number;
  signupBonus: number;
}

export interface PaymentGateway {
  name: string;
  accountNumber: string;
  accountTitle: string;
}

export interface PlatformModules {
  allowDeposits: boolean;
  allowWithdrawals: boolean;
  isRegistrationOpen: boolean;
  isChatSupportActive: boolean;
  allowTaskSubmission: boolean;
}

export interface AppearanceConfig {
  heroTitle: string;
  heroSubtitle: string;
  announcementText: string;
  heroSlides: HeroSlide[];
  siteStats: {
    totalMembers: string;
    totalPaid: string;
    activeUsers: string;
  };
  reviews: SiteReview[];
  showFakePayouts: boolean;
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkMode: boolean;
  fontFamily: string;
  fontWeight: string;
}

export interface GlobalConfig {
  appName: string;
  currency: string;
  maintenanceMode: boolean;
  broadcastMessage: string;
  branding: {
    logo: string;
    siteIcon: string;
    copyright: string;
  };
  financeSettings: FinanceSettings;
  referralSettings: ReferralSettings;
  paymentGateways: PaymentGateway[];
  modules: PlatformModules;
  theme: ThemeSettings;
  appearance: AppearanceConfig;
  seo: SEOConfig;
  streakRewards: number[];
}
