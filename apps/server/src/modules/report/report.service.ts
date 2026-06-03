import { prisma } from '../../config/database';
export class ReportService {
  async dashboardReport(tenantId: string) {
    const [students, attendance, fees, exams, books, transport] = await Promise.all([
      prisma.student.count({ where: { tenantId } }),
      prisma.attendance.count({ where: { tenantId, date: new Date() } }),
      prisma.studentFee.aggregate({ where: { tenantId }, _sum: { totalAmount: true, paidAmount: true } }),
      prisma.exam.count({ where: { tenantId } }),
      prisma.book.count({ where: { tenantId } }),
      prisma.transport.count({ where: { tenantId } }),
    ]);
    return {
      students: { total: students, active: await prisma.student.count({ where: { tenantId, isActive: true } }) },
      attendance: { today: attendance, rate: students > 0 ? ((attendance / students) * 100).toFixed(1) : 0 },
      fees: { demand: fees._sum.totalAmount || 0, collected: fees._sum.paidAmount || 0, pending: (fees._sum.totalAmount || 0) - (fees._sum.paidAmount || 0) },
      exams: { total: exams },
      library: { books },
      transport: { routes: transport },
    };
  }
}
export const reportService = new ReportService();
