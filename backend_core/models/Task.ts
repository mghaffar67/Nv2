
/**
 * Noor Official V3 - Task Protocol Schema
 */

export type MediaNode = 'link' | 'image' | 'video' | 'pdf';
export type TaskCategory = 'data_entry' | 'social_media' | 'content_creation' | 'verification' | 'network';

export interface ITask {
  id: string;
  title: string;
  category: TaskCategory;
  instruction: string;
  reward: number;
  plan: string; // station station/plan
  mediaType: MediaNode;
  mediaUrl: string;
  assignmentType: 'all' | 'specific';
  targetUsers: string[]; 
  validityDays: number; 
  timeLimitSeconds: number; 
  isActive: boolean;
  createdAt: string;
}

export const TaskSchema = {
  title: { type: String, required: true },
  category: { type: String, default: 'verification' },
  instruction: { type: String, required: true },
  reward: { type: Number, required: true, default: 0 },
  plan: { type: String, default: 'BASIC' },
  mediaType: { type: String, default: 'link' },
  mediaUrl: { type: String },
  assignmentType: { type: String, enum: ['all', 'specific'], default: 'all' },
  targetUsers: { type: Array, default: [] },
  validityDays: { type: Number, default: 30 },
  timeLimitSeconds: { type: Number, default: 600 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
};
