export interface CreateClassRegistrationRequestDto {
    student_id: string;
  }
  
  export interface ClassRegistrationResponseDto {
    _id: string;
    class_id: string;
    student_id: string;
  }
  
  export interface CreateClassRegistrationResponseDto {
    success: boolean;
    data: ClassRegistrationResponseDto;
  }