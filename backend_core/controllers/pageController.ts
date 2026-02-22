
import { dbNode } from '../utils/db';

const DEFAULT_PAGES = [
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

const getPages = async () => {
  const contents = await dbNode.getPageContents();
  if (!contents || Object.keys(contents).length === 0) {
    // Convert array to object for storage if needed, or just store as array
    // The dbNode.getPageContents() returns {} by default.
    // Let's assume it stores an array of pages.
    return DEFAULT_PAGES;
  }
  return contents as any[];
};

export const pageController = {
  getPage: async (req: any, res: any) => {
    const { slug } = req.params;
    const pages = await getPages();
    const page = pages.find((p: any) => p.slug === slug);
    if (!page) return res.status(404).json({ message: "Page not found" });
    return res.status(200).json(page);
  },

  updatePage: async (req: any, res: any) => {
    const { slug, title, content } = req.body;
    let pages = await getPages();
    const index = pages.findIndex((p: any) => p.slug === slug);
    
    if (index === -1) {
      pages.push({ slug, title, content });
    } else {
      pages[index] = { ...pages[index], title, content };
    }

    await dbNode.savePageContents(pages);
    return res.status(200).json({ success: true, message: "CMS Content Synchronized" });
  },

  getAllSlugs: async (req: any, res: any) => {
    const pages = await getPages();
    return res.status(200).json(pages.map((p: any) => ({ slug: p.slug, title: p.title })));
  }
};
