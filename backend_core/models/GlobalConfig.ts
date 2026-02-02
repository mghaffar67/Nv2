export const GlobalConfigSchema = {
  appName: { type: String, default: "Noor Official" },
  currency: { type: String, default: "PKR" },
  maintenanceMode: { type: Boolean, default: false },
  theme: {
    primaryColor: { type: String, default: "#6366F1" },
    secondaryColor: { type: String, default: "#0ea5e9" },
    accentColor: { type: String, default: "#6366F1" },
    fontFamily: { type: String, default: "'Plus Jakarta Sans', sans-serif" },
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
    default: [5, 10, 15, 20, 25, 50, 100] 
  },
  seo: {
    title: { type: String, default: "Noor V3 - Premium Earning Platform" },
    description: { type: String, default: "Join Noor V3 for daily earning opportunities in Pakistan with fast EasyPaisa and JazzCash payouts. Trusted by thousands." },
    keywords: { type: String, default: "online earning pakistan, easypaisa earning, jazzcash earning, Noor V3, M Ghaffar" }
  },
  appearance: {
    heroTitle: { type: String, default: "Start Earning Daily From Your Home." },
    heroSubtitle: { type: String, default: "Join the most trusted platform in Pakistan." },
    heroSlides: { type: Array, default: [] }
  }
};