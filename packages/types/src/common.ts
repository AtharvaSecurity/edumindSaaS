export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
  meta?: { page?: number; limit?: number; total?: number; };
}

export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'PRINCIPAL' | 'TEACHER' | 'ACCOUNTANT' | 'STUDENT' | 'PARENT';
export type SubscriptionPlan = 'FREEMIUM' | 'BASIC' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'TRIAL';
