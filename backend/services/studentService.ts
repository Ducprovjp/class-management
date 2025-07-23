import Parent from '../models/Parent';
import Student from '../models/Student';
import { CreateStudentRequestDto, StudentResponseDto } from '../types/dtos/student.dto';
import { AppError, NotFoundError, ServerError, ValidationError } from '../types/errors';

export class StudentService {
  async createStudent(data: CreateStudentRequestDto): Promise<StudentResponseDto> {
    try {
      if (!data.name || !data.parent_id) {
        throw new ValidationError('Name and parent_id are required');
      }
      const parent = await Parent.findById(data.parent_id);
      if (!parent) {
        throw new NotFoundError('Parent not found');
      }
      const student = new Student(data);
      const savedStudent = await student.save();
      return {
        _id: savedStudent._id.toString(),
        name: savedStudent.name,
        dob: savedStudent.dob,
        gender: savedStudent.gender,
        current_grade: savedStudent.current_grade,
        parent_id: data.parent_id,
      };
    } catch (error) {
      throw error instanceof AppError ? error : new ServerError((error as Error).message);
    }
  }

  async getStudents(): Promise<StudentResponseDto[]> {
    try {
      const students = await Student.find();
      return students.map((student) => ({
        _id: student._id.toString(),
        name: student.name,
        dob: student.dob,
        gender: student.gender,
        current_grade: student.current_grade,
        parent_id: student.parent_id.toString(),
      }));
    } catch (error) {
      throw error instanceof AppError ? error : new ServerError((error as Error).message);
    }
  }

  async getStudentById(id: string): Promise<StudentResponseDto> {
    try {
      const student = await Student.findById(id);
      if (!student) throw new NotFoundError('Student not found');
      return {
        _id: student._id.toString(),
        name: student.name,
        dob: student.dob,
        gender: student.gender,
        current_grade: student.current_grade,
        parent_id: student.parent_id.toString(),
      };
    } catch (error) {
      throw error instanceof AppError ? error : new ServerError((error as Error).message);
    }
  }
}

export default new StudentService();