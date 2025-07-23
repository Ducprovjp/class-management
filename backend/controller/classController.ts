import express, { Request, Response } from 'express';
import { AuthenticatedRequest, isAuthenticated } from '../middleware/auth';
import classService from '../services/classService';
import { CreateClassRequestDto, CreateClassResponseDto, GetClassesResponseDto } from '../types/dtos/class.dto';
import { AppErrorResponse } from '../types/errors';

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  async (req: Request<{}, CreateClassResponseDto, CreateClassRequestDto> & AuthenticatedRequest, res: Response<CreateClassResponseDto | AppErrorResponse>) => {
    try {
      const newClass = await classService.createClass(req.body);
      res.status(201).json({ success: true, data: newClass });
    } catch (error) {
      const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Server error',
        statusCode,
      });
    }
  }
);

router.get(
  '/',
  isAuthenticated,
  async (req: Request<{}, GetClassesResponseDto, {}, { day?: string }> & AuthenticatedRequest, res: Response<GetClassesResponseDto | AppErrorResponse>) => {
    try {
      const classes = await classService.getClasses(req.query.day);
      res.status(200).json({ success: true, data: classes });
    } catch (error) {
      const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Server error',
        statusCode,
      });
    }
  }
);

export default router;