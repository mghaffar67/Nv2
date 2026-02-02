
export const GlobalConfigSchema = {
  appName: { type: String, default: "Noor Official" },
  currency: { type: String, default: "PKR" },
  maintenanceMode: { type: Boolean, default: false },
  theme: {
    primaryColor: { type: String, default: "#0EA5E9" },
    secondaryColor: { type: String, default: "#6366F1" },
    accentColor: { type: String, default: "#6366F1" },
    fontFamily: { type: String, default: "'Inter', sans-serif" },
    fontWeight: { type: String, default: "700" }
  },
  financeSettings: {
    minWithdraw: { type: Number, default: 500 },
    maxWithdraw: { type: Number, default: 50000 },
    referralRequiredForWithdraw: { type: Boolean, default: false },
    withdrawFeePercent: { type: Number, default: 10 }
  },
  modules: {
    deposit: { type: Boolean, default: true },
    withdraw: { type: Boolean, default: true },
    register: { type: Boolean, default: true },
    isChatSupportActive: { type: Boolean, default: true },
    allowTaskSubmission: { type: Boolean, default: true }
  },
  streakRewards: { 
    type: [Number], 
    default: [5, 5, 5, 10, 10, 15, 100] 
  },
  seo: {
    title: { type: String, default: "Noor Official - Pakistan's #1 Earning Platform" },
    description: { type: String, default: "Noor Official V3 is a premium Pakistani platform for online earning." },
    keywords: { type: String, default: "online earning pakistan, easypaisa earning, jazzcash earning" }
  },
  appearance: {
    heroTitle: { type: String, default: "Start Earning Daily From Your Home." },
    heroSubtitle: { type: String, default: "Join the most trusted platform in Pakistan." },
    heroSlides: { type: Array, default: [] }
  }
};
