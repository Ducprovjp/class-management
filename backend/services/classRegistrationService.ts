import Class from "../models/Class";
import ClassRegistration from "../models/ClassRegistration";
import Student from "../models/Student";
import {
  ClassRegistrationResponseDto,
  CreateClassRegistrationRequestDto,
} from "../types/dtos/classRegistration.dto";
import {
  AppError,
  NotFoundError,
  ServerError,
  ValidationError,
} from "../types/errors";
import mongoose from "mongoose";

export class ClassRegistrationService {
  async registerStudent(
    classId: string,
    data: CreateClassRegistrationRequestDto
  ): Promise<ClassRegistrationResponseDto> {
    try {
      if (!data.student_id) {
        throw new ValidationError("Student ID is required");
      }
      const classObj = await Class.findById(classId);
      if (!classObj) {
        throw new NotFoundError("Class not found");
      }
      const student = await Student.findById(data.student_id);
      if (!student) {
        throw new NotFoundError("Student not found");
      }
      const existingRegistration = await ClassRegistration.findOne({
        class_id: classId,
        student_id: data.student_id,
      });
      if (existingRegistration) {
        throw new ValidationError("Student already registered for this class");
      }
      // Lấy tất cả class_id đã đăng ký của học sinh
      const registeredClassIds = student.class_ids || [];
      if (registeredClassIds.length > 0) {
        // Lấy thông tin các lớp đã đăng ký
        const registeredClasses = await Class.find({
          _id: { $in: registeredClassIds },
        });
        // Kiểm tra trùng lịch
        for (const regClass of registeredClasses) {
          if (
            regClass.day_of_week === classObj.day_of_week &&
            regClass.time_start &&
            regClass.time_end &&
            classObj.time_start &&
            classObj.time_end
          ) {
            // So sánh overlap
            if (
              regClass.time_start < classObj.time_end &&
              classObj.time_start < regClass.time_end
            ) {
              throw new ValidationError(
                "Lịch học bị trùng với lớp: " + regClass.name
              );
            }
          }
        }
      }
      // Đăng ký lớp
      const registration = new ClassRegistration({
        class_id: classId,
        student_id: data.student_id,
      });
      const savedRegistration = await registration.save();
      // Cập nhật class_ids cho Student - Fixed type issue
      student.class_ids = [
        ...registeredClassIds.map((id) => id.toString()),
        classObj._id.toString(),
      ];
      await student.save();
      return {
        _id: savedRegistration._id.toString(),
        class_id: savedRegistration.class_id.toString(),
        student_id: savedRegistration.student_id.toString(),
      };
    } catch (error) {
      throw error instanceof AppError
        ? error
        : new ServerError((error as Error).message);
    }
  }

  async getRegistrationsByStudent(student_id: string) {
    return await ClassRegistration.find({ student_id });
  }
}

export default new ClassRegistrationService();
