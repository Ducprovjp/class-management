export interface CreateClassRequestDto {
  name: string;
  subject?: string;
  day_of_week?: string;
  time_start?: string;
  time_end?: string;
  teacher_name?: string;
  max_students?: number;
}

export interface ClassResponseDto {
  _id: string;
  name: string;
  subject?: string;
  day_of_week?: string;
  time_start?: string;
  time_end?: string;
  teacher_name?: string;
  max_students?: number;
}

export interface CreateClassResponseDto {
  success: boolean;
  data: ClassResponseDto;
}

export interface GetClassesResponseDto {
  success: boolean;
  data: ClassResponseDto[];
}
