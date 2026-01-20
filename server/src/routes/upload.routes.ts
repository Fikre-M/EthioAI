import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { ResponseUtil } from '../utils/response';

const router = Router();

// Placeholder routes
router.post('/image', authenticate, (req, res) => {
  ResponseUtil.success(res, { 
    url: 'https://example.com/uploaded-image.jpg',
    publicId: 'sample-image-id'
  }, 'Image uploaded successfully');
});

export default router;