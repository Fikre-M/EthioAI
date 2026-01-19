import { API_ENDPOINTS } from '../utils/constants';
import { apiClient } from './api';

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
  resourceType: 'image' | 'video' | 'raw';
  thumbnailUrl?: string;
  originalName?: string;
}

export interface UploadOptions {
  type?: 'profile' | 'product' | 'tour' | 'review' | 'document' | 'general';
  folder?: string;
  tags?: string;
  onProgress?: (progress: number) => void;
}

export interface OptimizedUrlOptions {
  width?: number;
  height?: number;
  quality?: 'auto:low' | 'auto:good' | 'auto:best' | 'auto:eco';
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif';
}

/**
 * Upload a single file
 */
export const uploadSingle = async (
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (options.type) formData.append('type', options.type);
  if (options.folder) formData.append('folder', options.folder);
  if (options.tags) formData.append('tags', options.tags);

  const response = await apiClient.post(API_ENDPOINTS.UPLOAD.SINGLE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (options.onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        options.onProgress(progress);
      }
    },
  });

  return response.data.data;
};

/**
 * Upload multiple files
 */
export const uploadMultiple = async (
  files: File[],
  options: UploadOptions = {}
): Promise<UploadResult[]> => {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('files', file);
  });
  
  if (options.type) formData.append('type', options.type);
  if (options.folder) formData.append('folder', options.folder);
  if (options.tags) formData.append('tags', options.tags);

  const response = await apiClient.post(API_ENDPOINTS.UPLOAD.MULTIPLE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (options.onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        options.onProgress(progress);
      }
    },
  });

  return response.data.data;
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('profileImage', file);

  const response = await apiClient.post(API_ENDPOINTS.UPLOAD.PROFILE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data.data;
};

/**
 * Upload product images
 */
export const uploadProductImages = async (
  productId: string,
  files: File[],
  onProgress?: (progress: number) => void
): Promise<UploadResult[]> => {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('images', file);
  });

  const response = await apiClient.post(API_ENDPOINTS.UPLOAD.PRODUCT(productId), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data.data;
};

/**
 * Upload tour images
 */
export const uploadTourImages = async (
  tourId: string,
  files: File[],
  onProgress?: (progress: number) => void
): Promise<UploadResult[]> => {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('images', file);
  });

  const response = await apiClient.post(API_ENDPOINTS.UPLOAD.TOUR(tourId), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data.data;
};

/**
 * Upload review media
 */
export const uploadReviewMedia = async (
  reviewId: string,
  files: File[],
  onProgress?: (progress: number) => void
): Promise<UploadResult[]> => {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('media', file);
  });

  const response = await apiClient.post(API_ENDPOINTS.UPLOAD.REVIEW(reviewId), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data.data;
};

/**
 * Delete uploaded file
 */
export const deleteFile = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.UPLOAD.DELETE(publicId), {
    data: { resourceType }
  });
};

/**
 * Generate optimized image URL
 */
export const generateOptimizedUrl = async (
  publicId: string,
  options: OptimizedUrlOptions = {}
): Promise<{
  originalPublicId: string;
  optimizedUrl: string;
  transformations: any[];
}> => {
  const response = await apiClient.get(API_ENDPOINTS.UPLOAD.OPTIMIZE(publicId), {
    params: options
  });

  return response.data.data;
};

/**
 * Validate file before upload
 */
export const validateFile = (
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    maxWidth?: number;
    maxHeight?: number;
  } = {}
): Promise<{ valid: boolean; error?: string }> => {
  return new Promise((resolve) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
      maxWidth = 2000,
      maxHeight = 2000
    } = options;

    // Check file size
    if (file.size > maxSize) {
      resolve({
        valid: false,
        error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${(maxSize / 1024 / 1024).toFixed(2)}MB)`
      });
      return;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      resolve({
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      });
      return;
    }

    // For images, check dimensions
    if (file.type.startsWith('image/')) {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        if (img.width > maxWidth || img.height > maxHeight) {
          resolve({
            valid: false,
            error: `Image dimensions (${img.width}x${img.height}) exceed maximum allowed dimensions (${maxWidth}x${maxHeight})`
          });
        } else {
          resolve({ valid: true });
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          valid: false,
          error: 'Invalid image file'
        });
      };
      
      img.src = url;
    } else {
      resolve({ valid: true });
    }
  });
};

/**
 * Get file preview URL
 */
export const getFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revoke file preview URL
 */
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file type category
 */
export const getFileTypeCategory = (file: File): 'image' | 'video' | 'document' | 'other' => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) return 'document';
  return 'other';
};

export default {
  uploadSingle,
  uploadMultiple,
  uploadProfileImage,
  uploadProductImages,
  uploadTourImages,
  uploadReviewMedia,
  deleteFile,
  generateOptimizedUrl,
  validateFile,
  getFilePreview,
  revokeFilePreview,
  formatFileSize,
  getFileTypeCategory
};