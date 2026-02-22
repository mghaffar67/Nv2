import multer from 'multer';
import multerS3 from 'multer-s3';
import s3Client from '../config/s3Config';
import path from 'path';

/**
 * Noor Official V3 - AWS Cloud Storage Engine
 * Handles Avatars, Evidence, and Branding Assets
 */
const isProduction = process.env.NODE_ENV === 'production';

const s3Storage = multerS3({
  s3: s3Client,
  bucket: process.env.AWS_BUCKET_NAME || 'noor-v3-assets',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const folder = file.fieldname === 'avatar' ? 'avatars' : 'audit_nodes';
    const fileName = `${folder}/${Date.now()}-${Math.floor(Math.random() * 1000)}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

export const uploadMiddleware = multer({
  storage: isProduction ? s3Storage : multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Registry Limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) return cb(null, true);
    cb(new Error("Registry violation: Only images, webp and PDF artifacts allowed."));
  }
});

export const handleUploadSync = (req: any) => {
  if (req.file) {
    // Return AWS Location URL in production, or fallback to buffer for dev
    return req.file.location || (req.file.buffer ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null);
  }
  return null;
};