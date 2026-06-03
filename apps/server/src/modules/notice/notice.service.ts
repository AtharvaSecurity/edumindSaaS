import { prisma } from '../../config/database';
export class NoticeService {
  async create(tenantId: string, data: any) { return prisma.notice.create({ data: { ...data, tenantId } }); }
  async list(tenantId: string) { return prisma.notice.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } }); }
}
export const noticeService = new NoticeService();
