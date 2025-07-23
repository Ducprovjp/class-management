import express, { Request, Response } from 'express';
import { AuthenticatedRequest, isAuthenticated } from '../middleware/auth';
import parentService from '../services/parentService';
import { CreateParentRequestDto, CreateParentResponseDto, ParentResponseDto } from '../types/dtos/parent.dto';
import { AppErrorResponse } from '../types/errors';

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  async (req: Request<{}, CreateParentResponseDto, CreateParentRequestDto> & AuthenticatedRequest, res: Response<CreateParentResponseDto | AppErrorResponse>) => {
    try {
      const parent = await parentService.createParent(req.body);
      res.status(201).json({ success: true, data: parent });
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
  async (req: Request<{}, { success: boolean; data: ParentResponseDto[] }, {}, {}> & AuthenticatedRequest, res: Response<{ success: boolean; data: ParentResponseDto[] } | AppErrorResponse>) => {
    try {
      const parents = await parentService.getParents();
      res.status(200).json({ success: true, data: parents });
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
  '/:id',
  isAuthenticated,
  async (req: Request<{ id: string }, CreateParentResponseDto, {}, {}> & AuthenticatedRequest, res: Response<CreateParentResponseDto | AppErrorResponse>) => {
    try {
      const parent = await parentService.getParentById(req.params.id);
      res.status(200).json({ success: true, data: parent });
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