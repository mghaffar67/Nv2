
export type MediaNode = 'link' | 'image' | 'video' | 'pdf';

export const TaskSchema = {
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  reward: { type: Number, required: true, default: 0 },
  requiredPlan: { 
    type: String, 
    enum: ['BASIC', 'GOLD', 'DIAMOND'], 
    default: 'BASIC' 
  },
  mediaType: { 
    type: String, 
    enum: ['link', 'image', 'video', 'pdf'], 
    default: 'link' 
  },
  mediaUrl: { type: String },
  targetUsers: { type: Array, default: [] }, // Specific User IDs for targeting
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
};
