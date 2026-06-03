import { prisma } from '../../config/database';

export class TimetableService {
  async createSlot(tenantId: string, data: any) {
    return prisma.timetable.create({ data: { ...data, tenantId } });
  }

  async getTimetable(tenantId: string, sectionId: string) {
    return prisma.timetable.findMany({
      where: { tenantId, sectionId },
      include: {
        subject: { select: { name: true } },
        teacher: { select: { fullName: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async addSyllabus(tenantId: string, data: any) {
    return prisma.syllabus.create({ data: { ...data, tenantId } });
  }

  async getSyllabus(tenantId: string, classId: string, month?: string) {
    return prisma.syllabus.findMany({
      where: { tenantId, classId, ...(month && { month }) },
      include: { subject: { select: { name: true } } },
      orderBy: { month: 'asc' },
    });
  }

  async createEvent(tenantId: string, data: any) {
    return prisma.event.create({ data: { ...data, tenantId } });
  }

  async getEvents(tenantId: string) {
    return prisma.event.findMany({
      where: { tenantId },
      orderBy: { eventDate: 'asc' },
    });
  }
}

export const timetableService = new TimetableService();
