
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images_dir = path.join(__dirname, '..', 'public', 'images');
const document_requests_dir = path.join(__dirname, '..', 'public', 'uploads', 'document-requests');

if (!fs.existsSync(images_dir)) {
  fs.mkdirSync(images_dir, { recursive: true });
}

if (!fs.existsSync(document_requests_dir)) {
  fs.mkdirSync(document_requests_dir, { recursive: true });
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

const documentRequestStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, document_requests_dir);
  },
  filename: (req, file, cb) => {
    const rawRequestId = String(req.body?.requestId || req.params?.id || '').trim();
    const safeRequestId = rawRequestId.replace(/[^a-zA-Z0-9_-]/g, '') || 'request';
    const uniqueKey = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, `${safeRequestId}-${uniqueKey}${extension}`);
  }
});

export const uploadDocumentRequestFile = multer({
  storage: documentRequestStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = new Set([
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ]);
    const allowedExtensions = new Set(['.pdf', '.jpeg', '.jpg', '.png']);
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.has(file.mimetype) && allowedExtensions.has(extension)) {
      return cb(null, true);
    }

    cb(new Error('Solo se permiten archivos PDF, JPG, JPEG o PNG'));
  }
}).single('file');

