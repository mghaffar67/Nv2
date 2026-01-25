
/**
 * Noor Official V3 - Secure Upload Pipeline
 * Simulates Multer logic to process multipart/form-data for transaction evidence and task assets.
 */
export const uploadMiddleware = {
  single: (fieldName: string) => (req: any, res: any, next: any) => {
    // Logic to extract file from body (simulation for browser/mock environments)
    const file = req.body?.[fieldName] || (req.files && req.files[fieldName]);
    
    if (file) {
      // Determine mimetype (simulation)
      let mimetype = 'image/png';
      if (typeof file === 'string' && file.startsWith('data:application/pdf')) {
        mimetype = 'application/pdf';
      }

      req.file = {
        fieldname: fieldName,
        originalname: `asset-${Date.now()}.${mimetype === 'application/pdf' ? 'pdf' : 'png'}`,
        mimetype: mimetype,
        filename: `node-asset-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        path: typeof file === 'string' ? file : URL.createObjectURL(file), // Support for preview paths
        size: 1024 * 1024 * 5 // Mock 5MB
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
