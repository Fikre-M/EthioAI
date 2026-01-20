import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { ResponseUtil } from '../utils/response';

const router = Router();

// Placeholder routes
router.get('/', authenticate, (req, res) => {
  ResponseUtil.success(res, { bookings: [] }, 'Bookings retrieved');
});

router.post('/', authenticate, (req, res) => {
  ResponseUtil.created(res, { booking: { id: '1', ...req.body } }, 'Booking created');
});

export default router;