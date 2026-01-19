import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { auth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { handleUploadError } from '../middlewares/upload.middleware';
import {
  uploadSingle as uploadSingleMiddleware,
  uploadMultiple as uploadMultipleMiddleware,
  uploadProfileImage as uploadProfileImageMiddleware,
  uploadProductImages as uploadProductImagesMiddleware,
  uploadTourImages as uploadTourImagesMiddleware,
  uploadReviewMedia as uploadReviewMediaMiddleware
} from '../middlewares/upload.middleware';
import {
  uploadSingle,
  uploadMultiple,
  uploadUserProfile,
  uploadProductMedia,
  uploadTourMedia,
  deleteFile,
  generateOptimizedImageUrl
} from '../controllers/upload.controller';

const router = Router();

// Apply authentication to all upload routes
router.use(auth);

/**
 * Upload single file
 * POST /api/upload/single
 */
router.post(
  '/single',
  uploadSingleMiddleware('file'),
  handleUploadError,
  [
    body('type')
      .optional()
      .isIn(['profile', 'product', 'tour', 'review', 'document', 'general'])
      .withMessage('Invalid upload type'),
    body('folder')
      .optional()
      .isString()
      .withMessage('Folder must be a string'),
    body('tags')
      .optional()
      .isString()
      .withMessage('Tags must be a comma-separated string')
  ],
  validate,
  uploadSingle
);

/**
 * Upload multiple files
 * POST /api/upload/multiple
 */
router.post(
  '/multiple',
  uploadMultipleMiddleware('files', 10),
  handleUploadError,
  [
    body('type')
      .optional()
      .isIn(['profile', 'product', 'tour', 'review', 'document', 'general'])
      .withMessage('Invalid upload type'),
    body('folder')
      .optional()
      .isString()
      .withMessage('Folder must be a string'),
    body('tags')
      .optional()
      .isString()
      .withMessage('Tags must be a comma-separated string')
  ],
  validate,
  uploadMultiple
);

/**
 * Upload profile image
 * POST /api/upload/profile
 */
router.post(
  '/profile',
  uploadProfileImageMiddleware,
  handleUploadError,
  uploadUserProfile
);

/**
 * Upload product images
 * POST /api/upload/product/:productId
 */
router.post(
  '/product/:productId',
  uploadProductImagesMiddleware,
  handleUploadError,
  [
    param('productId')
      .isUUID()
      .withMessage('Invalid product ID')
  ],
  validate,
  uploadProductMedia
);

/**
 * Upload tour images
 * POST /api/upload/tour/:tourId
 */
router.post(
  '/tour/:tourId',
  uploadTourImagesMiddleware,
  handleUploadError,
  [
    param('tourId')
      .isUUID()
      .withMessage('Invalid tour ID')
  ],
  validate,
  uploadTourMedia
);

/**
 * Upload review media
 * POST /api/upload/review/:reviewId
 */
router.post(
  '/review/:reviewId',
  uploadReviewMediaMiddleware,
  handleUploadError,
  [
    param('reviewId')
      .isUUID()
      .withMessage('Invalid review ID')
  ],
  validate,
  async (req, res, next) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No review media provided',
          code: 'NO_FILES'
        });
      }

      const { reviewId } = req.params;
      
      // Import here to avoid circular dependency
      const { uploadReviewMedia } = await import('../services/cloudinary.service');
      const { prisma } = await import('../utils/database');
      const { log } = await import('../utils/logger');

      // Verify review exists and user has permission
      const review = await prisma.review.findUnique({
        where: { id: reviewId }
      });

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found',
          code: 'REVIEW_NOT_FOUND'
        });
      }

      if (review.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to upload media for this review',
          code: 'UNAUTHORIZED'
        });
      }

      const results = await uploadReviewMedia(files, reviewId);

      // Update review with new media URLs
      const mediaUrls = results.map(result => result.url);
      const existingMedia = review.media || [];
      const updatedMedia = [...existingMedia, ...mediaUrls];

      await prisma.review.update({
        where: { id: reviewId },
        data: { media: updatedMedia }
      });

      log.info('Review media uploaded successfully', {
        userId: req.user!.id,
        reviewId,
        mediaCount: results.length
      });

      res.json({
        success: true,
        message: `${results.length} review media files uploaded successfully`,
        data: results.map(result => ({
          url: result.url,
          publicId: result.publicId,
          resourceType: result.resourceType
        }))
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * Delete uploaded file
 * DELETE /api/upload/:publicId
 */
router.delete(
  '/:publicId',
  [
    param('publicId')
      .notEmpty()
      .withMessage('Public ID is required'),
    body('resourceType')
      .optional()
      .isIn(['image', 'video', 'raw'])
      .withMessage('Invalid resource type')
  ],
  validate,
  deleteFile
);

/**
 * Generate optimized image URL
 * GET /api/upload/optimize/:publicId
 */
router.get(
  '/optimize/:publicId',
  [
    param('publicId')
      .notEmpty()
      .withMessage('Public ID is required'),
    query('width')
      .optional()
      .isInt({ min: 1, max: 2000 })
      .withMessage('Width must be between 1 and 2000'),
    query('height')
      .optional()
      .isInt({ min: 1, max: 2000 })
      .withMessage('Height must be between 1 and 2000'),
    query('quality')
      .optional()
      .isIn(['auto:low', 'auto:good', 'auto:best', 'auto:eco'])
      .withMessage('Invalid quality setting'),
    query('format')
      .optional()
      .isIn(['auto', 'jpg', 'png', 'webp', 'avif'])
      .withMessage('Invalid format')
  ],
  validate,
  generateOptimizedImageUrl
);

export default router;