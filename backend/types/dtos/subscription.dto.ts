export interface CreateSubscriptionRequestDto {
  student_id: string;
  package_name?: string;
  start_date?: string;
  end_date?: string;
  total_sessions?: number;
}

export interface UseSessionRequestDto {
  student_id: string;
}

export interface SubscriptionResponseDto {
  _id: string;
  student_id: string;
  package_name?: string;
  start_date?: string;
  end_date?: string;
  total_sessions?: number;
  used_sessions: number;
}

export interface CreateSubscriptionResponseDto {
  success: boolean;
  data: SubscriptionResponseDto;
}

export interface UseSessionResponseDto {
  success: boolean;
  data: SubscriptionResponseDto;
}

export interface GetSubscriptionResponseDto {
  success: boolean;
  data: SubscriptionResponseDto;
}