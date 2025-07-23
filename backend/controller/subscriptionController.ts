import express, { Request, Response } from "express";
import { AuthenticatedRequest, isAuthenticated } from "../middleware/auth";
import subscriptionService from "../services/subscriptionService";
import {
  CreateSubscriptionRequestDto,
  CreateSubscriptionResponseDto,
  GetSubscriptionResponseDto,
  UseSessionRequestDto,
  UseSessionResponseDto,
} from "../types/dtos/subscription.dto";
import { AppErrorResponse } from "../types/errors";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  async (
    req: Request<
      {},
      CreateSubscriptionResponseDto,
      CreateSubscriptionRequestDto
    > &
      AuthenticatedRequest,
    res: Response<CreateSubscriptionResponseDto | AppErrorResponse>
  ) => {
    try {
      const subscription = await subscriptionService.createSubscription(
        req.body
      );
      res.status(201).json({ success: true, data: subscription });
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

router.patch(
  "/:id/use",
  isAuthenticated,
  async (
    req: Request<{ id: string }, UseSessionResponseDto, UseSessionRequestDto> &
      AuthenticatedRequest,
    res: Response<UseSessionResponseDto | AppErrorResponse>
  ) => {
    try {
      const subscription = await subscriptionService.useSession(
        req.params.id,
        req.body
      );
      res.status(200).json({ success: true, data: subscription });
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
  "/:id",
  isAuthenticated,
  async (
    req: Request<{ id: string }, GetSubscriptionResponseDto, {}, {}> &
      AuthenticatedRequest,
    res: Response<GetSubscriptionResponseDto | AppErrorResponse>
  ) => {
    try {
      const subscription = await subscriptionService.getSubscriptionById(
        req.params.id
      );
      res.status(200).json({ success: true, data: subscription });
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
  "/student/:student_id/subscriptions",
  isAuthenticated,
  async (req: Request<{ student_id: string }>, res: Response) => {
    try {
      const subscriptions =
        await subscriptionService.getSubscriptionsByStudentId(
          req.params.student_id
        );
      res.status(200).json({ success: true, data: subscriptions });
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
