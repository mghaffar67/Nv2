import { dbNode } from './db';

/**
 * Noor Official V3 - Multi-Tier Commission Protocol
 * Distributes yield across 3 levels of network nodes.
 */
export const distributeCommission = async (buyerId: string, amount: number) => {
  // Fix: Added await to async db call
  const buyer = await dbNode.findUserById(buyerId);
  // Fix: Property access on awaited object
  if (!buyer || !buyer.referredBy) return;

  // Fix: Added await to async db call
  const config = await dbNode.getConfig();
  // Fix: Property access on awaited object
  const tiers = [
    { level: 1, percent: config.referralSettings.level1Percent || 15 },
    { level: 2, percent: config.referralSettings.level2Percent || 5 },
    { level: 3, percent: config.referralSettings.level3Percent || 2 }
  ];

  // Fix: Property access on awaited object
  let currentUplineCode = buyer.referredBy;

  for (const tier of tiers) {
    if (!currentUplineCode) break;

    // Fix: Added await to async db call
    const allUsers = await dbNode.getUsers();
    // Fix: allUsers is now the array from awaited promise
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
      // Fix: Proper name access on buyer
      note: `Network Yield from node ${buyer.name}'s upgrade.`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    const trx = upline.transactions || [];
    trx.unshift(commissionTrx);

    // Save updated node state
    // Fix: Added await to async db call
    await dbNode.updateUser(upline.id, { 
      balance: newBalance, 
      transactions: trx 
    });

    // Move up the hierarchy
    currentUplineCode = upline.referredBy;
  }
};