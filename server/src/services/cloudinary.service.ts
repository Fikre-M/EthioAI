import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';
import { log } from '../utils/logger';
import { generateFileName, isImage, isVideo, isDocument } from '../middlewares/upload.middleware';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true
});

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  resourceType: 'image' | 'video' | 'raw';
}

export interface UploadOptions {
  folder?: string;
  transformation?: any[];
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  publicId?: string;
  overwrite?: boolean;
  tags?: string[];
}

/**
 * Upload a single file to Cloudinary
 */
export const uploadToCloudinary = async (
  file: Express.Multer.File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  try {
    // Determine resource type based on file
    let resourceType: 'image' | 'video' | 'raw' = 'raw';
    if (isImage(file)) {
      resourceType = 'image';
    } else if (isVideo(file)) {
      resourceType = 'video';
    }

    // Generate unique filename if not provided
    const publicId = options.publicId || generateFileName(file.originalname).split('.')[0];

    // Default upload options
    const uploadOptions = {
      resource_type: options.resourceType || resourceType,
      public_id: publicId,
      folder: options.folder || 'ethioai-tourism',
      overwrite: options.overwrite || false,
      tags: options.tags || [],
      ...options
    };

    // Add image-specific optimizations
    if (resourceType === 'image') {
      uploadOptions.transformation = options.transformation || [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ];
    }

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            log.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(file.buffer);
    });

    log.info('File uploaded to Cloudinary:', {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      bytes: result.bytes
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      resourceType: result.resource_type
    };

  } catch (error) {
    log.error('Error uploading to Cloudinary:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Upload multiple files to Cloudinary
 */
export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[],
  options: UploadOptions = {}
): Promise<UploadResult[]> => {
  try {
    const uploadPromises = files.map((file, index) => {
      const fileOptions = {
        ...options,
        publicId: options.publicId ? `${options.publicId}_${index}` : undefined
      };
      return uploadToCloudinary(file, fileOptions);
    });

    const results = await Promise.all(uploadPromises);
    log.info(`Uploaded ${results.length} files to Cloudinary`);
    
    return results;
  } catch (error) {
    log.error('Error uploading multiple files to Cloudinary:', error);
    throw new Error(`Failed to upload files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete a file from Cloudinary
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    if (result.result === 'ok') {
      log.info('File deleted from Cloudinary:', publicId);
    } else {
      log.warn('File not found or already deleted:', publicId);
    }
  } catch (error) {
    log.error('Error deleting from Cloudinary:', error);
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete multiple files from Cloudinary
 */
export const deleteMultipleFromCloudinary = async (
  publicIds: string[],
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<void> => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType
    });

    log.info('Multiple files deleted from Cloudinary:', {
      deleted: Object.keys(result.deleted).length,
      notFound: Object.keys(result.not_found || {}).length
    });
  } catch (error) {
    log.error('Error deleting multiple files from Cloudinary:', error);
    throw new Error(`Failed to delete files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate optimized image URL with transformations
 */
export const generateOptimizedUrl = (
  publicId: string,
  transformations: any[] = []
): string => {
  const defaultTransformations = [
    { quality: 'auto:good' },
    { fetch_format: 'auto' }
  ];

  return cloudinary.url(publicId, {
    transformation: [...defaultTransformations, ...transformations],
    secure: true
  });
};

/**
 * Generate thumbnail URL
 */
export const generateThumbnailUrl = (
  publicId: string,
  width: number = 300,
  height: number = 300
): string => {
  return generateOptimizedUrl(publicId, [
    { width, height, crop: 'fill', gravity: 'auto' }
  ]);
};

/**
 * Upload profile image with specific optimizations
 */
export const uploadProfileImage = async (
  file: Express.Multer.File,
  userId: string
): Promise<UploadResult> => {
  return uploadToCloudinary(file, {
    folder: 'ethioai-tourism/profiles',
    publicId: `profile_${userId}`,
    overwrite: true,
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    tags: ['profile', 'user']
  });
};

/**
 * Upload product images with specific optimizations
 */
export const uploadProductImages = async (
  files: Express.Multer.File[],
  productId: string
): Promise<UploadResult[]> => {
  return uploadMultipleToCloudinary(files, {
    folder: 'ethioai-tourism/products',
    publicId: `product_${productId}`,
    transformation: [
      { width: 800, height: 600, crop: 'fill' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    tags: ['product', 'marketplace']
  });
};

/**
 * Upload tour images with specific optimizations
 */
export const uploadTourImages = async (
  files: Express.Multer.File[],
  tourId: string
): Promise<UploadResult[]> => {
  return uploadMultipleToCloudinary(files, {
    folder: 'ethioai-tourism/tours',
    publicId: `tour_${tourId}`,
    transformation: [
      { width: 1200, height: 800, crop: 'fill' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    tags: ['tour', 'travel']
  });
};

/**
 * Upload review media (images and videos)
 */
export const uploadReviewMedia = async (
  files: Express.Multer.File[],
  reviewId: string
): Promise<UploadResult[]> => {
  return uploadMultipleToCloudinary(files, {
    folder: 'ethioai-tourism/reviews',
    publicId: `review_${reviewId}`,
    transformation: [
      { width: 600, height: 400, crop: 'fill' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    tags: ['review', 'user-content']
  });
};

/**
 * Get file info from Cloudinary
 */
export const getFileInfo = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<any> => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    log.error('Error getting file info from Cloudinary:', error);
    throw new Error(`Failed to get file info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * List files in a folder
 */
export const listFiles = async (
  folder: string,
  resourceType: 'image' | 'video' | 'raw' = 'image',
  maxResults: number = 100
): Promise<any[]> => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: resourceType,
      prefix: folder,
      max_results: maxResults
    });
    return result.resources;
  } catch (error) {
    log.error('Error listing files from Cloudinary:', error);
    throw new Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  generateOptimizedUrl,
  generateThumbnailUrl,
  uploadProfileImage,
  uploadProductImages,
  uploadTourImages,
  uploadReviewMedia,
  getFileInfo,
  listFiles
};