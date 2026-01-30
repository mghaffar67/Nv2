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

export interface PopupConfig {
  id: string;
  name: string;
  templateStyle: 'modern_modal' | 'bottom_sheet' | 'full_screen_offer';
  triggerDelay: number;
  frequency: 'once_per_session' | 'once_daily' | 'always' | 'one_time_ever';
  targetPages: string[];
  targetAudience: 'all' | 'free_users' | 'vip_users';
  animationType: 'fade_in' | 'slide_up' | 'zoom_bounce';
  content: string;
  isActive: boolean;
}

export interface GlobalConfig {
  appName: string;
  currency: string;
  maintenanceMode: boolean;
  submissionMode: 'single_image' | 'multi_image' | 'auto_pdf';
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
    isMaintenanceMode: boolean;
    allowRegistration: boolean;
    allowDemoLogin: boolean;
    enableDeposits: boolean;
    enableWithdrawals: boolean;
    enableDailyTasks: boolean;
    enableReferralSystem: boolean;
    showPopups: boolean;
    enableDailyCheckIn: boolean;
    allowTaskSubmission: boolean;
  };
  theme: ThemeSettings;
  appearance: AppearanceConfig;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  streakRewards: number[];
  popups: PopupConfig[];
}