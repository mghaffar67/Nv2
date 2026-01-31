import multer from 'multer';
import multerS3 from 'multer-s3';
import s3Client from '../config/s3Config';
import path from 'path';

/**
 * Noor Official V3 - AWS Cloud Storage Engine
 */
const isProduction = process.env.NODE_ENV === 'production';

// Production Logic: Stream directly to S3
const s3Storage = multerS3({
  s3: s3Client,
  bucket: process.env.AWS_BUCKET_NAME || 'noor-v3-assets',
  acl: 'public-read', // Ensure bucket permissions allow ACLs
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName = `audit_nodes/${Date.now()}-${Math.floor(Math.random() * 1000)}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

export const uploadMiddleware = multer({
  storage: isProduction ? s3Storage : multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Node Limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) return cb(null, true);
    cb(new Error("Registry violation: Only images and PDF artifacts allowed."));
  }
});

/**
 * Noor V3 - Express adaptation for Vercel req.file
 * Note: req.file.location contains the AWS URL string
 */
export const handleUploadSync = (req: any) => {
  if (req.file) {
    return req.file.location || req.file.path || (req.file.buffer ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null);
  }
  return null;
};