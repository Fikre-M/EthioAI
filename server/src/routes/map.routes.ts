import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { osmClient } from '../server';

const router = Router();

// Rate limiting for map endpoints
const mapRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // More generous for map requests
  message: {
    success: false,
    message: 'Too many map requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all map routes
router.use(mapRateLimit);

/**
 * GET /api/map/geocode
 * Forward geocoding: address/place → coordinates using OpenStreetMap
 */
router.get('/geocode', async (req: Request, res: Response) => {
  try {
    const { query, country = 'ET', limit = 5 } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required',
      });
    }

    if (!osmClient) {
      return res.status(503).json({
        success: false,
        message: 'OpenStreetMap service is not available',
      });
    }

    const results = await osmClient.geocode(query as string, {
      country: country as string,
      limit: parseInt(limit as string, 10),
    });

    // Transform OSM results to a consistent format
    const features = results.map((result: any) => ({
      place_name: result.display_name,
      center: [parseFloat(result.lon), parseFloat(result.lat)],
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(result.lon), parseFloat(result.lat)],
      },
      properties: {
        address: result.address,
        type: result.type,
        class: result.class,
        importance: result.importance,
      },
    }));

    res.json({
      success: true,
      data: {
        features,
        query: query,
        provider: 'openstreetmap',
        attribution: '© OpenStreetMap contributors',
      },
    });

  } catch (error: any) {
    console.error('Geocoding error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Geocoding request failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/map/reverse-geocode
 * Reverse geocoding: coordinates → address/place using OpenStreetMap
 */
router.get('/reverse-geocode', async (req: Request, res: Response) => {
  try {
    const { longitude, latitude } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude parameters are required',
      });
    }

    if (!osmClient) {
      return res.status(503).json({
        success: false,
        message: 'OpenStreetMap service is not available',
      });
    }

    const result = await osmClient.reverseGeocode(
      parseFloat(latitude as string),
      parseFloat(longitude as string)
    );

    const feature = {
      place_name: result.display_name,
      center: [parseFloat(result.lon), parseFloat(result.lat)],
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(result.lon), parseFloat(result.lat)],
      },
      properties: {
        address: result.address,
        type: result.type,
        class: result.class,
      },
    };

    res.json({
      success: true,
      data: {
        features: [feature],
        coordinates: { 
          longitude: parseFloat(longitude as string), 
          latitude: parseFloat(latitude as string) 
        },
        provider: 'openstreetmap',
        attribution: '© OpenStreetMap contributors',
      },
    });

  } catch (error: any) {
    console.error('Reverse geocoding error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Reverse geocoding request failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/map/directions
 * Get directions between two points using OpenStreetMap
 */
router.get('/directions', async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: 'Start and end coordinates are required (format: "lng,lat")',
      });
    }

    if (!osmClient) {
      return res.status(503).json({
        success: false,
        message: 'OpenStreetMap service is not available',
      });
    }

    const directions = await osmClient.getDirections(start as string, end as string);

    res.json({
      success: true,
      data: {
        ...directions,
        note: 'Basic routing provided. For advanced turn-by-turn directions, consider integrating OSRM or GraphHopper.',
        provider: 'openstreetmap',
        attribution: '© OpenStreetMap contributors',
      },
    });

  } catch (error: any) {
    console.error('Directions error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Directions request failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/map/places
 * Search for places near a location using OpenStreetMap
 */
router.get('/places', async (req: Request, res: Response) => {
  try {
    const { 
      query, 
      proximity, 
      country = 'ET',
      limit = 10 
    } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required',
      });
    }

    if (!osmClient) {
      return res.status(503).json({
        success: false,
        message: 'OpenStreetMap service is not available',
      });
    }

    const searchOptions: any = {
      country: country as string,
      limit: parseInt(limit as string, 10),
    };

    // Add proximity if provided (format: "lng,lat")
    if (proximity) {
      const [lon, lat] = (proximity as string).split(',');
      if (lon && lat) {
        searchOptions.viewbox = `${parseFloat(lon) - 0.1},${parseFloat(lat) - 0.1},${parseFloat(lon) + 0.1},${parseFloat(lat) + 0.1}`;
        searchOptions.bounded = 1;
      }
    }

    const results = await osmClient.geocode(query as string, searchOptions);

    // Transform results to consistent format
    const features = results.map((result: any) => ({
      place_name: result.display_name,
      center: [parseFloat(result.lon), parseFloat(result.lat)],
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(result.lon), parseFloat(result.lat)],
      },
      properties: {
        address: result.address,
        type: result.type,
        class: result.class,
        importance: result.importance,
      },
    }));

    res.json({
      success: true,
      data: {
        features,
        query: query,
        provider: 'openstreetmap',
        attribution: '© OpenStreetMap contributors',
      },
    });

  } catch (error: any) {
    console.error('Places search error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Places search failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/map/static
 * Generate static map image URL using OpenStreetMap tiles
 */
router.get('/static', async (req: Request, res: Response) => {
  try {
    const { 
      longitude, 
      latitude, 
      zoom = 12, 
      width = 600, 
      height = 400,
      markers = ''
    } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude parameters are required',
      });
    }

    if (!osmClient) {
      return res.status(503).json({
        success: false,
        message: 'OpenStreetMap service is not available',
      });
    }

    // For static maps with OSM, we can use services like:
    // - StaticMapLite
    // - MapProxy
    // - Or generate URLs for Leaflet-based static maps
    
    const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&maptype=mapnik`;
    
    // Add markers if provided (basic implementation)
    let finalUrl = staticMapUrl;
    if (markers) {
      finalUrl += `&markers=${markers}`;
    }

    res.json({
      success: true,
      data: {
        url: finalUrl,
        tileServer: osmClient.tileServer,
        parameters: {
          center: { 
            longitude: parseFloat(longitude as string), 
            latitude: parseFloat(latitude as string) 
          },
          zoom: parseInt(zoom as string, 10),
          dimensions: { 
            width: parseInt(width as string, 10), 
            height: parseInt(height as string, 10) 
          },
        },
        provider: 'openstreetmap',
        attribution: '© OpenStreetMap contributors',
        note: 'For production, consider setting up your own tile server or using a CDN',
      },
    });

  } catch (error: any) {
    console.error('Static map error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Static map generation failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/map/health
 * Check OpenStreetMap service health
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const isAvailable = !!osmClient;
    
    // Test with a simple geocoding request if available
    let testResult = null;
    if (isAvailable) {
      try {
        const testData = await osmClient.geocode('Addis Ababa', { limit: 1 });
        testResult = testData?.length > 0 ? 'success' : 'no_results';
      } catch (testError) {
        testResult = 'error';
      }
    }

    res.json({
      success: true,
      data: {
        status: isAvailable ? 'healthy' : 'unavailable',
        service: 'openstreetmap',
        testResult,
        timestamp: new Date().toISOString(),
        endpoints: {
          geocode: '/api/map/geocode',
          reverseGeocode: '/api/map/reverse-geocode',
          directions: '/api/map/directions',
          places: '/api/map/places',
          static: '/api/map/static',
        },
        features: {
          geocoding: 'Available via Nominatim',
          reverseGeocoding: 'Available via Nominatim',
          directions: 'Basic routing (consider OSRM for advanced)',
          staticMaps: 'Available via OSM tiles',
          cost: 'FREE - No API key required!',
        },
        attribution: '© OpenStreetMap contributors',
      },
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;