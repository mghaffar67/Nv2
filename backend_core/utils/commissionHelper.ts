import { dbNode } from './db';

/**
 * Noor Official V3 - Multi-Tier Commission Protocol
 * Distributes yield across 3 levels of network nodes.
 */
export const distributeCommission = async (buyerId: string, amount: number) => {
  const buyer = await dbNode.findUserById(buyerId);
  if (!buyer) return;

  const currentUplineCode = buyer.referredBy || buyer.referred_by;
  if (!currentUplineCode) return;

  const config = await dbNode.getConfig();
  const tiers = [
    { level: 1, percent: config.referralSettings?.level1Percent || 15 },
    { level: 2, percent: config.referralSettings?.level2Percent || 5 },
    { level: 3, percent: config.referralSettings?.level3Percent || 2 }
  ];

  let nextUplineCode = currentUplineCode;

  for (const tier of tiers) {
    if (!nextUplineCode) break;

    const allUsers = await dbNode.getUsers();
    const upline = allUsers.find((u: any) => (u.referralCode === nextUplineCode || u.referral_code === nextUplineCode));
    
    // Integrity Check: Node must exist and not be banned
    if (!upline || upline.isBanned || upline.is_banned) break;

    const commissionAmount = Math.floor((amount * tier.percent) / 100);
    const currentBalance = Number(upline.balance) || 0;
    const newBalance = currentBalance + commissionAmount;

    const commissionTrx = {
      id: `COM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: 'reward',
      amount: commissionAmount,
      status: 'approved',
      gateway: `Tier ${tier.level} Bonus`,
      note: `Network Yield from Associate node ${buyer.name}'s upgrade.`,
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
    nextUplineCode = upline.referredBy || upline.referred_by;
  }
};