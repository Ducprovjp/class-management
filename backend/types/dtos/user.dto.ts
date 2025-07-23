export interface LoginRequestDto {
    email: string;
    password: string;
  }
  
  export interface SignupRequestDto {
    name: string;
    email: string;
    password: string;
  }
  
  export interface UserResponseDto {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  }
  
  export interface AuthResponseDto {
    success: boolean;
    data: {
      user: UserResponseDto;
      token: string;
    };
  }