import { prisma } from '../../config/database';

export class PayrollService {
  async addSalary(tenantId: string, data: any) {
    const netPay = parseFloat(data.basicPay) - parseFloat(data.deductions || 0) + parseFloat(data.bonus || 0);
    return prisma.staffSalary.create({ data: { ...data, tenantId, netPay } });
  }
  async listSalaries(tenantId: string, month?: string) {
    return prisma.staffSalary.findMany({
      where: { tenantId, ...(month && { month }) },
      include: { teacher: { select: { fullName: true, employeeCode: true } } },
      orderBy: { month: 'desc' },
    });
  }
  async markPaid(tenantId: string, id: string) {
    return prisma.staffSalary.update({ where: { id }, data: { status: 'PAID', paidDate: new Date() } });
  }
}
export const payrollService = new PayrollService();
