
const getPagesDB = () => {
  const data = localStorage.getItem('noor_pages_db');
  if (!data) {
    // Seed default content
    const defaults = [
      {
        slug: 'privacy',
        title: 'Privacy Policy',
        content: '<h1>Privacy Policy</h1><p>Welcome to Noor Official. Your privacy is our priority. We collect minimal data required for payment verification and account security. We never share your mobile number with third parties.</p><h3>Data Security</h3><p>All transaction screenshots are stored on secure nodes and deleted after audit.</p>'
      },
      {
        slug: 'terms',
        title: 'Terms of Service',
        content: '<h1>Terms of Service</h1><p>By using Noor Official V3, you agree to follow our community guidelines. Multi-accounting is strictly prohibited and will lead to an instant permanent ban without refund.</p><h3>Withdrawal Policy</h3><p>Payouts are processed within 24 hours. Minimum withdrawal is PKR 500.</p>'
      },
      {
        slug: 'about',
        title: 'About Noor Official',
        content: '<h1>About Us</h1><p>Noor Official V3 is Pakistan\'s leading digital earning platform. Founded in 2024, we aim to provide youth with consistent daily income through simple digital assignments.</p>'
      },
      {
        slug: 'contact',
        title: 'Contact Support',
        content: '<h1>Contact Us</h1><p>For support queries, please contact our WhatsApp team or email help@noorofficial.com. Our typical response time is under 10 minutes.</p>'
      }
    ];
    localStorage.setItem('noor_pages_db', JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(data);
};

const savePagesDB = (db: any[]) => {
  localStorage.setItem('noor_pages_db', JSON.stringify(db));
};

export const pageController = {
  getPage: async (req: any, res: any) => {
    const { slug } = req.params;
    const db = getPagesDB();
    const page = db.find((p: any) => p.slug === slug);
    if (!page) return res.status(404).json({ message: "Page not found" });
    return res.status(200).json(page);
  },

  updatePage: async (req: any, res: any) => {
    const { slug, title, content } = req.body;
    let db = getPagesDB();
    const index = db.findIndex((p: any) => p.slug === slug);
    
    if (index === -1) {
      db.push({ slug, title, content });
    } else {
      db[index] = { ...db[index], title, content };
    }

    savePagesDB(db);
    return res.status(200).json({ success: true, message: "CMS Content Synchronized" });
  },

  getAllSlugs: async (req: any, res: any) => {
    const db = getPagesDB();
    return res.status(200).json(db.map((p: any) => ({ slug: p.slug, title: p.title })));
  }
};
