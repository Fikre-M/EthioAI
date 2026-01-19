import { Request, Response } from 'express';
import { z } from 'zod';
import { 
  uploadToCloudinary, 
  uploadMultipleToCloudinary,
  uploadProfileImage,
  uploadProductImages,
  uploadTourImages,
  uploadReviewMedia,
  deleteFromCloudinary,
  generateOptimizedUrl,
  generateThumbnailUrl
} from '../services/cloudinary.service';
import { validateFileSize, validateFileType, isImage, isVideo, isDocument } from '../middlewares/upload.middleware';
import { log } from '../utils/logger';
import { prisma } from '../utils/database';

// Validation schemas
const uploadTypeSchema = z.enum(['profile', 'product', 'tour', 'review', 'document', 'general']);

/**
 * Upload single file
 */
export const uploadSingle = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
        code: 'NO_FILE'
      });
    }

    // Validate file size
    if (!validateFileSize(file)) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds limit',
        code: 'FILE_TOO_LARGE'
      });
    }

    const { type = 'general', folder, tags } = req.body;
    
    // Validate upload type
    const uploadType = uploadTypeSchema.parse(type);

    const options = {
      folder: folder || `ethioai-tourism/${uploadType}`,
      tags: tags ? tags.split(',') : [uploadType]
    };

    const result = await uploadToCloudinary(file, options);

    log.info('Single file uploaded successfully', {
      userId: req.user?.id,
      fileName: file.originalname,
      publicId: result.publicId,
      type: uploadType
    });

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
        resourceType: result.resourceType,
        thumbnailUrl: isImage(file) ? generateThumbnailUrl(result.publicId) : null
      }
    });

  } catch (error) {
    log.error('Error uploading single file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      code: 'UPLOAD_ERROR'
    });
  }
};

/**
 * Upload multiple files
 */
export const uploadMultiple = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided',
        code: 'NO_FILES'
      });
    }

    // Validate all files
    for (const file of files) {
      if (!validateFileSize(file)) {
        return res.status(400).json({
          success: false,
          message: `File ${file.originalname} exceeds size limit`,
          code: 'FILE_TOO_LARGE'
        });
      }
    }

    const { type = 'general', folder, tags } = req.body;
    
    // Validate upload type
    const uploadType = uploadTypeSchema.parse(type);

    const options = {
      folder: folder || `ethioai-tourism/${uploadType}`,
      tags: tags ? tags.split(',') : [uploadType]
    };

    const results = await uploadMultipleToCloudinary(files, options);

    log.info('Multiple files uploaded successfully', {
      userId: req.user?.id,
      fileCount: files.length,
      type: uploadType
    });

    res.json({
      success: true,
      message: `${results.length} files uploaded successfully`,
      data: results.map((result, index) => ({
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
        resourceType: result.resourceType,
        originalName: files[index].originalname,
        thumbnailUrl: isImage(files[index]) ? generateThumbnailUrl(result.publicId) : null
      }))
    });

  } catch (error) {
    log.error('Error uploading multiple files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files',
      code: 'UPLOAD_ERROR'
    });
  }
};

/**
 * Upload profile image
 */
export const uploadUserProfile = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No profile image provided',
        code: 'NO_FILE'
      });
    }

    if (!isImage(file)) {
      return res.status(400).json({
        success: false,
        message: 'Profile image must be an image file',
        code: 'INVALID_FILE_TYPE'
      });
    }

    const userId = req.user!.id;
    const result = await uploadProfileImage(file, userId);

    // Update user profile with new image URL
    await prisma.user.update({
      where: { id: userId },
      data: { 
        profileImage: result.url,
        profileImagePublicId: result.publicId
      }
    });

    log.info('Profile image uploaded successfully', {
      userId,
      publicId: result.publicId
    });

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        url: result.url,
        publicId: result.publicId,
        thumbnailUrl: generateThumbnailUrl(result.publicId, 150, 150)
      }
    });

  } catch (error) {
    log.error('Error uploading profile image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image',
      code: 'UPLOAD_ERROR'
    });
  }
};

/**
 * Upload product images
 */
