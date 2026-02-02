/**
 * Noor Official V3 - Mission Protocol
 */

export type MissionTrigger = 'TASK_COUNT' | 'REFERRAL_COUNT' | 'STREAK_DAYS' | 'TOTAL_WITHDRAW';

export interface IMission {
  id: string;
  title: string;
  description: string;
  type: MissionTrigger;
  targetValue: number;
  rewardAmount: number;
  isActive: boolean;
  iconType: string;
}

export const MissionSchema = {
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['TASK_COUNT', 'REFERRAL_COUNT', 'STREAK_DAYS', 'TOTAL_WITHDRAW'], required: true },
  targetValue: { type: Number, required: true, min: 1 },
  rewardAmount: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true },
  iconType: { type: String, default: 'Zap' }
};