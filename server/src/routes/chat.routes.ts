import { Router } from 'express';
import { optionalAuth } from '../middlewares/auth.middleware';
import { ResponseUtil } from '../utils/response';

const router = Router();

// Placeholder routes
router.post('/message', optionalAuth, (req, res) => {
  ResponseUtil.success(res, { 
    response: 'Hello! How can I help you explore Ethiopia today?',
    recommendations: []
  }, 'Message processed');
});

router.get('/history', optionalAuth, (req, res) => {
  ResponseUtil.success(res, { messages: [] }, 'Chat history retrieved');
});

export default router;