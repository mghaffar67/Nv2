/**
 * Noor Official V3 - Master System Configuration
 */

export interface IModuleConfig {
  enabled: boolean;
  startTime?: string; // "HH:mm"
  endTime?: string;   // "HH:mm"
  message?: string;
  amount?: number;    // For daily claim or bonuses
}

export interface ISystemConfig {
  demoLogin: IModuleConfig;
  dailyClaim: IModuleConfig;
  workTasks: IModuleConfig;
  withdrawals: IModuleConfig;
  referralSystem: IModuleConfig;
  userBonus: IModuleConfig;
  changeLog: {
    adminId: string;
    action: string;
    timestamp: string;
  }[];
}

export const initialSystemConfig: ISystemConfig = {
  demoLogin: { enabled: true },
  dailyClaim: { enabled: true, amount: 50 },
  workTasks: { enabled: true, startTime: "09:00", endTime: "22:00" },
  // Fixed: using startTime and endTime to satisfy IModuleConfig and middleware logic
  withdrawals: { enabled: true, startTime: "10:00", endTime: "18:00", message: "Payments are processed within 24 hours." },
  referralSystem: { enabled: true, amount: 300 },
  userBonus: { enabled: false },
  changeLog: []
};