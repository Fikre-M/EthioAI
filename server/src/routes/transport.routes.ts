import { Router } from 'express';
import { optionalAuth } from '../middlewares/auth.middleware';
import { ResponseUtil } from '../utils/response';

const router = Router();

// Placeholder routes
router.get('/options', optionalAuth, (req, res) => {
  ResponseUtil.success(res, { options: [] }, 'Transport options retrieved');
});

router.post('/book', optionalAuth, (req, res) => {
  ResponseUtil.created(res, { 
    booking: { id: '1', ...req.body }
  }, 'Transport booked');
});

export default router;