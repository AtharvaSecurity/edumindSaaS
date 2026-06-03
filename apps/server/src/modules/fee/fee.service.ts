import { prisma } from '../../config/database';
import { NotFoundError, BadRequestError, ConflictError } from '../../common/utils/errors';
import { Prisma } from '@prisma/client';

export class FeeService {
  async createFeeStructure(tenantId: string, data: any) {
    const existing = await prisma.feeStructure.findFirst({
      where: { tenantId, name: data.name },
    });
    if (existing) throw new ConflictError('Fee structure with this name already exists');

    return prisma.feeStructure.create({
      data: { ...data, tenantId },
    });
  }

  async listFeeStructures(tenantId: string) {
    return prisma.feeStructure.findMany({
      where: { tenantId, isActive: true },
      include: { class: { select: { name: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async assignFeeToStudent(tenantId: string, data: any) {
    const student = await prisma.student.findFirst({
      where: { id: data.studentId, tenantId, isActive: true },
    });
    if (!student) throw new NotFoundError('Student not found');

    const feeStruct = await prisma.feeStructure.findFirst({
      where: { id: data.feeStructureId, tenantId },
    });
    if (!feeStruct) throw new NotFoundError('Fee structure not found');

    const amount = data.customAmount || feeStruct.amount;

    return prisma.studentFee.create({
      data: {
        tenantId,
        studentId: data.studentId,
        feeStructureId: data.feeStructureId,
        academicYear: data.academicYear,
        totalAmount: amount,
        dueDate: new Date(data.dueDate),
        status: 'PENDING',
      },
      include: {
        student: { select: { fullName: true, admissionId: true } },
        feeStructure: { select: { name: true } },
      },
    });
  }

  async bulkAssignFees(tenantId: string, data: any) {
    const feeStruct = await prisma.feeStructure.findFirst({
      where: { id: data.feeStructureId, tenantId },
    });
    if (!feeStruct) throw new NotFoundError('Fee structure not found');

    const results = { success: 0, failed: 0, errors: [] as any[] };

    for (const studentId of data.studentIds) {
      try {
        await prisma.studentFee.create({
          data: {
            tenantId,
            studentId,
            feeStructureId: data.feeStructureId,
            academicYear: data.academicYear,
            totalAmount: feeStruct.amount,
            dueDate: new Date(data.dueDate),
            status: 'PENDING',
          },
        });
        results.success++;
      } catch (e: any) {
        results.failed++;
        results.errors.push({ studentId, error: e.message });
      }
    }
    return results;
  }

  async recordPayment(tenantId: string, userId: string, data: any) {
    const studentFee = await prisma.studentFee.findFirst({
      where: { id: data.studentFeeId, tenantId },
    });
    if (!studentFee) throw new NotFoundError('Fee record not found');

    const receiptNumber = await this.generateReceiptNumber(tenantId);

    const payment = await prisma.payment.create({
      data: {
        tenantId,
        studentFeeId: data.studentFeeId,
        amount: data.amount,
        paymentMode: data.paymentMode,
        transactionRef: data.transactionRef,
        collectedBy: userId,
        receiptNumber,
        remark: data.remark,
        paymentDate: new Date(),
      },
    });

    // Update student fee status
    const totalPaid = await prisma.payment.aggregate({
      where: { studentFeeId: data.studentFeeId },
      _sum: { amount: true },
    });

    const paidAmount = totalPaid._sum.amount || 0;
    let status: any = 'PENDING';
    if (paidAmount >= studentFee.totalAmount) status = 'PAID';
    else if (paidAmount > 0) status = 'PARTIAL';

    await prisma.studentFee.update({
      where: { id: data.studentFeeId },
      data: { paidAmount, status },
    });

    return payment;
  }

  async getStudentFees(tenantId: string, studentId: string) {
    return prisma.studentFee.findMany({
      where: { tenantId, studentId },
      include: {
        feeStructure: { select: { name: true, frequency: true } },
        payments: { orderBy: { paymentDate: 'desc' } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getDefaulterList(tenantId: string) {
    const today = new Date();
    return prisma.studentFee.findMany({
      where: {
        tenantId,
        status: { in: ['PENDING', 'PARTIAL', 'OVERDUE'] },
        dueDate: { lt: today },
      },
      include: {
        student: { select: { fullName: true, admissionId: true, rollNumber: true } },
        feeStructure: { select: { name: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getFeeStats(tenantId: string) {
    const today = new Date();
    const [totalDemand, totalCollected, pendingCount, todayCollection] = await Promise.all([
      prisma.studentFee.aggregate({ where: { tenantId }, _sum: { totalAmount: true } }),
      prisma.studentFee.aggregate({ where: { tenantId }, _sum: { paidAmount: true } }),
      prisma.studentFee.count({ where: { tenantId, status: { in: ['PENDING', 'PARTIAL', 'OVERDUE'] } } }),
      prisma.payment.aggregate({
        where: { tenantId, paymentDate: today },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalDemand: totalDemand._sum.totalAmount || 0,
      totalCollected: totalCollected._sum.paidAmount || 0,
      pendingAmount: (totalDemand._sum.totalAmount || 0) - (totalCollected._sum.paidAmount || 0),
      pendingCount,
      todayCollection: todayCollection._sum.amount || 0,
      collectionPercentage: totalDemand._sum.totalAmount
        ? ((totalCollected._sum.paidAmount || 0) / totalDemand._sum.totalAmount * 100).toFixed(2)
        : 0,
    };
  }

  private async generateReceiptNumber(tenantId: string): Promise<string> {
    const date = new Date();
    const prefix = `RCP/${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}/`;
    const lastPayment = await prisma.payment.findFirst({
      where: { tenantId, receiptNumber: { startsWith: prefix } },
      orderBy: { receiptNumber: 'desc' },
      select: { receiptNumber: true },
    });
    const seq = lastPayment ? parseInt(lastPayment.receiptNumber.split('/').pop() || '0') + 1 : 1;
    return `${prefix}${seq.toString().padStart(4, '0')}`;
  }
}

export const feeService = new FeeService();
