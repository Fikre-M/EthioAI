import { PrismaClient, VendorProfile, Category, Prisma } from '@prisma/client';
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
import { 
  NotFoundError, 
  ValidationError, 
  ForbiddenError 
} from '../middlewares/error.middleware';
import { calculatePagination, PaginationMeta } from '../utils/response';
import { log } from '../utils/logger';

const prisma = new PrismaClient();

export class VendorService {
  /**
   * Create vendor profile
   */
  static async createVendorProfile(data: CreateVendorProfileInput, userId: string): Promise<VendorProfile> {
    // Check if user already has a vendor profile
    const existingProfile = await prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ValidationError('User already has a vendor profile');
    }

    // Check if business name is unique
    const existingBusiness = await prisma.vendorProfile.findFirst({
      where: { businessName: data.businessName },
    });

    if (existingBusiness) {
      throw new ValidationError('Business name already exists');
    }

    const vendorProfile = await prisma.vendorProfile.create({
      data: {
        ...data,
        userId,
        isVerified: false,
        rating: null,
        totalReviews: 0,
        totalSales: 0,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    log.info('Vendor profile created', {
      vendorId: vendorProfile.id,
      userId,
      businessName: vendorProfile.businessName,
    });

    return vendorProfile;
  }

  /**
   * Get all vendor profiles with filtering and pagination
   */
  static async getVendorProfiles(query: VendorQueryInput): Promise<{
    vendors: VendorProfile[];
    pagination: PaginationMeta;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isVerified,
      search,
    } = query;

    // Build where clause
    const where: Prisma.VendorProfileWhereInput = {};

    if (isVerified !== undefined) {
      where.isVerified = isVerified;
    }

    // Search filter
    if (search) {
      where.OR = [
        { businessName: { contains: search } },
        { description: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build order by clause
    const orderBy: Prisma.VendorProfileOrderByWithRelationInput = {};
    if (sortBy === 'businessName') {
      orderBy.businessName = sortOrder;
    } else if (sortBy === 'rating') {
      orderBy.rating = sortOrder;
    } else if (sortBy === 'totalSales') {
      orderBy.totalSales = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    // Execute queries
    const [vendors, total] = await Promise.all([
      prisma.vendorProfile.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
            },
          },
          products: {
            where: {
              status: 'PUBLISHED',
            },
            select: {
              id: true,
            },
          },
        },
      }),
      prisma.vendorProfile.count({ where }),
    ]);

    // Add product count
    const vendorsWithStats = vendors.map(vendor => ({
      ...vendor,
      productCount: vendor.products.length,
    }));

    const pagination = calculatePagination(page, limit, total);

    return {
      vendors: vendorsWithStats as any,
      pagination,
    };
  }

