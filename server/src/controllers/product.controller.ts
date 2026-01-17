import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ProductService } from '../services/product.service';
import { ResponseUtil } from '../utils/response';
import { log } from '../utils/logger';
import { asyncHandler } from '../middlewares/error.middleware';
import { 
  CreateProductInput, 
  UpdateProductInput, 
  ProductQueryInput,
  UpdateProductStatusInput,
  ProductStatsQueryInput
} from '../schemas/product.schemas';

const prisma = new PrismaClient();

export class ProductController {
  /**
   * Create a new product
   * POST /api/products
   */
  static createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: CreateProductInput = req.body;
    const userId = req.userId!;
    
    const product = await ProductService.createProduct(data, userId);
    
    log.info('Product created via API', { 
      productId: product.id, 
      userId, 
      ip: req.ip 
    });

    return ResponseUtil.created(res, { product }, 'Product created successfully');
  });

  /**
   * Get all products with filtering and pagination
   * GET /api/products
   */
  static getProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: ProductQueryInput = req.query as any;
    
    const result = await ProductService.getProducts(query);
    
    return ResponseUtil.paginated(
      res, 
      result.products, 
      result.pagination, 
      'Products retrieved successfully'
    );
  });

  /**
   * Get product by ID or slug
   * GET /api/products/:id
   */
  static getProductById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    const product = await ProductService.getProductById(id);
    
    return ResponseUtil.success(res, { product }, 'Product retrieved successfully');
  });

  /**
   * Update product
   * PUT /api/products/:id
   */
  static updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: UpdateProductInput = req.body;
    const userId = req.userId!;
    
    const product = await ProductService.updateProduct(id, data, userId);
    
    log.info('Product updated via API', { productId: id, userId, ip: req.ip });

    return ResponseUtil.success(res, { product }, 'Product updated successfully');
  });

  /**
   * Delete product
   * DELETE /api/products/:id
   */
  static deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.userId!;
    
    await ProductService.deleteProduct(id, userId);
    
    log.info('Product deleted via API', { productId: id, userId, ip: req.ip });

    return ResponseUtil.success(res, null, 'Product deleted successfully');
  });

  /**
   * Update product status
   * PATCH /api/products/:id/status
   */
  static updateProductStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: UpdateProductStatusInput = req.body;
    const userId = req.userId!;
    
    const product = await ProductService.updateProductStatus(id, data, userId);
    
    log.info('Product status updated via API', { 
      productId: id, 
      userId, 
      newStatus: data.status,
      ip: req.ip 
    });

    return ResponseUtil.success(res, { product }, 'Product status updated successfully');
  });

  /**
   * Get featured products
   * GET /api/products/featured
   */
  static getFeaturedProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 8;
    
    const products = await ProductService.getFeaturedProducts(limit);
    
    return ResponseUtil.success(res, { products }, 'Featured products retrieved successfully');
  });

  /**
   * Get products by category
   * GET /api/products/category/:categoryId
   */
  static getProductsByCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { categoryId } = req.params;
    const limit = parseInt(req.query.limit as string) || 12;
    
    const products = await ProductService.getProductsByCategory(categoryId, limit);
    
    return ResponseUtil.success(res, { products }, 'Category products retrieved successfully');
  });

  /**
   * Search products
   * GET /api/products/search
   */
  static searchProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { q: query, ...filters } = req.query;
    
    if (!query || typeof query !== 'string') {
      return ResponseUtil.badRequest(res, 'Search query is required');
    }
    
    const products = await ProductService.searchProducts(query, filters as any);
    
    return ResponseUtil.success(res, { products, query }, 'Search completed successfully');
  });

  /**
   * Get vendor products
   * GET /api/products/vendor/:vendorId
   */
  static getVendorProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { vendorId } = req.params;
    const query: Partial<ProductQueryInput> = req.query as any;
    
    const result = await ProductService.getVendorProducts(vendorId, query);
    
    return ResponseUtil.paginated(
      res, 
      result.products, 
      result.pagination, 
      'Vendor products retrieved successfully'
    );
  });

  /**
   * Get my products (vendor)
   * GET /api/products/my-products
   */
  static getMyProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const query: ProductQueryInput = req.query as any;
    
    // Get vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!vendorProfile) {
      return ResponseUtil.badRequest(res, 'You must have a vendor profile to view products');
    }
    
    const result = await ProductService.getVendorProducts(vendorProfile.id, query);
    
    return ResponseUtil.paginated(
      res, 
      result.products, 
      result.pagination, 
      'Your products retrieved successfully'
    );
  });

  /**
   * Get product statistics
   * GET /api/products/stats
   */
  static getProductStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: ProductStatsQueryInput = req.query as any;
    
    const stats = await ProductService.getProductStats(query);
    
    return ResponseUtil.success(res, stats, 'Product statistics retrieved successfully');
  });

  /**
   * Get popular products (most sold)
   * GET /api/products/popular
   */
  static getPopularProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    
    // For now, return featured products as popular
    // In a real implementation, you'd sort by sales count
    const products = await ProductService.getFeaturedProducts(limit);
    
    return ResponseUtil.success(res, { products }, 'Popular products retrieved successfully');
  });

  /**
   * Get product filters (for filter UI)
   * GET /api/products/filters
   */
  static getProductFilters = asyncHandler(async (req: AuthRequest, res: Response) => {
    // Get unique values for filters
    const [materials, colors, sizes, priceRange] = await Promise.all([
      prisma.product.findMany({
        where: { status: 'PUBLISHED' },
        select: { materials: true },
        distinct: ['materials'],
      }),
      prisma.product.findMany({
        where: { status: 'PUBLISHED' },
        select: { colors: true },
        distinct: ['colors'],
      }),
      prisma.product.findMany({
        where: { status: 'PUBLISHED' },
        select: { sizes: true },
        distinct: ['sizes'],
      }),
      prisma.product.aggregate({
        where: { status: 'PUBLISHED' },
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    // Flatten and deduplicate arrays
    const uniqueMaterials = [...new Set(materials.flatMap(p => p.materials as string[]))];
    const uniqueColors = [...new Set(colors.flatMap(p => p.colors as string[]))];
    const uniqueSizes = [...new Set(sizes.flatMap(p => p.sizes as string[]))];

    const filters = {
      materials: uniqueMaterials.filter(Boolean),
      colors: uniqueColors.filter(Boolean),
      sizes: uniqueSizes.filter(Boolean),
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 1000,
      },
    };
    
    return ResponseUtil.success(res, filters, 'Product filters retrieved successfully');
  });
}