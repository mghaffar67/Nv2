
/**
 * Noor Official V3 - Secure Upload Pipeline
 * Simulates Multer logic to process multipart/form-data for transaction evidence.
 */
export const uploadMiddleware = {
  single: (fieldName: string) => (req: any, res: any, next: any) => {
    // Logic to extract file from body (simulation for browser/mock environments)
    const file = req.body?.[fieldName] || (req.files && req.files[fieldName]);
    
    if (file) {
      req.file = {
        fieldname: fieldName,
        originalname: `evidence-${Date.now()}.png`,
        mimetype: 'image/png',
        filename: `proof-${Date.now()}-${Math.floor(Math.random() * 1000)}.png`,
        path: typeof file === 'string' ? file : URL.createObjectURL(file), // Support for preview paths
        size: 1024 * 500 // Mock 500KB
      };
    }

    // Critical security check for deposits
    if (req.path.includes('deposit') && !req.file && !req.body.image) {
      return res.status(400).json({ 
        success: false, 
        message: 'Security Protocol Violation: Transaction evidence (screenshot) is missing.' 
      });
    }

    next();
  }
};
