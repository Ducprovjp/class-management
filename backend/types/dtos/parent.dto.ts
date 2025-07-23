export interface CreateParentRequestDto {
    name: string;
    phone?: string;
    email: string;
  }
  
  export interface ParentResponseDto {
    _id: string;
    name: string;
    phone?: string;
    email: string;
  }
  
  export interface CreateParentResponseDto {
    success: boolean;
    data: ParentResponseDto;
  }