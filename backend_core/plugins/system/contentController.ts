import { dbNode } from '../../utils/db';

/**
 * Noor V3 - Site Content Controller (CMS Engine)
 * Manages all UI text nodes and document registries.
 */
export const contentController = {
  // PUBLIC: Fetch content for a specific page slug
  getPageContent: async (req: any, res: any) => {
    try {
      const { slug } = req.params;
      if (!slug) return res.status(400).json({ message: "Slug identifier required." });

      const normalizedSlug = slug.toLowerCase();
      
      // Fetch current CMS Registry from DB
      const db = await dbNode.getPageContents() || {}; 
      const content = db[normalizedSlug] || db[slug];

      if (!content) {
        // SAFE SEEDER: Return Default JSON Object instead of sending 404 to stabilize Frontend
        console.warn(`[CMS_NODE] Document '${slug}' missing. Providing identity fallback.`);
        return res.status(200).json({
          sections: getDefaultSeed(normalizedSlug),
          lastUpdated: new Date().toISOString(),
          isDefault: true,
          status: "Synchronized via Safe Seeder"
        });
      }

      return res.status(200).json(content);
    } catch (e) {
      console.error("[CMS_CRITICAL] Sync failure:", e);
      return res.status(200).json({
        sections: { 
          title: "Registry Syncing...", 
          content: "<p>Retrieving document from master cluster. Please wait.</p>" 
        },
        error: "Sync Failure"
      });
    }
  },

  // ADMIN: Update page content sections
  updateContent: async (req: any, res: any) => {
    try {
      const { slug, sections } = req.body;
      if (!slug) return res.status(400).json({ message: "Slug identifier required." });

      const db = await dbNode.getPageContents() || {};
      const normalizedSlug = slug.toLowerCase();
      
      const existingPage = db[normalizedSlug] || { sections: {} };
      
      const updatedPage = {
        ...existingPage,
        sections: {
          ...existingPage.sections,
          ...sections
        },
        lastUpdated: new Date().toISOString()
      };

      db[normalizedSlug] = updatedPage;
      await dbNode.savePageContents(db);

      return res.status(200).json({ 
        success: true, 
        message: "Registry Node Updated.", 
        data: updatedPage 
      });
    } catch (e) {
      return res.status(500).json({ message: "Deployment logic failure." });
    }
  }
};

/**
 * PRODUCTION DEFAULT SEEDER
 * Provides hardcoded text if the database node is empty.
 * Localized for Noor V3 Pakistani Ecosystem.
 */
function getDefaultSeed(slug: string) {
  const seeds: Record<string, any> = {
    privacy: {
      title: "Privacy Protocol",
      content: "<h1>Identity Privacy</h1><p>Welcome to Noor Official. We protect your earning node data with high-level encryption. Your mobile ID and payout details are never shared with external entities.</p>"
    },
    terms: {
      title: "Service Ledger",
      content: "<h1>Terms of Work</h1><p>By using Noor V3, you agree to our anti-fraud protocols. Multi-accounting results in permanent node termination without refund.</p>"
    },
    about: {
      title: "Our Infrastructure",
      content: "<h1>About Noor V3</h1><p>Noor Official is Pakistan's leading digital work cluster, providing students and freelancers with a stable yield stream since 2024.</p>"
    },
    landing_home: {
      title: "Landing Hub",
      content: "<h1>Earning Station Active</h1><p>Start your journey as an authorized associate today.</p>"
    }
  };

  return seeds[slug] || { 
    title: "System Node", 
    content: "<p>Content synchronization in progress. Please refresh the station hub.</p>" 
  };
}