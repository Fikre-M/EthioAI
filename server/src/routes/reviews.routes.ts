import { Router } from 'express';
import { authenticate, optionalAuth } from '../middlewares/auth.middleware';
import { ResponseUtil } from '../utils/response';

const router = Router();

// Placeholder routes
router.get('/', optionalAuth, (req, res) => {
  ResponseUtil.success(res, { reviews: [] }, 'Reviews retrieved');
});

router.post('/', authenticate, (req, res) => {
  ResponseUtil.created(res, { 
    review: { id: '1', ...req.body }
  }, 'Review created');
});

export default router;