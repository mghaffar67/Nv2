import { dbNode } from '../utils/db';

/**
 * Noor Official V3 - Database Seeder
 * Purpose: Initialize Earning Stations (Plans) with strict V3 logic.
 */
export const seedPlans = () => {
  const plans = [
    {
      id: 'PLAN-BASIC',
      name: 'BASIC',
      price: 1000,
      dailyLimit: 1, // 1 Page per day
      dailyEarning: 240, // 1 * 240
      referralBonus: 300,
      validityDays: 365,
      color: '#4A6CF7'
    },
    {
      id: 'PLAN-STANDARD',
      name: 'STANDARD',
      price: 2000,
      dailyLimit: 2, // 2 Pages per day
      dailyEarning: 480, // 2 * 240
      referralBonus: 500,
      validityDays: 365,
      color: '#2EC4B6'
    },
    {
      id: 'PLAN-GOLD',
      name: 'GOLD',
      price: 3500,
      dailyLimit: 3, // 3 Pages per day
      dailyEarning: 720, // 3 * 240
      referralBonus: 800,
      validityDays: 365,
      color: '#F4C430'
    },
    {
      id: 'PLAN-DIAMOND',
      name: 'DIAMOND',
      price: 6000,
      dailyLimit: 4, // 4 Pages per day
      dailyEarning: 960, // 4 * 240
      referralBonus: 1200,
      validityDays: 365,
      color: '#7B61FF'
    }
  ];

  // Save to master registry for logic lookups
  localStorage.setItem('noor_plans_registry', JSON.stringify(plans));
  console.log("✅ V3 Earning Stations Synchronized.");
  return plans;
};