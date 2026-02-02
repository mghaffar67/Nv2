import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - Page Content Controller
 * Manages text injections for the Website and UI.
 */
export const pageContentController = {
  getPageContent: async (req: any, res: any) => {
    try {
      const { pageKey } = req.params;
      // Added await to fix Promise property access error
      const db = await dbNode.getPageContents();
      
      // Seed default if missing to prevent UI crashes
      if (!db[pageKey]) {
        const defaults: any = {
          home: { sections: { heroTitle: "Start Earning Daily", heroSubtitle: "Pakistan's Most Trusted Node", planTitle: "Premium Plans" } },
          about: { sections: { mainTitle: "Our Mission", mission: "Providing reliable income nodes." } },
          terms: { sections: { termsContent: "Be honest. No multi-accounting allowed." } }
        };
        return res.status(200).json(defaults[pageKey] || { sections: {} });
      }

      return res.status(200).json(db[pageKey]);
    } catch (e) {
      return res.status(500).json({ message: "Content Retrieval Failure." });
    }
  },

  updatePageContent: async (req: any, res: any) => {
    try {
      const { pageKey, sections } = req.body;
      // Added await to fix Promise property access error
      const db = await dbNode.getPageContents();
      
      db[pageKey] = {
        pageKey,
        sections: {
          ...(db[pageKey]?.sections || {}),
          ...sections
        },
        updatedAt: new Date().toISOString()
      };

      // Added await to fix Promise execution
      await dbNode.savePageContents(db);
      return res.status(200).json({ 
        success: true, 
        message: "Production nodes synchronized.",
        updatedAt: db[pageKey].updatedAt 
      });
    } catch (e) {
      return res.status(500).json({ message: "Deployment logic failed." });
    }
  }
};