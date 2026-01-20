import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { ResponseUtil } from '../utils/response';

const router = Router();

// Placeholder routes
router.get('/', authenticate, (req, res) => {
  ResponseUtil.success(res, { itineraries: [] }, 'Itineraries retrieved');
});

router.post('/', authenticate, (req, res) => {
  ResponseUtil.created(res, { 
    itinerary: { id: '1', ...req.body }
  }, 'Itinerary created');
});

export default router;