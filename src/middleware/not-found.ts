import { Request, Response, NextFunction } from 'express';

export function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    error: 'Route does not exist.'
  });
}

