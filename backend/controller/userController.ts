import express, { Request, Response } from 'express';
import userService from '../services/userService';
import { AuthResponseDto, LoginRequestDto, SignupRequestDto } from '../types/dtos/user.dto';
import { AppErrorResponse } from '../types/errors';

const router = express.Router();

router.post('/create-user', async (req: Request<{}, AuthResponseDto, SignupRequestDto>, res: Response<AuthResponseDto | AppErrorResponse>) => {
  try {
    await userService.createUser(req.body, res);
  } catch (error) {
    const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
      statusCode,
    });
  }
});

router.post('/login-user', async (req: Request<{}, AuthResponseDto, LoginRequestDto>, res: Response<AuthResponseDto | AppErrorResponse>) => {
  try {
    await userService.loginUser(req.body, res);
  } catch (error) {
    const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
      statusCode,
    });
  }
});

export default router;