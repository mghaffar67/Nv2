import { dbNode } from '../../utils/db';

/**
 * Noor V3 - Global Site Content Controller (CMS)
 * Stores and manages all UI text and images.
 */
export const contentController = {
  // 1. PUBLIC: Fetch content for a specific page slug
  getContentBySlug: async (req: any, res: any) => {
    try {
      const { slug } = req.params;
      // Added await to fix Promise property access error
      const db = await dbNode.getPageContents(); // Existing DB utility
      
      // If content doesn't exist, return empty section to prevent crash
      const content = db[slug] || { 
        sections: getDefaultSeed(slug),
        lastUpdated: new Date().toISOString()
      };

      return res.status(200).json(content);
    } catch (e) {
      return res.status(500).json({ message: "Content Retrieval Node failure." });
    }
  },

  // 2. ADMIN: Update page content sections
  updateContent: async (req: any, res: any) => {
    try {
      const { slug, sections } = req.body;
      // Added await to fix Promise property access error
      const db = await dbNode.getPageContents();

      // Deep merge new data with existing to ensure no keys are lost
      const existingPage = db[slug] || { sections: {} };
      const updatedPage = {
        ...existingPage,
        sections: {
          ...existingPage.sections,
          ...sections
        },
        lastUpdated: new Date().toISOString()
      };

      db[slug] = updatedPage;
      // Added await to fix Promise execution
      await dbNode.savePageContents(db);

      return res.status(200).json({ 
        success: true, 
        message: "Site Content Synchronized.", 
        data: updatedPage 
      });
    } catch (e) {
      return res.status(500).json({ message: "CMS Deployment failure." });
    }
  }
};

/**
 * Default Content Seeder
 * Hardcoded fallbacks to ensure UI never looks empty
 */
function getDefaultSeed(slug: string) {
  const seeds: any = {
    auth_login: {
      hero_section: {
        title: "Welcome Back",
        subtitle: "Sign in to manage your earning station",
        side_img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800"
      },
      footer: {
        text: "Authorized Access Only"
      }
    },
    landing_home: {
      hero: {
        heading: "Daily Earnings. Simple Work.",
        subtext: "Join Pakistan's most trusted digital platform.",
        banner_img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1200"
      },
      features: {
        title: "Why Choose Noor?",
        card1_text: "Fast Payouts",
        card2_text: "24/7 Support"
      }
    }
  };
  return seeds[slug] || {};
}