import express, { Request, Response } from 'express';
import { AuthenticatedRequest, isAuthenticated } from '../middleware/auth';
import studentService from '../services/studentService';
import { CreateStudentRequestDto, CreateStudentResponseDto, StudentResponseDto } from '../types/dtos/student.dto';
import { AppErrorResponse } from '../types/errors';

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  async (req: Request<{}, StudentResponseDto, CreateStudentRequestDto> & AuthenticatedRequest, res: Response<CreateStudentResponseDto | AppErrorResponse>) => {
    try {
      const student = await studentService.createStudent(req.body);
      res.status(201).json({ success: true, data: student });
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
  async (req: Request<{}, { success: boolean; data: StudentResponseDto[] }, {}, {}> & AuthenticatedRequest, res: Response<{ success: boolean; data: StudentResponseDto[] } | AppErrorResponse>) => {
    try {
      const students = await studentService.getStudents();
      res.status(200).json({ success: true, data: students });
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
  async (req: Request<{ id: string }, StudentResponseDto, {}, {}> & AuthenticatedRequest, res: Response<{ success: boolean; data: StudentResponseDto } | AppErrorResponse>) => {
    try {
      const student = await studentService.getStudentById(req.params.id);
      res.status(200).json({ success: true, data: student });
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