import { dbNode } from './db';

/**
 * Noor Official V3 - Multi-Tier Commission Protocol
 * Distributes yield across 3 levels of network nodes.
 */
export const distributeCommission = async (buyerId: string, amount: number) => {
  const buyer = await dbNode.findUserById(buyerId);
  if (!buyer) return;

  let currentUplineCode = buyer.referred_by || buyer.referredBy;
  if (!currentUplineCode) return;

  const config = await dbNode.getConfig();
  const tiers = [
    { level: 1, percent: config.referralSettings?.level1Percent || 15 },
    { level: 2, percent: config.referralSettings?.level2Percent || 5 },
    { level: 3, percent: config.referralSettings?.level3Percent || 2 }
  ];

  for (const tier of tiers) {
    if (!currentUplineCode) break;

    const upline = await dbNode.findUserByReferralCode(currentUplineCode);
    
    // Integrity Check: Node must exist and not be banned
    if (!upline || upline.is_banned || upline.isBanned) break;

    const commissionAmount = Math.floor((amount * tier.percent) / 100);
    if (commissionAmount > 0) {
      const currentBalance = Number(upline.balance) || 0;
      const newBalance = currentBalance + commissionAmount;

      // Create transaction record
      await dbNode.createTransaction({
        userId: upline.id,
        type: 'reward',
        amount: commissionAmount,
        status: 'approved',
        gateway: `Tier ${tier.level} Bonus`,
        adminNote: `Network Yield from Associate node ${buyer.name}'s upgrade.`,
        trxId: `COM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      });

      // Update user balance
      await dbNode.updateUser(upline.id, { balance: newBalance });
    }

    // Move up the hierarchy
    currentUplineCode = upline.referred_by || upline.referredBy;
  }
};