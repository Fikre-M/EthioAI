import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { VendorService } from '../services/vendor.service';
import { ResponseUtil } from '../utils/response';
import { log } from '../utils/logger';
import { asyncHandler } from '../middlewares/error.middleware';
import { 
  CreateVendorProfileInput, 
  UpdateVendorProfileInput, 
  VendorQueryInput,
  UpdateVendorVerificationInput,
  VendorStatsQueryInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryQueryInput
} from '../schemas/vendor.schemas';

export class VendorController {
  /**
   * Create vendor profile
   * POST /api/vendors/profile
   */
  static createVendorProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: CreateVendorProfileInput = req.body;
    const userId = req.userId!;
    
    const vendorProfile = await VendorService.createVendorProfile(data, userId);
    
    log.info('Vendor profile created via API', { 
      vendorId: vendorProfile.id, 
      userId, 
      ip: req.ip 
    });

    return ResponseUtil.created(res, { vendorProfile }, 'Vendor profile created successfully');
  });

  /**
   * Get all vendor profiles (admin)
   * GET /api/vendors
   */
  static getVendorProfiles = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: VendorQueryInput = req.query as any;
    
    const result = await VendorService.getVendorProfiles(query);
    
    return ResponseUtil.paginated(
      res, 
      result.vendors, 
      result.pagination, 
      'Vendor profiles retrieved successfully'
    );
  });

  /**
   * Get vendor profile by ID
   * GET /api/vendors/:id
   */
  static getVendorProfileById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    const vendorProfile = await VendorService.getVendorProfileById(id);
    
    return ResponseUtil.success(res, { vendorProfile }, 'Vendor profile retrieved successfully');
  });

  /**
   * Get my vendor profile
   * GET /api/vendors/my-profile
   */
  static getMyVendorProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    
    const vendorProfile = await VendorService.getVendorProfileByUserId(userId);
    
    if (!vendorProfile) {
      return ResponseUtil.notFound(res, 'Vendor profile not found');
    }
    
    return ResponseUtil.success(res, { vendorProfile }, 'Your vendor profile retrieved successfully');
  });

  /**
   * Update vendor profile
   * PUT /api/vendors/profile/:id
   */
  static updateVendorProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: UpdateVendorProfileInput = req.body;
    const userId = req.userId!;
    
    const vendorProfile = await VendorService.updateVendorProfile(id, data, userId);
    
    log.info('Vendor profile updated via API', { vendorId: id, userId, ip: req.ip });

    return ResponseUtil.success(res, { vendorProfile }, 'Vendor profile updated successfully');
  });

  /**
   * Update vendor verification (admin)
   * PATCH /api/vendors/:id/verification
   */
  static updateVendorVerification = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: UpdateVendorVerificationInput = req.body;
    const userId = req.userId!;
    
    const vendorProfile = await VendorService.updateVendorVerification(id, data, userId);
    
    log.info('Vendor verification updated via API', { 
      vendorId: id, 
      userId, 
      isVerified: data.isVerified,
      ip: req.ip 
    });

    return ResponseUtil.success(res, { vendorProfile }, 'Vendor verification updated successfully');
  });

  /**
   * Get vendor statistics
   * GET /api/vendors/stats
   */
  static getVendorStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: VendorStatsQueryInput = req.query as any;
    
    const stats = await VendorService.getVendorStats(query);
    
    return ResponseUtil.success(res, stats, 'Vendor statistics retrieved successfully');
  });

  /**
   * Create category
   * POST /api/categories
   */
  static createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: CreateCategoryInput = req.body;
    
    const category = await VendorService.createCategory(data);
    
    log.info('Category created via API', { 
      categoryId: category.id, 
      name: category.name,
      userId: req.userId,
      ip: req.ip 
    });

    return ResponseUtil.created(res, { category }, 'Category created successfully');
  });

  /**
   * Get all categories
   * GET /api/categories
   */
  static getCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: CategoryQueryInput = req.query as any;
    
    const result = await VendorService.getCategories(query);
    
    return ResponseUtil.paginated(
      res, 
      result.categories, 
      result.pagination, 
      'Categories retrieved successfully'
    );
  });

  /**
   * Get category by ID or slug
   * GET /api/categories/:id
   */
  static getCategoryById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    const category = await VendorService.getCategoryById(id);
    
    return ResponseUtil.success(res, { category }, 'Category retrieved successfully');
  });

  /**
   * Update category
   * PUT /api/categories/:id
   */
  static updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: UpdateCategoryInput = req.body;
    
    const category = await VendorService.updateCategory(id, data);
    
    log.info('Category updated via API', { 
      categoryId: id, 
      name: category.name,
      userId: req.userId,
      ip: req.ip 
    });

    return ResponseUtil.success(res, { category }, 'Category updated successfully');
  });

  /**
   * Delete category
   * DELETE /api/categories/:id
   */
  static deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    await VendorService.deleteCategory(id);
    
    log.info('Category deleted via API', { 
      categoryId: id, 
      userId: req.userId,
      ip: req.ip 
    });

    return ResponseUtil.success(res, null, 'Category deleted successfully');
  });

  /**
   * Get vendor dashboard data
   * GET /api/vendors/dashboard
   */
  static getVendorDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    
    // Get vendor profile
    const vendorProfile = await VendorService.getVendorProfileByUserId(userId);
    
    if (!vendorProfile) {
      return ResponseUtil.badRequest(res, 'You must have a vendor profile to access dashboard');
    }
    
    // Get vendor stats
    const stats = await VendorService.getVendorStats({ vendorId: vendorProfile.id });
    
    const dashboard = {
      vendorProfile,
      stats,
    };
    
    return ResponseUtil.success(res, dashboard, 'Vendor dashboard data retrieved successfully');
  });
}