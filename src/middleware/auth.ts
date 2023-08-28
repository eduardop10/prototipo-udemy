import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { extractTokenPayload } from '../utils/jwt';

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  // check header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }
  // check cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new AppError('Authentication invalid');
  }
  try {
    const payload = extractTokenPayload(token);

    req.user = {
      _id: payload._id,
      name: payload.name,
    };
    next();
  } catch (error) {
    throw new AppError('Authentication invalid');
  }
};

const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    /* if (!user || !roles.includes(user.roles)) {
      throw new AppError('Unauthorized to access this route');
    }
    next(); */
  };
};

export { authenticateUser, authorizeRoles };
