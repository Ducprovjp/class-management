import { Response } from 'express';
import { Document } from 'mongoose';
import { IUser } from '../models/User';
import { AuthResponseDto } from '../types/dtos/user.dto';

export const sendToken = (
  user: IUser & Document,
  statusCode: number,
  res: Response<AuthResponseDto>
) => {
  const token = (user as any).getJwtToken();

  const response: AuthResponseDto = {
    success: true,
    data: {
      user: {
        _id: user._id.toString(), // giờ không lỗi nữa
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    },
  };

  res.status(statusCode).json(response);
};