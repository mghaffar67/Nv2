
import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - Settings Node Controller
 * Handles Branding, Identity and Contact Protocols.
 */
export const settingsController = {
  updateCompanyProfile: async (req: any, res: any) => {
    try {
      const { appName, supportPhone, whatsappNumber, supportEmail, address } = req.body;
      const config = dbNode.getConfig();

      // Identity Logic: Keep old assets if new ones aren't provided
      const updatedBranding = {
        ...config.branding,
        companyName: appName || config.branding.companyName,
        contactPhone: supportPhone || config.branding.contactPhone,
        supportPhone: whatsappNumber || config.branding.supportPhone,
        // New business fields
        supportEmail: supportEmail || config.branding.supportEmail || "",
        officeAddress: address || config.branding.officeAddress || ""
      };

      // File Payload Management (Asset Injection)
      if (req.file) {
        updatedBranding.logo = req.file.path;
      }

      // Sync with Master Registry
      const newConfig = {
        ...config,
        appName: appName || config.appName,
        branding: updatedBranding
      };

      dbNode.saveConfig(newConfig);

      return res.status(200).json({
        success: true,
        message: "Brand Configuration Synchronized.",
        config: newConfig
      });
    } catch (err) {
      console.error("Settings Sync Failure:", err);
      return res.status(500).json({ message: "Identity update node failed." });
    }
  }
};
