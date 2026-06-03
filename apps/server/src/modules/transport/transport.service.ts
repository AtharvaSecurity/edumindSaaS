import { prisma } from '../../config/database';

export class TransportService {
  async addRoute(tenantId: string, data: any) {
    return prisma.transport.create({ data: { ...data, tenantId } });
  }

  async listRoutes(tenantId: string) {
    return prisma.transport.findMany({
      where: { tenantId },
      include: { stops: { orderBy: { stopOrder: 'asc' } }, students: { include: { student: { select: { fullName: true, admissionId: true } } } } },
    });
  }

  async assignStudent(tenantId: string, data: any) {
    return prisma.transportStudent.create({ data: data });
  }

  async addStop(tenantId: string, data: any) {
    return prisma.routeStop.create({ data: data });
  }
}

export const transportService = new TransportService();
