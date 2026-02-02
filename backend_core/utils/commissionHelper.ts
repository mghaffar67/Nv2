
import { dbNode } from './db';

/**
 * Noor Official V3 - Multi-Tier Commission Protocol
 * Distributes yield across 3 levels of network nodes.
 */
export const distributeCommission = async (buyerId: string, amount: number) => {
  // Add await to fix Promise property access error
  const buyer = await dbNode.findUserById(buyerId);
  if (!buyer || !buyer.referredBy) return;

  // Add await to fix Promise property access error
  const config = await dbNode.getConfig();
  // Fix property access on Promise
  const tiers = [
    { level: 1, percent: config.referralSettings.level1Percent || 15 },
    { level: 2, percent: config.referralSettings.level2Percent || 5 },
    { level: 3, percent: config.referralSettings.level3Percent || 2 }
  ];

  // Fix property access on Promise
  let currentUplineCode = buyer.referredBy;

  for (const tier of tiers) {
    if (!currentUplineCode) break;

    // Add await to fix Promise find error
    const allUsers = await dbNode.getUsers();
    // Fix find on Promise error
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
      // Fix property access on Promise
      note: `Network Yield from node ${buyer.name}'s upgrade.`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    const trx = upline.transactions || [];
    trx.unshift(commissionTrx);

    // Save updated node state
    await dbNode.updateUser(upline.id, { 
      balance: newBalance, 
      transactions: trx 
    });

    // Move up the hierarchy
    currentUplineCode = upline.referredBy;
  }
};
