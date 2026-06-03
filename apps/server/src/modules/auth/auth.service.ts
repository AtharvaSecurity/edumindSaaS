import { prisma } from '../../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../config/jwt';
import { hashPassword, comparePassword } from '../../common/utils/password';
import { UnauthorizedError, ConflictError, NotFoundError } from '../../common/utils/errors';

export class AuthService {
  async registerSchool(data: any) {
    const existingTenant = await prisma.tenant.findUnique({ where: { subdomain: data.subdomain } });
    if (existingTenant) throw new ConflictError(`Subdomain '${data.subdomain}' is already taken`);

    const existingUser = await prisma.user.findUnique({ where: { email: data.adminEmail } });
    if (existingUser) throw new ConflictError(`Email '${data.adminEmail}' is already registered`);

    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: data.schoolName,
          subdomain: data.subdomain,
          city: data.city,
          state: data.state,
          address: data.address,
          pincode: data.pincode,
          phone: data.adminPhone,
          email: data.adminEmail,
          settings: { timezone: 'Asia/Kolkata', currency: 'INR', dateFormat: 'DD/MM/YYYY' },
        },
      });

      const hashedPassword = await hashPassword(data.adminPassword);
      const user = await tx.user.create({
        data: {
          email: data.adminEmail,
          passwordHash: hashedPassword,
          role: 'SCHOOL_ADMIN',
          tenantId: tenant.id,
          phone: data.adminPhone,
          isActive: true,
        },
      });

      await tx.admin.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
          fullName: data.adminFullName,
          phone: data.adminPhone,
          employeeCode: 'ADM001',
        },
      });

      const currentYear = new Date().getFullYear();
      await tx.academicYear.create({
        data: {
          tenantId: tenant.id,
          name: `${currentYear}-${currentYear + 1}`,
          startDate: new Date(`${currentYear}-04-01`),
          endDate: new Date(`${currentYear + 1}-03-31`),
          isActive: true,
        },
      });

      return { tenant, user };
    });

    const payload = { userId: result.user.id, tenantId: result.tenant.id, role: result.user.role, subdomain: result.tenant.subdomain };
    const tokens = this.generateTokens(payload);

    await prisma.user.update({ where: { id: result.user.id }, data: { refreshToken: tokens.refreshToken } });

    return {
      user: { id: result.user.id, email: result.user.email!, role: result.user.role, fullName: data.adminFullName },
      tokens,
      tenant: { id: result.tenant.id, name: result.tenant.name, subdomain: result.tenant.subdomain },
    };
  }

  async login(data: any) {
    const tenant = await prisma.tenant.findUnique({ where: { subdomain: data.tenantSubdomain } });
    if (!tenant) throw new NotFoundError('School not found');
    if (!tenant.isActive) throw new UnauthorizedError('School account is inactive');

    const user = await prisma.user.findFirst({ where: { email: data.email, tenantId: tenant.id } });
    if (!user || !user.isActive) throw new UnauthorizedError('Invalid credentials');

    const isValid = await comparePassword(data.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

    const payload = { userId: user.id, tenantId: tenant.id, role: user.role, subdomain: tenant.subdomain };
    const tokens = this.generateTokens(payload);

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });

    return {
      user: { id: user.id, email: user.email!, role: user.role, fullName: 'User' },
      tokens,
      tenant: { id: tenant.id, name: tenant.name, subdomain: tenant.subdomain },
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, include: { tenant: true } });
    if (!user || !user.isActive || user.refreshToken !== refreshToken) throw new UnauthorizedError('Invalid refresh token');

    const payload = { userId: user.id, tenantId: user.tenantId, role: user.role, subdomain: user.tenant.subdomain };
    const tokens = this.generateTokens(payload);
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });
    return tokens;
  }

  async logout(userId: string) {
    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
  }

  private generateTokens(payload: any) {
    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken({ userId: payload.userId }),
      expiresIn: 900,
    };
  }
}

export const authService = new AuthService();
