import Class from "../models/Class";
import {
  ClassResponseDto,
  CreateClassRequestDto,
} from "../types/dtos/class.dto";
import { AppError, ServerError, ValidationError } from "../types/errors";

export class ClassService {
  async createClass(data: CreateClassRequestDto): Promise<ClassResponseDto> {
    try {
      if (!data.name) {
        throw new ValidationError("Class name is required");
      }
      const newClass = new Class(data);
      const savedClass = await newClass.save();
      return {
        _id: savedClass._id.toString(),
        name: savedClass.name,
        subject: savedClass.subject,
        day_of_week: savedClass.day_of_week,
        time_start: savedClass.time_start,
        time_end: savedClass.time_end,
        teacher_name: savedClass.teacher_name,
        max_students: savedClass.max_students,
      };
    } catch (error) {
      throw error instanceof AppError
        ? error
        : new ServerError((error as Error).message);
    }
  }

  async getClasses(day?: string): Promise<ClassResponseDto[]> {
    try {
      const query = day ? { day_of_week: day } : {};
      const classes = await Class.find(query);
      return classes.map((cls) => ({
        _id: cls._id.toString(),
        name: cls.name,
        subject: cls.subject,
        day_of_week: cls.day_of_week,
        time_start: cls.time_start,
        time_end: cls.time_end,
        teacher_name: cls.teacher_name,
        max_students: cls.max_students,
      }));
    } catch (error) {
      throw error instanceof AppError
        ? error
        : new ServerError((error as Error).message);
    }
  }
}

export default new ClassService();
