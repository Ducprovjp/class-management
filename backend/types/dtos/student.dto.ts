export interface CreateStudentRequestDto {
    name: string;
    dob?: string;
    gender?: string;
    current_grade?: number;
    parent_id: string;
  }
  
  export interface StudentResponseDto {
    _id: string;
    name: string;
    dob?: string;
    gender?: string;
    current_grade?: number;
    parent_id: string; // Thay đổi từ object sang string
  }
  
  export interface CreateStudentResponseDto {
    success: boolean;
    data: StudentResponseDto;
  }