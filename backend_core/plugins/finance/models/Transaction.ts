
/**
 * Noor Official V3 - Transaction Model
 * Represents a single financial event in the ledger.
 */

export type TransactionStatus = 'pending' | 'approved' | 'rejected';
export type TransactionType = 'deposit' | 'withdraw' | 'reward';

export interface ITransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  method: string; // e.g., 'EasyPaisa', 'JazzCash'
  status: TransactionStatus;
  proofImage?: string; // Base64 or path for deposits
  senderNumber?: string; // Number from which payment was sent
  trxId?: string; // Gateway transaction ID
  details?: {
    accountNumber: string;
    accountTitle: string;
  };
  adminRemark?: string;
  date: string;
  timestamp: string;
}

export const TransactionSchema = {
  userId: { type: String, required: true },
  type: { type: String, enum: ['deposit', 'withdraw', 'reward'], required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  status: { type: String, default: 'pending' },
  proofImage: { type: String },
  senderNumber: { type: String },
  trxId: { type: String },
  details: {
    accountNumber: String,
    accountTitle: String
  },
  createdAt: { type: Date, default: Date.now }
};
