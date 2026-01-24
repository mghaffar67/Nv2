
import { dbNode } from './db';

/**
 * Noor Official V3 - Multi-Tier Commission Protocol
 * Distributes yield across 3 levels of network nodes.
 */
export const distributeCommission = async (buyerId: string, amount: number) => {
  const buyer = dbNode.findUserById(buyerId);
  if (!buyer || !buyer.referredBy) return;

  const config = dbNode.getConfig();
  const tiers = [
    { level: 1, percent: config.referralSettings.level1Percent || 15 },
    { level: 2, percent: config.referralSettings.level2Percent || 5 },
    { level: 3, percent: config.referralSettings.level3Percent || 2 }
  ];

  let currentUplineCode = buyer.referredBy;

  for (const tier of tiers) {
    if (!currentUplineCode) break;

    const allUsers = dbNode.getUsers();
    const upline = allUsers.find((u: any) => u.referralCode === currentUplineCode);
    
    // Integrity Check: Node must exist and not be banned
    if (!upline || upline.isBanned) break;

    const commissionAmount = Math.floor((amount * tier.percent) / 100);
    const newBalance = (Number(upline.balance) || 0) + commissionAmount;

    const commissionTrx = {
      id: `COM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: 'reward',
      amount: commissionAmount,
      status: 'approved',
      gateway: `L${tier.level} Referral Bonus`,
      note: `Network Yield from node ${buyer.name}'s upgrade.`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    const trx = upline.transactions || [];
    trx.unshift(commissionTrx);

    // Save updated node state
    dbNode.updateUser(upline.id, { 
      balance: newBalance, 
      transactions: trx 
    });

    // Move up the hierarchy
    currentUplineCode = upline.referredBy;
  }
};
