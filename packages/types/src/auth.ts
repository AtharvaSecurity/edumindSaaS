import { UserRole } from './common';

export interface LoginRequest {
  email: string;
  password: string;
  tenantSubdomain: string;
}

export interface RegisterSchoolRequest {
  schoolName: string;
  subdomain: string;
  adminEmail: string;
  adminPassword: string;
  adminFullName: string;
  adminPhone: string;
  city: string;
  state: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  userId: string;
  tenantId: string;
  role: UserRole;
  subdomain: string;
}

export interface AuthResponse {
  user: { id: string; email: string; role: UserRole; fullName: string; };
  tokens: TokenPair;
  tenant: { id: string; name: string; subdomain: string; };
}
