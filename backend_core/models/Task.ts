/**
 * Noor Official V3 - Task Protocol Schema
 */

export type MediaNode = 'link' | 'image' | 'video' | 'pdf';

export interface ITask {
  id: string;
  title: string;
  instruction: string;
  reward: number;
  requiredPlan: string;
  mediaType: MediaNode;
  mediaUrl: string;
  assignmentType: 'all' | 'specific';
  targetUsers: string[]; // Array of User IDs if assignmentType is 'specific'
  validityDays: number; // How long the task remains active after creation
  timeLimitSeconds: number; // Seconds allowed to complete once started
  isActive: boolean;
  createdAt: string;
}

export const TaskSchema = {
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  reward: { type: Number, required: true, default: 0 },
  requiredPlan: { type: String, default: 'BASIC' },
  mediaType: { type: String, default: 'link' },
  mediaUrl: { type: String },
  assignmentType: { type: String, enum: ['all', 'specific'], default: 'all' },
  targetUsers: { type: Array, default: [] },
  validityDays: { type: Number, default: 30 },
  timeLimitSeconds: { type: Number, default: 600 }, // 10 minutes default
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
};