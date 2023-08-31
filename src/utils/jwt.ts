import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { UnauthenticatedError } from '../errors';

interface UserPayload {
  _id: string;
  name: string;
}

interface UserWithAdminPayload extends UserPayload {
  isAdmin: boolean;
}


const createJWT = (payload: UserPayload): string => {
  const token = jwt.sign(payload, "jwtsecret", {
    expiresIn: "1h",
  });
  return token;
};

const isTokenValid = (token: string): boolean => {
  try {
    jwt.verify(token, "jwtsecret");
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
    const decoded = jwt.verify(token, 'jwtsecret') as UserPayload;
    return decoded;
  } catch (error) {
    throw new UnauthenticatedError('Invalid token');
  }
};

export { createJWT, isTokenValid, attachCookiesToResponse, extractTokenPayload, UserPayload, UserWithAdminPayload };
