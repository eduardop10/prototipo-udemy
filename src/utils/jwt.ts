import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { UnauthenticatedError } from '../errors';
import * as dotenv from 'dotenv';
dotenv.config();

interface UserPayload {
  _id: string;
  name: string;
}

interface UserWithAdminPayload extends UserPayload {
  isAdmin: boolean;
}


const createJWT = (payload: UserPayload): string => {
  const token = jwt.sign(payload, "jwtsecret", {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = (token: string): boolean => {
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return true;
  } catch (error) {
    return false;
  }
};

const attachCookiesToResponse = (res: Response, user: UserPayload): void => {
  const token = createJWT(user);

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    //signed: true,
  });
};

const extractTokenPayload = (token: string): UserPayload  => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    return decoded;
  } catch (error) {
    throw new UnauthenticatedError('Invalid token');
  }
};

export { createJWT, isTokenValid, attachCookiesToResponse, extractTokenPayload, UserPayload, UserWithAdminPayload };
