import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// File type validation
const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const allowedDocumentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'];

// File size limits (in bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

// Storage configuration for memory storage (for cloud upload)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const isImage = allowedImageTypes.includes(file.mimetype);
  const isDocument = allowedDocumentTypes.includes(file.mimetype);
  const isVideo = allowedVideoTypes.includes(file.mimetype);

  if (isImage || isDocument || isVideo) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: images, documents, videos`));
  }
};

// Size limit function
const limits = {
  fileSize: (req: Request, file: Express.Multer.File) => {
    if (allowedImageTypes.includes(file.mimetype)) {
      return MAX_IMAGE_SIZE;
    } else if (allowedDocumentTypes.includes(file.mimetype)) {
      return MAX_DOCUMENT_SIZE;
    } else if (allowedVideoTypes.includes(file.mimetype)) {
      return MAX_VIDEO_SIZE;
    }
    return MAX_IMAGE_SIZE; // Default
  }
};

// Base multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_VIDEO_SIZE, // Use the largest limit, we'll validate per file type in service
    files: 10 // Maximum 10 files per request
  }
});

// Specific upload configurations
export const uploadSingle = (fieldName: string) => upload.single(fieldName);
export const uploadMultiple = (fieldName: string, maxCount: number = 5) => upload.array(fieldName, maxCount);
export const uploadFields = (fields: { name: string; maxCount: number }[]) => upload.fields(fields);

// Profile image upload (single image)
export const uploadProfileImage = uploadSingle('profileImage');

// Product images upload (multiple images)
export const uploadProductImages = uploadMultiple('images', 10);

// Review media upload (multiple files - images and videos)
export const uploadReviewMedia = uploadMultiple('media', 5);

// Tour images upload (multiple images)
export const uploadTourImages = uploadMultiple('images', 15);

// Document upload (single document)
export const uploadDocument = uploadSingle('document');

// Mixed upload for complex forms
export const uploadMixed = uploadFields([
  { name: 'images', maxCount: 10 },
  { name: 'documents', maxCount: 3 },
  { name: 'videos', maxCount: 2 }
]);

// Validation helper functions
export const validateFileSize = (file: Express.Multer.File): boolean => {
  if (allowedImageTypes.includes(file.mimetype)) {
    return file.size <= MAX_IMAGE_SIZE;
  } else if (allowedDocumentTypes.includes(file.mimetype)) {
    return file.size <= MAX_DOCUMENT_SIZE;
  } else if (allowedVideoTypes.includes(file.mimetype)) {
    return file.size <= MAX_VIDEO_SIZE;
  }
  return false;
};

export const validateFileType = (file: Express.Multer.File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.mimetype);
};

export const generateFileName = (originalName: string): string => {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const timestamp = Date.now();
  const uuid = uuidv4().split('-')[0];
  return `${name}-${timestamp}-${uuid}${ext}`;
};

// File type detection helpers
export const isImage = (file: Express.Multer.File): boolean => {
  return allowedImageTypes.includes(file.mimetype);
};

export const isDocument = (file: Express.Multer.File): boolean => {
  return allowedDocumentTypes.includes(file.mimetype);
};

export const isVideo = (file: Express.Multer.File): boolean => {
  return allowedVideoTypes.includes(file.mimetype);
};

// Error handling middleware for multer errors
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File too large',
          code: 'FILE_TOO_LARGE'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files',
          code: 'TOO_MANY_FILES'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected file field',
          code: 'UNEXPECTED_FILE'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'File upload error',
          code: 'UPLOAD_ERROR'
        });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message,
      code: 'INVALID_FILE_TYPE'
    });
  }
  
  next(error);
};

export default upload;