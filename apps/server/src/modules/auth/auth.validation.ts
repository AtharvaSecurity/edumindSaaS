import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email').max(255).transform(e => e.toLowerCase().trim()),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  tenantSubdomain: z.string().min(3).max(100).regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 'Invalid subdomain').transform(s => s.toLowerCase().trim()),
});

export const registerSchoolSchema = z.object({
  schoolName: z.string().min(3).max(255).trim(),
  subdomain: z.string().min(3).max(100).regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 'Invalid subdomain').transform(s => s.toLowerCase().trim()),
  adminEmail: z.string().email('Invalid email').max(255).transform(e => e.toLowerCase().trim()),
  adminPassword: z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, 'Password must contain uppercase, lowercase, number, and special character'),
  adminFullName: z.string().min(2).max(255).trim(),
  adminPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone').optional(),
  city: z.string().min(2).max(100).trim(),
  state: z.string().min(2).max(100).trim(),
  address: z.string().max(500).optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid PIN code').optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
