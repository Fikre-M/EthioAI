import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ResponseUtil } from '../utils/response';
import { log } from '../utils/logger';
import { asyncHandler } from '../middlewares/error.middleware';
import { prisma } from '../utils/database';

export class TourController {
  /**
   * Get all tours with filtering and pagination
   */
  static getTours = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string || 'PUBLISHED';
    const category = req.query.category as string;
    const featured = req.query.featured === 'true';

    const where: any = {
      status: status
    };

    if (category) {
      where.category = category;
    }

    if (featured) {
      where.featured = true;
    }

    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.tour.count({ where })
    ]);

    const pages = Math.ceil(total / limit);

    return ResponseUtil.success(res, {
      tours,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    }, 'Tours retrieved successfully');
  });

  /**
   * Get tour by ID
   */
  static getTourById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          where: {
            status: 'APPROVED'
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        }
      }
    });

    if (!tour) {
      return ResponseUtil.notFound(res, 'Tour not found');
    }

    return ResponseUtil.success(res, { tour }, 'Tour retrieved successfully');
  });

  /**
   * Search tours
   */
  static searchTours = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!query) {
      return ResponseUtil.error(res, 400, 'BAD_REQUEST', 'Search query is required');
    }

    const where = {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const } },
        { shortDescription: { contains: query, mode: 'insensitive' as const } },
        { category: { contains: query, mode: 'insensitive' as const } }
      ]
    };

    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.tour.count({ where })
    ]);

    const pages = Math.ceil(total / limit);

    return ResponseUtil.success(res, {
      tours,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    }, 'Search completed');
  });

  /**
   * Get featured tours
   */
  static getFeaturedTours = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 6;

    const tours = await prisma.tour.findMany({
      where: {
        status: 'PUBLISHED',
        featured: true
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return ResponseUtil.success(res, { tours }, 'Featured tours retrieved');
  });

  /**
   * Get popular tours
   */
  static getPopularTours = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 6;

    const tours = await prisma.tour.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        }
      },
      take: limit,
      orderBy: [
        { bookings: { _count: 'desc' } },
        { reviews: { _count: 'desc' } },
        { createdAt: 'desc' }
      ]
    });

    return ResponseUtil.success(res, { tours }, 'Popular tours retrieved');
  });

  /**
   * Get tour categories
   */
  static getTourCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
    const categories = await prisma.tour.groupBy({
      by: ['category'],
      where: {
        status: 'PUBLISHED'
      },
      _count: {
        category: true
      },
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    });

    const formattedCategories = categories.map(cat => ({
      name: cat.category,
      count: cat._count.category
    }));

    return ResponseUtil.success(res, { categories: formattedCategories }, 'Categories retrieved');
  });

  /**
   * Get tours by category
   */
  static getToursByCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { category } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const where = {
      status: 'PUBLISHED',
      category: {
        equals: category,
        mode: 'insensitive' as const
      }
    };

    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.tour.count({ where })
    ]);

    const pages = Math.ceil(total / limit);

    return ResponseUtil.success(res, {
      tours,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    }, 'Category tours retrieved');
  });

  /**
   * Check tour availability
   */
  static checkAvailability = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { startDate, endDate, adults, children } = req.body;

    const tour = await prisma.tour.findUnique({
      where: { id },
      select: {
        id: true,
        maxGroupSize: true,
        status: true
      }
    });

    if (!tour) {
      return ResponseUtil.notFound(res, 'Tour not found');
    }

    if (tour.status !== 'PUBLISHED') {
      return ResponseUtil.error(res, 400, 'BAD_REQUEST', 'Tour is not available for booking');
    }

    // Parse dates properly
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Validate dates
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return ResponseUtil.error(res, 400, 'BAD_REQUEST', 'Invalid date format');
    }

    // Check existing bookings for the date range
    const existingBookings = await prisma.booking.findMany({
      where: {
        tourId: id,
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        OR: [
          {
            startDate: {
              lte: endDateObj
            },
            endDate: {
              gte: startDateObj
            }
          }
        ]
      },
      select: {
        adults: true,
        children: true
      }
    });

    const totalBooked = existingBookings.reduce((sum, booking) => 
      sum + booking.adults + booking.children, 0
    );

    const requestedSize = adults + children;
    const available = (totalBooked + requestedSize) <= tour.maxGroupSize;

    return ResponseUtil.success(res, { 
      available,
      remainingSpots: tour.maxGroupSize - totalBooked,
      maxGroupSize: tour.maxGroupSize
    }, 'Availability checked');
  });

  /**
   * Create new tour (Guide/Admin only)
   */
  static createTour = asyncHandler(async (req: AuthRequest, res: Response) => {
    const tourData = req.body;

    // Generate slug from title
    const slug = tourData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const tour = await prisma.tour.create({
      data: {
        ...tourData,
        slug,
        // Convert arrays/objects to JSON strings
        images: JSON.stringify(tourData.images || []),
        startLocation: JSON.stringify(tourData.startLocation || {}),
        locations: JSON.stringify(tourData.locations || []),
        included: JSON.stringify(tourData.included || []),
        excluded: JSON.stringify(tourData.excluded || []),
        itinerary: JSON.stringify(tourData.itinerary || []),
        tags: JSON.stringify(tourData.tags || [])
      }
    });

    return ResponseUtil.created(res, { tour }, 'Tour created successfully');
  });

  /**
   * Update tour (Guide/Admin only)
   */
  static updateTour = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const tourData = req.body;

    const existingTour = await prisma.tour.findUnique({
      where: { id }
    });

    if (!existingTour) {
      return ResponseUtil.notFound(res, 'Tour not found');
    }

    // Generate new slug if title changed
    let slug = existingTour.slug;
    if (tourData.title && tourData.title !== existingTour.title) {
      slug = tourData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const tour = await prisma.tour.update({
      where: { id },
      data: {
        ...tourData,
        slug,
        // Convert arrays/objects to JSON strings if provided
        ...(tourData.images && { images: JSON.stringify(tourData.images) }),
        ...(tourData.startLocation && { startLocation: JSON.stringify(tourData.startLocation) }),
        ...(tourData.locations && { locations: JSON.stringify(tourData.locations) }),
        ...(tourData.included && { included: JSON.stringify(tourData.included) }),
        ...(tourData.excluded && { excluded: JSON.stringify(tourData.excluded) }),
        ...(tourData.itinerary && { itinerary: JSON.stringify(tourData.itinerary) }),
        ...(tourData.tags && { tags: JSON.stringify(tourData.tags) })
      }
    });

    return ResponseUtil.success(res, { tour }, 'Tour updated successfully');
  });

  /**
   * Delete tour (Guide/Admin only)
   */
  static deleteTour = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    if (!tour) {
      return ResponseUtil.notFound(res, 'Tour not found');
    }

    // Check if tour has active bookings
    if (tour._count.bookings > 0) {
      return ResponseUtil.error(res, 400, 'BAD_REQUEST', 'Cannot delete tour with existing bookings. Archive it instead.');
    }

    await prisma.tour.delete({
      where: { id }
    });

    return ResponseUtil.success(res, null, 'Tour deleted successfully');
  });

  /**
   * Update tour status (Admin only)
   */
  static updateTourStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const tour = await prisma.tour.update({
      where: { id },
      data: { status }
    });

    return ResponseUtil.success(res, { tour }, 'Tour status updated');
  });

  /**
   * Get tour statistics (Admin only)
   */
  static getTourStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const [total, published, draft, suspended, archived] = await Promise.all([
      prisma.tour.count(),
      prisma.tour.count({ where: { status: 'PUBLISHED' } }),
      prisma.tour.count({ where: { status: 'DRAFT' } }),
      prisma.tour.count({ where: { status: 'SUSPENDED' } }),
      prisma.tour.count({ where: { status: 'ARCHIVED' } })
    ]);

    const stats = {
      total,
      published,
      draft,
      suspended,
      archived
    };

    return ResponseUtil.success(res, { stats }, 'Tour stats retrieved');
  });
}