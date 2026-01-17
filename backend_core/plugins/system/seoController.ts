
/**
 * Noor Official V3 - SEO & Content Controller
 * Manages search engine presence and landing page hero nodes.
 */

const getConfig = () => {
  const data = localStorage.getItem('noor_config');
  return data ? JSON.parse(data) : null;
};

const saveConfig = (config: any) => {
  localStorage.setItem('noor_config', JSON.stringify(config));
};

export const seoController = {
  // Publicly available metadata for Landing Page
  getPublicSEO: async (req: any, res: any) => {
    const config = getConfig();
    if (!config) return res.status(404).json({ message: "Config not found." });

    return res.status(200).json({
      siteTitle: config.seo.title,
      metaDescription: config.seo.description,
      keywords: config.seo.keywords,
      heroTitle: config.appearance.heroTitle,
      heroSubtitle: config.appearance.heroSubtitle,
      heroImage: config.appearance.heroSlides?.[0]?.image || ''
    });
  },

  // Admin restricted update logic
  updateSEO: async (req: any, res: any) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized access node." });
    }

    const { siteTitle, metaDescription, keywords, heroTitle, heroSubtitle, heroImage } = req.body;
    const config = getConfig();

    const updatedConfig = {
      ...config,
      seo: {
        title: siteTitle || config.seo.title,
        description: metaDescription || config.seo.description,
        keywords: keywords || config.seo.keywords
      },
      appearance: {
        ...config.appearance,
        heroTitle: heroTitle || config.appearance.heroTitle,
        heroSubtitle: heroSubtitle || config.appearance.heroSubtitle
      }
    };

    // Update the first slide image if heroImage is provided
    if (heroImage && updatedConfig.appearance.heroSlides.length > 0) {
      updatedConfig.appearance.heroSlides[0].image = heroImage;
    } else if (heroImage) {
      updatedConfig.appearance.heroSlides.unshift({
        image: heroImage,
        title: heroTitle,
        subtitle: heroSubtitle
      });
    }

    saveConfig(updatedConfig);

    return res.status(200).json({
      success: true,
      message: "SEO Protocols synchronized.",
      data: updatedConfig
    });
  }
};
