import { prisma } from '../../config/database';
import { hashPassword } from '../../common/utils/password';
import { ConflictError, NotFoundError, BadRequestError } from '../../common/utils/errors';
import { Prisma, UserRole } from '@prisma/client';

export class StudentService {
  /**
   * Create a new student with optional parent creation
   */
  async createStudent(tenantId: string, data: any) {
    // Check if email is already taken
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser) {
        throw new ConflictError('Email already registered');
      }
    }

    // Check if admission ID is provided and unique
    if (data.admissionId) {
      const existingStudent = await prisma.student.findUnique({
        where: { admissionId: data.admissionId },
      });
      if (existingStudent) {
        throw new ConflictError('Admission ID already exists');
      }
    }

    // Verify class and section exist and belong to tenant
    const section = await prisma.section.findFirst({
      where: {
        id: data.sectionId,
        tenantId,
        classId: data.classId,
      },
    });

    if (!section) {
      throw new NotFoundError('Class or section not found');
    }

    // Generate admission ID if not provided
    const admissionId = data.admissionId || await this.generateAdmissionId(tenantId);

    const result = await prisma.$transaction(async (tx) => {
      // Create user account for student
      const hashedPassword = await hashPassword(data.password);
      
      const user = await tx.user.create({
        data: {
          email: data.email || `${admissionId.toLowerCase()}@student.vidyaerp.local`,
          phone: data.phone,
          passwordHash: hashedPassword,
          role: UserRole.STUDENT,
          tenantId,
          isActive: true,
        },
      });

      // Create student profile
      const student = await tx.student.create({
        data: {
          userId: user.id,
          tenantId,
          admissionId,
          rollNumber: data.rollNumber,
          fullName: data.fullName,
          dob: data.dob ? new Date(data.dob) : null,
          gender: data.gender,
          bloodGroup: data.bloodGroup,
          address: data.address,
          admissionDate: data.admissionDate ? new Date(data.admissionDate) : new Date(),
          isActive: true,
        },
      });

      // Create parent if parent details provided
      if (data.parentName && data.parentPhone) {
        // Check if parent already exists by phone
        let parent = await tx.parent.findFirst({
          where: {
            tenantId,
            phoneSecondary: data.parentPhone,
          },
          include: { user: true },
        });

        if (!parent) {
          // Create parent user
          const parentUser = await tx.user.create({
            data: {
              email: data.parentEmail || `parent_${data.parentPhone}@vidyaerp.local`,
              phone: data.parentPhone,
              passwordHash: hashedPassword, // Same password as student initially
              role: UserRole.PARENT,
              tenantId,
              isActive: true,
            },
          });

          // Create parent profile
          parent = await tx.parent.create({
            data: {
              userId: parentUser.id,
              tenantId,
              fullName: data.parentName,
              occupation: data.parentOccupation,
              phoneSecondary: data.parentPhone,
              relation: data.parentRelation || 'FATHER',
            },
          });
        }

        // Link parent to student
        await tx.parentStudent.create({
          data: {
            parentId: parent.id,
            studentId: student.id,
            relationship: data.parentRelation || 'FATHER',
          },
        });
      }

      return student;
    });

    return this.getStudentById(tenantId, result.id);
  }

  /**
   * Get student by ID with all related data
   */
  async getStudentById(tenantId: string, studentId: string) {
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        tenantId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            isActive: true,
            lastLogin: true,
            createdAt: true,
          },
        },
        parentStudents: {
          include: {
            parent: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    return student;
  }

  /**
   * List students with pagination, search, and filters
   */
  async listStudents(tenantId: string, query: any) {
    const { page = 1, limit = 20, search, classId, sectionId, isActive } = query;
    const skip = (page - 1) * limit;

    // Build where conditions
    const where: Prisma.StudentWhereInput = {
      tenantId,
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { admissionId: { contains: search, mode: 'insensitive' } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { user: { phone: { contains: search } } },
        ],
      }),
    };

    // Get students in specific class/section
    if (classId || sectionId) {
      // This requires joining through student_class_sections
      // For now, we'll add a note that this needs the enrollment table
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
              isActive: true,
              lastLogin: true,
            },
          },
          parentStudents: {
            include: {
              parent: {
                select: {
                  id: true,
                  fullName: true,
                  phoneSecondary: true,
                  relation: true,
                },
              },
            },
          },
        },
      }),
      prisma.student.count({ where }),
    ]);

    return {
      data: students,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update student information
   */
  async updateStudent(tenantId: string, studentId: string, data: any) {
    const student = await prisma.student.findFirst({
      where: { id: studentId, tenantId },
    });

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Update user table if phone or email changed
    if (data.phone) {
      await prisma.user.update({
        where: { id: student.userId },
        data: { phone: data.phone },
      });
    }

    // Update student profile
    const updated = await prisma.student.update({
      where: { id: studentId },
      data: {
        fullName: data.fullName,
        rollNumber: data.rollNumber,
        dob: data.dob ? new Date(data.dob) : undefined,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        address: data.address,
        isActive: data.isActive,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            isActive: true,
          },
        },
      },
    });

    return updated;
  }

  /**
   * Deactivate a student (soft delete)
   */
  async deactivateStudent(tenantId: string, studentId: string) {
    const student = await prisma.student.findFirst({
      where: { id: studentId, tenantId },
    });

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    await prisma.$transaction([
      prisma.student.update({
        where: { id: studentId },
        data: { isActive: false },
      }),
      prisma.user.update({
        where: { id: student.userId },
        data: { isActive: false },
      }),
    ]);

    return { message: 'Student deactivated successfully' };
  }

  /**
   * Bulk import students from Excel/CSV data
   */
  async bulkImportStudents(tenantId: string, students: any[]) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
    };

    for (const studentData of students) {
      try {
        await this.createStudent(tenantId, studentData);
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          student: studentData.fullName || 'Unknown',
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Generate unique admission ID
   */
  private async generateAdmissionId(tenantId: string): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `VPA/${currentYear}/`;
    
    // Get the last admission ID for this year
    const lastStudent = await prisma.student.findFirst({
      where: {
        tenantId,
        admissionId: { startsWith: prefix },
      },
      orderBy: { admissionId: 'desc' },
      select: { admissionId: true },
    });

    let sequence = 1;
    if (lastStudent) {
      const lastSequence = parseInt(lastStudent.admissionId.split('/').pop() || '0');
      sequence = lastSequence + 1;
    }

    return `${prefix}${sequence.toString().padStart(4, '0')}`;
  }

  /**
   * Get student statistics for dashboard
   */
  async getStudentStats(tenantId: string) {
    const [total, active, inactive, thisMonth] = await Promise.all([
      prisma.student.count({ where: { tenantId } }),
      prisma.student.count({ where: { tenantId, isActive: true } }),
      prisma.student.count({ where: { tenantId, isActive: false } }),
      prisma.student.count({
        where: {
          tenantId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return {
      total,
      active,
      inactive,
      newThisMonth: thisMonth,
    };
  }
}

export const studentService = new StudentService();
