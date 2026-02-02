
import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - SEO & Content Controller
 * Manages search engine presence and landing page hero nodes using Database persistence.
 */
export const seoController = {
  getPublicSEO: async (req: any, res: any) => {
    try {
      const config = await dbNode.getConfig();
      if (!config || Object.keys(config).length === 0) {
        return res.status(200).json({
          siteTitle: "Noor Official - Pakistani Earning Platform",
          metaDescription: "Join Noor V3, the #1 trusted platform for youth earning in Pakistan.",
          keywords: "online earning pakistan, easypaisa earning",
          heroTitle: "Daily Earnings. Simple Work.",
          heroSubtitle: "Simple tasks, daily payouts via EasyPaisa & JazzCash.",
          heroImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1920"
        });
      }

      return res.status(200).json({
        siteTitle: config.seo?.metaTitle || config.seo?.title || config.appName,
        metaDescription: config.seo?.metaDescription || config.seo?.description || "",
        keywords: config.seo?.keywords || "",
        heroTitle: config.appearance?.heroTitle || "",
        heroSubtitle: config.appearance?.heroSubtitle || "",
        heroImage: config.appearance?.heroSlides?.[0]?.image || config.appearance?.companyBanner || ""
      });
    } catch (e) {
      console.error("SEO Retrieval Failure:", e);
      return res.status(500).json({ message: "SEO Metadata Node failure." });
    }
  },

  updateSEO: async (req: any, res: any) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized access node." });
    }

    try {
      const { siteTitle, metaDescription, keywords, heroTitle, heroSubtitle, heroImage } = req.body;
      const config = await dbNode.getConfig();

      const updatedConfig = {
        ...config,
        seo: {
          ...config.seo,
          title: siteTitle || config.seo?.title,
          description: metaDescription || config.seo?.description,
          keywords: keywords || config.seo?.keywords
        },
        appearance: {
          ...config.appearance,
          heroTitle: heroTitle || config.appearance?.heroTitle,
          heroSubtitle: heroSubtitle || config.appearance?.heroSubtitle
        }
      };

      if (heroImage && updatedConfig.appearance.heroSlides.length > 0) {
        updatedConfig.appearance.heroSlides[0].image = heroImage;
      }

      await dbNode.saveConfig(updatedConfig);

      return res.status(200).json({
        success: true,
        message: "SEO Protocols synchronized.",
        data: updatedConfig
      });
    } catch (e) {
      return res.status(500).json({ message: "SEO Update node failed." });
    }
  }
};
