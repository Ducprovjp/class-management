import { Response } from 'express';
import User from '../models/User';
import { LoginRequestDto, SignupRequestDto } from '../types/dtos/user.dto';
import { AppError, AuthenticationError, ServerError, ValidationError } from '../types/errors';
import { sendToken } from '../utils/jwtToken';

export class UserService {
  async createUser({ name, email, password }: SignupRequestDto, res: Response): Promise<void> {
    try {
      if (!name || !email || !password) {
        throw new ValidationError('Please provide all fields');
      }
      if (password.length < 6) {
        throw new ValidationError('Password must be at least 6 characters');
      }

      const userEmail = await User.findOne({ email });
      if (userEmail) {
        throw new ValidationError('User already exists');
      }

      const user = await User.create({ name, email, password });
      sendToken(user, 201, res);
    } catch (error) {
      throw error instanceof AppError ? error : new ServerError((error as Error).message);
    }
  }

  async loginUser({ email, password }: LoginRequestDto, res: Response): Promise<void> {
    try {
      if (!email || !password) {
        throw new ValidationError('Please provide all fields');
      }
      
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new AuthenticationError("User doesn't exist");
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Incorrect password');
      }
      
      sendToken(user, 200, res);
    } catch (error) {
      throw error instanceof AppError ? error : new ServerError((error as Error).message);
    }
  }
}

export default new UserService();