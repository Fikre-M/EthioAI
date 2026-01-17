import { PrismaClient, Product, ContentStatus, Prisma } from '@prisma/client';
import { 
  CreateProductInput, 
  UpdateProductInput, 
  ProductQueryInput,
  UpdateProductStatusInput,
  ProductStatsQueryInput
} from '../schemas/product.schemas';
import { 
  NotFoundError, 
  ValidationError, 
  ForbiddenError 
} from '../middlewares/error.middleware';
import { calculatePagination, PaginationMeta } from '../utils/response';
import { log } from '../utils/logger';

const prisma = new PrismaClient();

export class ProductService {
  /**
   * Generate slug from product name
   */
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  /**
   * Create a new product
   */
  static async createProduct(data: CreateProductInput, userId: string): Promise<Product> {
    // Verify user has vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!vendorProfile) {
      throw new ValidationError('You must have a vendor profile to create products');
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // Generate slug
    const slug = this.generateSlug(data.name);

    // Check if slug already exists for this vendor
    const existingProduct = await prisma.product.findFirst({
      where: {
        slug,
        vendorId: vendorProfile.id,
      },
    });

    if (existingProduct) {
      throw new ValidationError('A product with similar name already exists');
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        vendorId: vendorProfile.id,
        status: 'DRAFT',
        materials: data.materials || [],
        colors: data.colors || [],
        sizes: data.sizes || [],
        dimensions: data.dimensions || null,
      },
      include: {
        vendor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        category: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    log.info('Product created', {
      productId: product.id,
      userId,
      vendorId: vendorProfile.id,
      name: product.name,
    });

    return product;
  }

  /**
   * Get all products with filtering and pagination
   */
  static async getProducts(query: ProductQueryInput): Promise<{
    products: Product[];
    pagination: PaginationMeta;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      categoryId,
      vendorId,
      status,
      featured,
      inStock,
      minPrice,
      maxPrice,
      search,
      materials,
      colors,
      sizes,
    } = query;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      // Only show published products for public queries (unless status is specified)
      status: status || 'PUBLISHED',
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (inStock) {
      where.stock = { gt: 0 };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { shortDescription: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    // Material filter
    if (materials) {
      const materialArray = materials.split(',').map(m => m.trim());
      where.materials = {
        hasSome: materialArray,
      };
    }

    // Color filter
    if (colors) {
      const colorArray = colors.split(',').map(c => c.trim());
      where.colors = {
        hasSome: colorArray,
      };
    }

    // Size filter
    if (sizes) {
      const sizeArray = sizes.split(',').map(s => s.trim());
      where.sizes = {
        hasSome: sizeArray,
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build order by clause
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else if (sortBy === 'rating') {
      // For now, order by created date (rating calculation to be implemented)
      orderBy.createdAt = sortOrder;
    } else if (sortBy === 'sales') {
      // For now, order by created date (sales tracking to be implemented)
      orderBy.createdAt = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    // Execute queries
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          vendor: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          category: true,
          reviews: {
            select: {
              rating: true,
            },
          },
          orderItems: {
            select: {
              quantity: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average ratings and sales
    const productsWithStats = products.map(product => ({
      ...product,
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : null,
      reviewCount: product.reviews.length,
      totalSales: product.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    }));

    const pagination = calculatePagination(page, limit, total);

    return {
      products: productsWithStats as any,
      pagination,
    };
  }

  /**
   * Get product by ID or slug
   */
  static async getProductById(identifier: string): Promise<Product & {
    vendor?: any;
    category?: any;
    reviews?: any[];
    averageRating?: number;
    reviewCount?: number;
    totalSales?: number;
  }> {
    // Check if identifier is UUID or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    
    const product = await prisma.product.findUnique({
      where: isUuid ? { id: identifier } : { slug: identifier },
      include: {
        vendor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        category: true,
        reviews: {
          where: {
            status: 'APPROVED',
          },
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        orderItems: {
          select: {
            quantity: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Calculate average rating and sales
    const averageRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : null;

    const totalSales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      ...product,
      averageRating,
      reviewCount: product.reviews.length,
      totalSales,
    };
  }

  /**
   * Update product
   */
  static async updateProduct(id: string, data: UpdateProductInput, userId: string): Promise<Product> {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        vendor: true,
      },
    });

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    // Verify ownership
    if (existingProduct.vendor.userId !== userId) {
      throw new ForbiddenError('You do not have permission to update this product');
    }

    // Generate new slug if name is being updated
    let updateData: any = { ...data };
    if (data.name) {
      const slug = this.generateSlug(data.name);

      // Check if new slug conflicts with existing products (excluding current product)
      const conflictingProduct = await prisma.product.findFirst({
        where: {
          slug,
          vendorId: existingProduct.vendorId,
          id: { not: id },
        },
      });

      if (conflictingProduct) {
        throw new ValidationError('A product with similar name already exists');
      }

      updateData.slug = slug;
    }

    // Verify category if provided
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new NotFoundError('Category not found');
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        vendor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        category: true,
      },
    });

    log.info('Product updated', { productId: id, userId, name: product.name });

    return product;
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: string, userId: string): Promise<void> {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        vendor: true,
        orderItems: true,
      },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Verify ownership
    if (product.vendor.userId !== userId) {
      throw new ForbiddenError('You do not have permission to delete this product');
    }

    // Check if product has orders
    if (product.orderItems.length > 0) {
      throw new ValidationError('Cannot delete product with existing orders');
    }

    await prisma.product.delete({
      where: { id },
    });

    log.info('Product deleted', { productId: id, userId, name: product.name });
  }

  /**
   * Update product status
   */
  static async updateProductStatus(
    id: string, 
    data: UpdateProductStatusInput, 
    userId: string
  ): Promise<Product> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        vendor: true,
      },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Verify ownership
    if (product.vendor.userId !== userId) {
      throw new ForbiddenError('You do not have permission to update this product');
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { status: data.status },
      include: {
        vendor: true,
        category: true,
      },
    });

    log.info('Product status updated', {
      productId: id,
      userId,
      oldStatus: product.status,
      newStatus: data.status,
      reason: data.reason,
    });

    return updatedProduct;
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        featured: true,
        status: 'PUBLISHED',
        stock: { gt: 0 },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        vendor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        category: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Calculate average ratings
    return products.map(product => ({
      ...product,
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : null,
      reviewCount: product.reviews.length,
    })) as any;
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(categoryId: string, limit: number = 12): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        status: 'PUBLISHED',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        vendor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        category: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    return products.map(product => ({
      ...product,
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : null,
      reviewCount: product.reviews.length,
    })) as any;
  }

  /**
   * Search products
   */
  static async searchProducts(query: string, filters?: Partial<ProductQueryInput>): Promise<Product[]> {
    const searchQuery: ProductQueryInput = {
      search: query,
      ...filters,
      limit: filters?.limit || 20,
    };

    const result = await this.getProducts(searchQuery);
    return result.products;
  }

  /**
   * Get vendor products
   */
  static async getVendorProducts(vendorId: string, query: Partial<ProductQueryInput> = {}): Promise<{
    products: Product[];
    pagination: PaginationMeta;
  }> {
    return this.getProducts({
      ...query,
      vendorId,
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: query.sortOrder || 'desc',
    } as ProductQueryInput);
  }

  /**
   * Get product statistics
   */
  static async getProductStats(query: ProductStatsQueryInput = {}): Promise<any> {
    const where: Prisma.ProductWhereInput = {};

    if (query.vendorId) {
      where.vendorId = query.vendorId;
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = query.startDate;
      if (query.endDate) where.createdAt.lte = query.endDate;
    }

    const [
      totalProducts,
      publishedProducts,
      draftProducts,
      archivedProducts,
      featuredProducts,
      outOfStockProducts,
    ] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.count({ where: { ...where, status: 'PUBLISHED' } }),
      prisma.product.count({ where: { ...where, status: 'DRAFT' } }),
      prisma.product.count({ where: { ...where, status: 'ARCHIVED' } }),
      prisma.product.count({ where: { ...where, featured: true } }),
      prisma.product.count({ where: { ...where, stock: 0 } }),
    ]);

    return {
      totalProducts,
      publishedProducts,
      draftProducts,
      archivedProducts,
      featuredProducts,
      outOfStockProducts,
      inStockProducts: totalProducts - outOfStockProducts,
    };
  }
}