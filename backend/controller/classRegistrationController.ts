import express, { Request, Response } from "express";
import { AuthenticatedRequest, isAuthenticated } from "../middleware/auth";
import classRegistrationService from "../services/classRegistrationService";
import {
  CreateClassRegistrationRequestDto,
  CreateClassRegistrationResponseDto,
} from "../types/dtos/classRegistration.dto";
import { AppErrorResponse } from "../types/errors";

const router = express.Router();

router.post(
  "/:class_id/register",
  isAuthenticated,
  async (
    req: Request<
      { class_id: string },
      CreateClassRegistrationResponseDto,
      CreateClassRegistrationRequestDto
    > &
      AuthenticatedRequest,
    res: Response<CreateClassRegistrationResponseDto | AppErrorResponse>
  ) => {
    try {
      const registration = await classRegistrationService.registerStudent(
        req.params.class_id,
        req.body
      );
      res.status(201).json({ success: true, data: registration });
    } catch (error) {
      const statusCode =
        error instanceof Error && "statusCode" in error
          ? (error as any).statusCode
          : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : "Server error",
        statusCode,
      });
    }
  }
);

router.get(
  "/student/:student_id",
  isAuthenticated,
  async (req: Request<{ student_id: string }>, res: Response) => {
    try {
      const registrations =
        await classRegistrationService.getRegistrationsByStudent(
          req.params.student_id
        );
      res.status(200).json({ success: true, data: registrations });
    } catch (error) {
      const statusCode =
        error instanceof Error && "statusCode" in error
          ? (error as any).statusCode
          : 500;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : "Server error",
        statusCode,
      });
    }
  }
);

export default router;
