import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Document } from 'mongoose';
import User from '../models/User';
import { AuthenticationError } from '../types/errors';

export interface AuthenticatedRequest extends Request {
  currentUser?: Document;
}

export const isAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Please login to continue'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AuthenticationError('User not found'));
    }
    req.currentUser = user;
    next();
  } catch (error) {
    return next(new AuthenticationError('Invalid token'));
  }
};