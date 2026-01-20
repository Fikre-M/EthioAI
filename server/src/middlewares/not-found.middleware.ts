import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response';

/**
 * 404 Not Found middleware
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  ResponseUtil.notFound(res, `Route ${req.method} ${req.originalUrl} not found`);
};