  /**
   * Get vendor profile by ID
   */
  static async getVendorProfileById(id: string): Promise<VendorProfile> {
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true,
          },
        },
        products: {
          where: {
            status: 'PUBLISHED',
          },
          include: {
            category: true,
            reviews: {
              select: {
                rating: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!vendorProfile) {
      throw new NotFoundError('Vendor profile not found');
    }

    return vendorProfile;
  }

  /**
   * Get vendor profile by user ID
   */
  static async getVendorProfileByUserId(userId: string): Promise<VendorProfile | null> {
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true,
          },
        },
        products: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    return vendorProfile;
  }

  /**
   * Update vendor profile
   */
  static async updateVendorProfile(
    id: string, 
    data: UpdateVendorProfileInput, 
    userId: string
  ): Promise<VendorProfile> {
    const existingProfile = await prisma.vendorProfile.findUnique({
      where: { id },
    });

    if (!existingProfile) {
      throw new NotFoundError('Vendor profile not found');
    }

    // Verify ownership
    if (existingProfile.userId !== userId) {
      throw new ForbiddenError('You do not have permission to update this vendor profile');
    }

    // Check if business name is unique (if being updated)
    if (data.businessName && data.businessName !== existingProfile.businessName) {
      const existingBusiness = await prisma.vendorProfile.findFirst({
        where: { 
          businessName: data.businessName,
          id: { not: id },
        },
      });

      if (existingBusiness) {
        throw new ValidationError('Business name already exists');
      }
    }

    const vendorProfile = await prisma.vendorProfile.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    log.info('Vendor profile updated', { vendorId: id, userId });

    return vendorProfile;
  }

  /**
   * Update vendor verification status (admin only)
   */
  static async updateVendorVerification(
    id: string, 
    data: UpdateVendorVerificationInput, 
    userId: string
  ): Promise<VendorProfile> {
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { id },
    });

    if (!vendorProfile) {
      throw new NotFoundError('Vendor profile not found');
    }

    const updatedProfile = await prisma.vendorProfile.update({
      where: { id },
      data: {
        isVerified: data.isVerified,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    log.info('Vendor verification updated', {
      vendorId: id,
      userId,
      isVerified: data.isVerified,
      reason: data.reason,
    });

    return updatedProfile;
  }

  /**
   * Get vendor statistics
   */
  static async getVendorStats(query: VendorStatsQueryInput = {}): Promise<any> {
    const where: Prisma.VendorProfileWhereInput = {};

    if (query.vendorId) {
      where.id = query.vendorId;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = query.startDate;
      if (query.endDate) where.createdAt.lte = query.endDate;
    }

    const [
      totalVendors,
      verifiedVendors,
      unverifiedVendors,
      activeVendors, // Vendors with at least one published product
    ] = await Promise.all([
      prisma.vendorProfile.count({ where }),
      prisma.vendorProfile.count({ where: { ...where, isVerified: true } }),
      prisma.vendorProfile.count({ where: { ...where, isVerified: false } }),
      prisma.vendorProfile.count({
        where: {
          ...where,
          products: {
            some: {
              status: 'PUBLISHED',
            },
          },
        },
      }),
    ]);

    return {
      totalVendors,
      verifiedVendors,
      unverifiedVendors,
      activeVendors,
      inactiveVendors: totalVendors - activeVendors,
      verificationRate: totalVendors > 0 ? (verifiedVendors / totalVendors) * 100 : 0,
    };
  }

  /**
   * Create category
   */
  static async createCategory(data: CreateCategoryInput): Promise<Category> {
    // Generate slug
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new ValidationError('A category with similar name already exists');
    }

    // Verify parent category if provided
    if (data.parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: data.parentId },
      });

      if (!parentCategory) {
        throw new NotFoundError('Parent category not found');
      }
    }

    const category = await prisma.category.create({
      data: {
        ...data,
        slug,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    log.info('Category created', {
      categoryId: category.id,
      name: category.name,
      slug: category.slug,
    });

    return category;
  }

  /**
   * Get all categories
   */
  static async getCategories(query: CategoryQueryInput): Promise<{
    categories: Category[];
    pagination: PaginationMeta;
  }> {
    const {
      page = 1,
      limit = 10,
      parentId,
      includeChildren,
      search,
    } = query;

    // Build where clause
    const where: Prisma.CategoryWhereInput = {};

    if (parentId !== undefined) {
      where.parentId = parentId;
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
        skip,
        take: limit,
        include: {
          parent: true,
          children: includeChildren ? true : false,
          products: {
            where: {
              status: 'PUBLISHED',
            },
            select: {
              id: true,
            },
          },
        },
      }),
      prisma.category.count({ where }),
    ]);

    // Add product count
    const categoriesWithStats = categories.map(category => ({
      ...category,
      productCount: category.products.length,
    }));

    const pagination = calculatePagination(page, limit, total);

    return {
      categories: categoriesWithStats as any,
      pagination,
    };
  }

  /**
   * Get category by ID or slug
   */
  static async getCategoryById(identifier: string): Promise<Category> {
    // Check if identifier is UUID or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    
    const category = await prisma.category.findUnique({
      where: isUuid ? { id: identifier } : { slug: identifier },
      include: {
        parent: true,
        children: true,
        products: {
          where: {
            status: 'PUBLISHED',
          },
          include: {
            vendor: true,
            reviews: {
              select: {
                rating: true,
              },
            },
          },
          take: 20,
        },
      },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }

  /**
   * Update category
   */
  static async updateCategory(id: string, data: UpdateCategoryInput): Promise<Category> {
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundError('Category not found');
    }

    // Generate new slug if name is being updated
    let updateData: any = { ...data };
    if (data.name) {
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug conflicts with existing categories (excluding current category)
      const conflictingCategory = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (conflictingCategory) {
        throw new ValidationError('A category with similar name already exists');
      }

      updateData.slug = slug;
    }

    // Verify parent category if provided
    if (data.parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: data.parentId },
      });

      if (!parentCategory) {
        throw new NotFoundError('Parent category not found');
      }

      // Prevent circular reference
      if (data.parentId === id) {
        throw new ValidationError('Category cannot be its own parent');
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        parent: true,
        children: true,
      },
    });

    log.info('Category updated', { categoryId: id, name: category.name });

    return category;
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: string): Promise<void> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // Check if category has children
    if (category.children.length > 0) {
      throw new ValidationError('Cannot delete category with subcategories');
    }

    // Check if category has products
    if (category.products.length > 0) {
      throw new ValidationError('Cannot delete category with products');
    }

    await prisma.category.delete({
      where: { id },
    });

    log.info('Category deleted', { categoryId: id, name: category.name });
  }
}