export const uploadProductMedia = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No product images provided',
        code: 'NO_FILES'
      });
    }

    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
        code: 'MISSING_PRODUCT_ID'
      });
    }

    // Verify product exists and user has permission
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { vendor: true }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    if (product.vendor.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload images for this product',
        code: 'UNAUTHORIZED'
      });
    }

    // Validate all files are images
    for (const file of files) {
      if (!isImage(file)) {
        return res.status(400).json({
          success: false,
          message: `File ${file.originalname} is not a valid image`,
          code: 'INVALID_FILE_TYPE'
        });
      }
    }

    const results = await uploadProductImages(files, productId);

    // Update product with new image URLs
    const imageUrls = results.map(result => result.url);
    const existingImages = product.images || [];
    const updatedImages = [...existingImages, ...imageUrls];

    await prisma.product.update({
      where: { id: productId },
      data: { images: updatedImages }
    });

    log.info('Product images uploaded successfully', {
      userId: req.user!.id,
      productId,
      imageCount: results.length
    });

    res.json({
      success: true,
      message: `${results.length} product images uploaded successfully`,
      data: results.map(result => ({
        url: result.url,
        publicId: result.publicId,
        thumbnailUrl: generateThumbnailUrl(result.publicId, 300, 300)
      }))
    });

  } catch (error) {
    log.error('Error uploading product images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload product images',
      code: 'UPLOAD_ERROR'
    });
  }
};

/**
 * Upload tour images
 */
export const uploadTourMedia = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No tour images provided',
        code: 'NO_FILES'
      });
    }

    const { tourId } = req.params;
    if (!tourId) {
      return res.status(400).json({
        success: false,
        message: 'Tour ID is required',
        code: 'MISSING_TOUR_ID'
      });
    }

    // Verify tour exists and user has permission
    const tour = await prisma.tour.findUnique({
      where: { id: tourId }
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found',
        code: 'TOUR_NOT_FOUND'
      });
    }

    if (tour.createdBy !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload images for this tour',
        code: 'UNAUTHORIZED'
      });
    }

    // Validate all files are images
    for (const file of files) {
      if (!isImage(file)) {
        return res.status(400).json({
          success: false,
          message: `File ${file.originalname} is not a valid image`,
          code: 'INVALID_FILE_TYPE'
        });
      }
    }

    const results = await uploadTourImages(files, tourId);

    // Update tour with new image URLs
    const imageUrls = results.map(result => result.url);
    const existingImages = tour.images || [];
    const updatedImages = [...existingImages, ...imageUrls];

    await prisma.tour.update({
      where: { id: tourId },
      data: { images: updatedImages }
    });

    log.info('Tour images uploaded successfully', {
      userId: req.user!.id,
      tourId,
      imageCount: results.length
    });

    res.json({
      success: true,
      message: `${results.length} tour images uploaded successfully`,
      data: results.map(result => ({
        url: result.url,
        publicId: result.publicId,
        thumbnailUrl: generateThumbnailUrl(result.publicId, 400, 300)
      }))
    });

  } catch (error) {
    log.error('Error uploading tour images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload tour images',
      code: 'UPLOAD_ERROR'
    });
  }
};

/**
 * Delete uploaded file
 */
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.params;
    const { resourceType = 'image' } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
        code: 'MISSING_PUBLIC_ID'
      });
    }

    await deleteFromCloudinary(publicId, resourceType);

    log.info('File deleted successfully', {
      userId: req.user?.id,
      publicId,
      resourceType
    });

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    log.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      code: 'DELETE_ERROR'
    });
  }
};

/**
 * Generate optimized URL for existing image
 */
export const generateOptimizedImageUrl = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.params;
    const { width, height, quality = 'auto:good', format = 'auto' } = req.query;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
        code: 'MISSING_PUBLIC_ID'
      });
    }

    const transformations = [];
    
    if (width || height) {
      transformations.push({
        width: width ? parseInt(width as string) : undefined,
        height: height ? parseInt(height as string) : undefined,
        crop: 'fill'
      });
    }

    transformations.push({ quality, fetch_format: format });

    const optimizedUrl = generateOptimizedUrl(publicId, transformations);

    res.json({
      success: true,
      data: {
        originalPublicId: publicId,
        optimizedUrl,
        transformations
      }
    });

  } catch (error) {
    log.error('Error generating optimized URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate optimized URL',
      code: 'OPTIMIZATION_ERROR'
    });
  }
};