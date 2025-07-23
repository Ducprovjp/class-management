import Student from "../models/Student";
import Subscription from "../models/Subscription";
import {
  CreateSubscriptionRequestDto,
  SubscriptionResponseDto,
  UseSessionRequestDto,
} from "../types/dtos/subscription.dto";
import {
  AppError,
  NotFoundError,
  ServerError,
  ValidationError,
} from "../types/errors";

export class SubscriptionService {
  async createSubscription(
    data: CreateSubscriptionRequestDto
  ): Promise<SubscriptionResponseDto> {
    try {
      if (!data.student_id) {
        throw new ValidationError("Student ID is required");
      }
      const student = await Student.findById(data.student_id);
      if (!student) {
        throw new NotFoundError("Student not found");
      }
      const subscription = new Subscription({ ...data, used_sessions: 0 });
      const savedSubscription = await subscription.save();
      return {
        _id: savedSubscription._id.toString(),
        student_id: savedSubscription.student_id.toString(),
        package_name: savedSubscription.package_name,
        start_date: savedSubscription.start_date,
        end_date: savedSubscription.end_date,
        total_sessions: savedSubscription.total_sessions,
        used_sessions: savedSubscription.used_sessions,
      };
    } catch (error) {
      throw error instanceof AppError
        ? error
        : new ServerError((error as Error).message);
    }
  }

  async useSession(
    id: string,
    data: UseSessionRequestDto
  ): Promise<SubscriptionResponseDto> {
    try {
      const subscription = await Subscription.findById(id);
      if (!subscription) {
        throw new NotFoundError("Subscription not found");
      }
      if (subscription.student_id.toString() !== data.student_id) {
        throw new ValidationError("Invalid student for this subscription");
      }
      if (subscription.used_sessions >= (subscription.total_sessions || 0)) {
        throw new ValidationError("No sessions left");
      }
      subscription.used_sessions += 1;
      const updatedSubscription = await subscription.save();
      return {
        _id: updatedSubscription._id.toString(),
        student_id: updatedSubscription.student_id.toString(),
        package_name: updatedSubscription.package_name,
        start_date: updatedSubscription.start_date,
        end_date: updatedSubscription.end_date,
        total_sessions: updatedSubscription.total_sessions,
        used_sessions: updatedSubscription.used_sessions,
      };
    } catch (error) {
      throw error instanceof AppError
        ? error
        : new ServerError((error as Error).message);
    }
  }

  async getSubscriptionById(id: string): Promise<SubscriptionResponseDto> {
    try {
      const subscription = await Subscription.findById(id);
      if (!subscription) {
        throw new NotFoundError("Subscription not found");
      }
      return {
        _id: subscription._id.toString(),
        student_id: subscription.student_id.toString(),
        package_name: subscription.package_name,
        start_date: subscription.start_date,
        end_date: subscription.end_date,
        total_sessions: subscription.total_sessions,
        used_sessions: subscription.used_sessions,
      };
    } catch (error) {
      throw error instanceof AppError
        ? error
        : new ServerError((error as Error).message);
    }
  }

  async getSubscriptionsByStudentId(
    student_id: string
  ): Promise<SubscriptionResponseDto[]> {
    try {
      const subscriptions = await Subscription.find({ student_id });
      return subscriptions.map((sub) => ({
        _id: sub._id.toString(),
        student_id: sub.student_id.toString(),
        package_name: sub.package_name,
        start_date: sub.start_date,
        end_date: sub.end_date,
        total_sessions: sub.total_sessions,
        used_sessions: sub.used_sessions,
      }));
    } catch (error) {
      throw error instanceof AppError
        ? error
        : new ServerError((error as Error).message);
    }
  }
}

export default new SubscriptionService();
