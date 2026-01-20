import { Router } from 'express';
import { optionalAuth, authenticate } from '../middlewares/auth.middleware';
import { ResponseUtil } from '../utils/response';

const router = Router();

// Placeholder routes
router.get('/products', optionalAuth, (req, res) => {
  ResponseUtil.success(res, { products: [] }, 'Products retrieved');
});

router.get('/categories', optionalAuth, (req, res) => {
  ResponseUtil.success(res, { categories: [] }, 'Categories retrieved');
});

router.post('/orders', authenticate, (req, res) => {
  ResponseUtil.created(res, { 
    order: { id: '1', ...req.body }
  }, 'Order created');
});

export default router;