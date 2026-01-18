
/**
 * Noor Official V3 - Commission Distribution Node
 * Handles recursive rewards for 3-tier network hierarchy.
 */

const getDB = () => JSON.parse(localStorage.getItem('noor_mock_db') || '[]');
const saveDB = (db: any[]) => localStorage.setItem('noor_mock_db', JSON.stringify(db));

export const distributeCommission = async (buyerId: string, amount: number) => {
  let db = getDB();
  const buyer = db.find((u: any) => u.id === buyerId);
  if (!buyer || !buyer.referredBy) return;

  const tiers = [
    { level: 1, percent: 10, label: 'Direct Referral' },
    { level: 2, percent: 5, label: 'Secondary Referral' },
    { level: 3, percent: 2, label: 'Tertiary Referral' }
  ];

  let currentUplineCode = buyer.referredBy;

  for (const tier of tiers) {
    if (!currentUplineCode) break;

    const uplineIndex = db.findIndex((u: any) => u.referralCode === currentUplineCode);
    if (uplineIndex === -1) break;

    const upline = db[uplineIndex];
    
    // Safety check: Skip banned or invalid nodes
    if (upline.isBanned) {
      currentUplineCode = upline.referredBy;
      continue;
    }

    const commission = (amount * tier.percent) / 100;
    upline.balance = (Number(upline.balance) || 0) + commission;

    // Log the commission transaction
    const commissionTrx = {
      id: `COM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: upline.id,
      type: 'reward',
      amount: commission,
      status: 'approved',
      gateway: 'Network Reward',
      note: `${tier.label} bonus from ${buyer.name}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    if (!upline.transactions) upline.transactions = [];
    upline.transactions.unshift(commissionTrx);

    // Update session if this is the current logged-in user
    const sessionUser = JSON.parse(localStorage.getItem('noor_user') || '{}');
    if (sessionUser.id === upline.id) {
      localStorage.setItem('noor_user', JSON.stringify({ ...upline, password: undefined }));
    }

    // Move to next upline node
    currentUplineCode = upline.referredBy;
  }

  saveDB(db);
};
