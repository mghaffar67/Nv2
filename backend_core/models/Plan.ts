/**
 * Noor Official V3 - Plan Schema
 */

export interface IPlan {
  id: string;
  name: string;
  price: number;
  dailyLimit: number; // Number of tasks/pages
  dailyEarning: number; // Calculated PKR per day
  referralBonus: number; // Reward to upline
  isActive: boolean;
  isPopular: boolean;
  colorTheme: string; // Hex code for UI
  validityDays: number;
}

export const PlanSchema = {
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  dailyLimit: { type: Number, required: true, min: 1 },
  dailyEarning: { type: Number, required: true },
  referralBonus: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  colorTheme: { type: String, default: '#4A6CF7' },
  validityDays: { type: Number, default: 365 }
};