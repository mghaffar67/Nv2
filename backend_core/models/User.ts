
/**
 * Noor Official V3 - Unified Identity Schema
 * Optimized for high-speed ledger synchronization.
 */

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'user' | 'admin';
  balance: number;
  depositBalance: number;
  currentPlan: string | null;
  planExpiry: string | null;
  streak: number;
  lastCheckIn: string | null;
  referralCode: string;
  referredBy: string | null;
  isBanned: boolean;
  withdrawalInfo: {
    provider: string;
    accountNumber: string;
    accountTitle: string;
  };
  transactions: any[];
  workSubmissions: any[];
  createdAt: string;
}

// User Schema Blueprint with Deep Defaults
export const UserSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  balance: { type: Number, default: 0 },
  depositBalance: { type: Number, default: 0 },
  currentPlan: { type: String, default: 'None' },
  planExpiry: { type: String, default: null },
  streak: { type: Number, default: 0 },
  lastCheckIn: { type: String, default: null },
  referralCode: { type: String, required: true },
  referredBy: { type: String, default: null },
  isBanned: { type: Boolean, default: false },
  withdrawalInfo: {
    provider: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    accountTitle: { type: String, default: '' }
  },
  transactions: { type: Array, default: [] },
  workSubmissions: { type: Array, default: [] },
  createdAt: { type: String, default: () => new Date().toISOString() }
};

export const generateRefCode = (name: string) => {
  const prefix = (name || 'USR').substring(0, 3).toUpperCase();
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
};
