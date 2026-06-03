import { prisma } from '../../config/database';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../common/utils/errors';
import { Prisma } from '@prisma/client';

export class AttendanceService {
  /**
   * Mark attendance for multiple students at once
   */
  async markAttendance(tenantId: string, userId: string, data: any) {
    const { date, sectionId, records } = data;

    // Verify section exists and belongs to tenant
    const section = await prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      include: { class: true },
    });

    if (!section) {
      throw new NotFoundError('Section not found');
    }

    // Verify all students belong to the tenant
    const studentIds = records.map((r: any) => r.studentId);
    const students = await prisma.student.findMany({
      where: {
        id: { in: studentIds },
        tenantId,
        isActive: true,
      },
      select: { id: true },
    });

    if (students.length !== studentIds.length) {
      throw new BadRequestError('One or more students not found or inactive');
    }

    // Check for existing attendance records for this date
    const existingRecords = await prisma.attendance.findMany({
      where: {
        tenantId,
        date: new Date(date),
        studentId: { in: studentIds },
      },
      select: { studentId: true },
    });

    const existingStudentIds = new Set(existingRecords.map(r => r.studentId));
    const newRecords = records.filter((r: any) => !existingStudentIds.has(r.studentId));
    const updateRecords = records.filter((r: any) => existingStudentIds.has(r.studentId));

    const results = {
      created: 0,
      updated: 0,
      total: records.length,
    };

    // Create new attendance records
    if (newRecords.length > 0) {
      await prisma.attendance.createMany({
        data: newRecords.map((record: any) => ({
          tenantId,
          studentId: record.studentId,
          sectionId,
          date: new Date(date),
          status: record.status,
          markedBy: userId,
          remark: record.remark,
        })),
      });
      results.created = newRecords.length;
    }

    // Update existing records
    for (const record of updateRecords) {
      await prisma.attendance.updateMany({
        where: {
          tenantId,
          studentId: record.studentId,
          date: new Date(date),
        },
        data: {
          status: record.status,
          markedBy: userId,
          remark: record.remark,
        },
      });
    }
    results.updated = updateRecords.length;

    return {
      ...results,
      section: `${section.class.name} - ${section.name}`,
      date,
    };
  }

  /**
   * Get attendance records with filters
   */
  async getAttendance(tenantId: string, query: any) {
    const { date, month, sectionId, studentId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.AttendanceWhereInput = {
      tenantId,
      ...(date && { date: new Date(date) }),
      ...(studentId && { studentId }),
      ...(sectionId && { sectionId }),
      ...(month && {
        date: {
          gte: new Date(`${month}-01`),
          lt: new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1),
        },
      }),
    };

    const [attendances, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              admissionId: true,
              rollNumber: true,
            },
          },
          section: {
            select: {
              id: true,
              name: true,
              class: { select: { id: true, name: true } },
            },
          },
        },
      }),
      prisma.attendance.count({ where }),
    ]);

    return {
      data: attendances,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get attendance report for a specific student
   */
  async getStudentAttendanceReport(tenantId: string, studentId: string, month: string) {
    const student = await prisma.student.findFirst({
      where: { id: studentId, tenantId },
      select: { id: true, fullName: true, admissionId: true, rollNumber: true },
    });

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    const [year, monthNum] = month.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0);

    const attendances = await prisma.attendance.findMany({
      where: {
        tenantId,
        studentId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        status: true,
        remark: true,
      },
    });

    // Calculate statistics
    const total = attendances.length;
    const present = attendances.filter(a => a.status === 'PRESENT').length;
    const absent = attendances.filter(a => a.status === 'ABSENT').length;
    const late = attendances.filter(a => a.status === 'LATE').length;
    const halfDay = attendances.filter(a => a.status === 'HALF_DAY').length;

    return {
      student,
      month,
      statistics: {
        total,
        present,
        absent,
        late,
        halfDay,
        percentage: total > 0 ? ((present + late * 0.5) / total * 100).toFixed(2) : 0,
      },
      records: attendances,
    };
  }

  /**
   * Get section-wise attendance summary for a date
   */
  async getSectionAttendanceSummary(tenantId: string, date: string, sectionId: string) {
    const section = await prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      include: { class: true },
    });

    if (!section) {
      throw new NotFoundError('Section not found');
    }

    const attendances = await prisma.attendance.findMany({
      where: {
        tenantId,
        sectionId,
        date: new Date(date),
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            rollNumber: true,
            admissionId: true,
          },
        },
      },
      orderBy: {
        student: { rollNumber: 'asc' },
      },
    });

    const summary = {
      present: attendances.filter(a => a.status === 'PRESENT').length,
      absent: attendances.filter(a => a.status === 'ABSENT').length,
      late: attendances.filter(a => a.status === 'LATE').length,
      halfDay: attendances.filter(a => a.status === 'HALF_DAY').length,
      total: attendances.length,
    };

    return {
      section: `${section.class.name} - ${section.name}`,
      date,
      summary,
      records: attendances,
    };
  }

  /**
   * Create leave application
   */
  async createLeave(tenantId: string, userId: string, userRole: string, data: any) {
    // If student, use their own ID; if parent, must provide studentId
    let studentId = data.studentId;

    if (userRole === 'STUDENT') {
      const student = await prisma.student.findFirst({
        where: { userId, tenantId },
      });
      if (!student) throw new NotFoundError('Student profile not found');
      studentId = student.id;
    }

    // Validate date range
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    if (startDate > endDate) {
      throw new BadRequestError('Start date cannot be after end date');
    }

    const leave = await prisma.leave.create({
      data: {
        tenantId,
        studentId,
        userId,
        leaveType: data.leaveType,
        startDate,
        endDate,
        reason: data.reason,
        status: 'PENDING',
      },
      include: {
        student: { select: { fullName: true, admissionId: true } },
        user: { select: { email: true } },
      },
    });

    return leave;
  }

  /**
   * Approve or reject leave
   */
  async processLeave(tenantId: string, approverId: string, leaveId: string, data: any) {
    const leave = await prisma.leave.findFirst({
      where: { id: leaveId, tenantId },
    });

    if (!leave) throw new NotFoundError('Leave application not found');
    if (leave.status !== 'PENDING') throw new BadRequestError('Leave already processed');

    const updated = await prisma.leave.update({
      where: { id: leaveId },
      data: {
        status: data.status,
        approvedBy: approverId,
        approvedAt: new Date(),
        remark: data.remark,
      },
      include: {
        student: { select: { fullName: true } },
        user: { select: { email: true } },
      },
    });

    // Auto-mark attendance as absent for approved leaves
    if (data.status === 'APPROVED' && leave.studentId) {
      const dates = this.getDatesInRange(leave.startDate, leave.endDate);
      for (const date of dates) {
        await prisma.attendance.upsert({
          where: {
            studentId_date: {
              studentId: leave.studentId,
              date,
            },
          },
          update: { status: 'ABSENT', remark: 'On approved leave' },
          create: {
            tenantId,
            studentId: leave.studentId,
            date,
            status: 'ABSENT',
            markedBy: approverId,
            remark: 'Auto-marked: Approved leave',
          },
        });
      }
    }

    return updated;
  }

  /**
   * Get leave applications
   */
  async getLeaves(tenantId: string, query: any) {
    const { status, studentId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.LeaveWhereInput = {
      tenantId,
      ...(status && { status }),
      ...(studentId && { studentId }),
    };

    const [leaves, total] = await Promise.all([
      prisma.leave.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          student: { select: { fullName: true, admissionId: true } },
          user: { select: { email: true, role: true } },
          approver: { select: { email: true } },
        },
      }),
      prisma.leave.count({ where }),
    ]);

    return {
      data: leaves,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get attendance statistics for dashboard
   */
  async getAttendanceStats(tenantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayAttendance, totalStudents] = await Promise.all([
      prisma.attendance.findMany({
        where: { tenantId, date: today },
      }),
      prisma.student.count({ where: { tenantId, isActive: true } }),
    ]);

    const present = todayAttendance.filter(a => a.status === 'PRESENT').length;
    const absent = todayAttendance.filter(a => a.status === 'ABSENT').length;
    const unmarked = totalStudents - todayAttendance.length;

    return {
      date: today.toISOString().split('T')[0],
      totalStudents,
      marked: todayAttendance.length,
      unmarked,
      present,
      absent,
      presentPercentage: todayAttendance.length > 0 
        ? (present / todayAttendance.length * 100).toFixed(2) 
        : 0,
    };
  }

  private getDatesInRange(start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }
}

export const attendanceService = new AttendanceService();
