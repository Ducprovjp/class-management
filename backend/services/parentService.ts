import Parent from '../models/Parent';
import { CreateParentRequestDto, ParentResponseDto } from '../types/dtos/parent.dto';
import { AppError, NotFoundError, ServerError, ValidationError } from '../types/errors';

export class ParentService {
  async createParent(data: CreateParentRequestDto): Promise<ParentResponseDto> {
    try {
      if (!data.name || !data.email) {
        throw new ValidationError('Name and email are required');
      }
      const parent = new Parent(data);
      const savedParent = await parent.save();
      return {
        _id: savedParent._id.toString(),
        name: savedParent.name,
        phone: savedParent.phone,
        email: savedParent.email,
      };
    } catch (error) {
      throw error instanceof AppError ? error : new ServerError((error as Error).message);
    }
  }

  async getParents(): Promise<ParentResponseDto[]> {
    try {
      const parents = await Parent.find();
      return parents.map((parent) => ({
        _id: parent._id.toString(),
        name: parent.name,
        phone: parent.phone,
        email: parent.email,
      }));
    } catch (error) {
      throw error instanceof AppError ? error : new ServerError((error as Error).message);
    }
  }

  async getParentById(id: string): Promise<ParentResponseDto> {
    try {
      const parent = await Parent.findById(id);
      if (!parent) throw new NotFoundError('Parent not found');
      return {
        _id: parent._id.toString(),
        name: parent.name,
        phone: parent.phone,
        email: parent.email,
      };
    } catch (error) {
      throw error instanceof AppError ? error : new ServerError((error as Error).message);
    }
  }
}

export default new ParentService();