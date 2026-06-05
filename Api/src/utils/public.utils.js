
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images_dir = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(images_dir)) {
  fs.mkdirSync(images_dir, { recursive: true });
}

export const getFrontendImg = (fileName) => {
  return path.join(images_dir, fileName);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, images_dir);
  },
  filename: (req, file, cb) => {
    const rawUserId = String(req.body?.userId || '').trim();
    const safeUserId = rawUserId.replace(/[^a-zA-Z0-9_-]/g, '') || 'staff';
    const uniqueKey = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, `${safeUserId}-${uniqueKey}${extension}`);
  }
});

export const uploadLogo = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = new Set(['image/jpeg', 'image/jpg', 'image/png']);
    const allowedExtensions = new Set(['.jpeg', '.jpg', '.png']);
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.has(file.mimetype) && allowedExtensions.has(extension)) {
      return cb(null, true);
    }

    cb(new Error('Solo se permiten imagenes (jpeg, jpg, png)'));
  }
}).single('logo');

