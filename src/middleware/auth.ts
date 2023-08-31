import { Request, Response, NextFunction } from 'express';
import { UnauthenticatedError, UnauthorizedError } from '../errors';
import { extractTokenPayload, UserPayload, UserWithAdminPayload} from '../utils/jwt';

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
    throw new UnauthenticatedError('Authentication invalid');
  }

  const payload = extractTokenPayload(token);

  req.user = {
    _id: payload._id,
    name: payload.name
  };

  next();
};

const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
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
    throw new UnauthenticatedError('Authentication invalid');
  }

  if (!isAdmin(token)) {
    throw new UnauthorizedError('Unauthorized');
  }

  next();
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

const authenticateAdmin2 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    authenticateUser(req, res, async () => {
      const token = req.cookies.token || '';

      if (!token) {
        throw new UnauthenticatedError('Authentication invalid');
      }

      if (!isAdmin(token)) {
        throw new UnauthorizedError('Unauthorized');
      }

      next(); // Passa o controle para o próximo middleware
    });
  } catch (error) {
    next(error); // Passa o erro para o próximo middleware de tratamento de erros
  }
};

const isAdmin = (token: string): boolean => {
  const payload = extractTokenPayload(token) as UserWithAdminPayload;
  if(!payload){
    throw new UnauthenticatedError('Authentication invalid')
  }
  return payload.isAdmin;
};
export { authenticateUser, authorizeRoles, authenticateAdmin };
