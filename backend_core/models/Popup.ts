export const PopupSchema = {
  name: { type: String, required: true },
  templateStyle: { 
    type: String, 
    enum: ['modern_modal', 'bottom_sheet', 'full_screen_offer'], 
    default: 'modern_modal' 
  },
  triggerDelay: { type: Number, default: 2 }, // Seconds
  frequency: { 
    type: String, 
    enum: ['once_per_session', 'once_daily', 'always', 'one_time_ever'], 
    default: 'once_daily' 
  },
  targetPages: { type: Array, default: ['/dashboard'] },
  targetAudience: { 
    type: String, 
    enum: ['all', 'free_users', 'vip_users'], 
    default: 'all' 
  },
  animationType: { 
    type: String, 
    enum: ['fade_in', 'slide_up', 'zoom_bounce'], 
    default: 'fade_in' 
  },
  content: { type: String, required: true }, // HTML or rich JSON
  title: { type: String },
  bodyText: { type: String },
  imageUrl: { type: String },
  btnText: { type: String, default: 'View' },
  btnAction: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
};