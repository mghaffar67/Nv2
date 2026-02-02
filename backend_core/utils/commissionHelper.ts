import { dbNode } from './db';

/**
 * Noor Official V3 - Fixed Referral Bonus Protocol
 * Credits the direct upline a specific amount based on the plan purchased.
 */
export const distributeCommission = async (buyerId: string, planName: string) => {
  const buyer = dbNode.findUserById(buyerId);
  if (!buyer || !buyer.referredBy) return;

  // 1. Identify the referral bonus from registry
  const plansRegistry = JSON.parse(localStorage.getItem('noor_plans_registry') || '[]');
  const purchasedPlan = plansRegistry.find((p: any) => p.name === planName.toUpperCase());
  
  if (!purchasedPlan) return;

  const bonusAmount = purchasedPlan.referralBonus;
  const uplineCode = buyer.referredBy;

  const allUsers = dbNode.getUsers();
  const upline = allUsers.find((u: any) => u.referralCode === uplineCode);
  
  // Security Check: Node must exist and not be banned
  if (!upline || upline.isBanned) return;

  const newBalance = (Number(upline.balance) || 0) + bonusAmount;

  const bonusTrx = {
    id: `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    type: 'reward',
    amount: bonusAmount,
    status: 'approved',
    gateway: `Referral Bonus`,
    note: `Incentive for inviting ${buyer.name} (Plan: ${planName})`,
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString()
  };

  const trx = upline.transactions || [];
  trx.unshift(bonusTrx);

  // Update direct referrer's ledger
  dbNode.updateUser(upline.id, { 
    balance: newBalance, 
    transactions: trx 
  });
  
  console.log(`💰 Credited Rs. ${bonusAmount} to ${upline.name} for referral.`);
};