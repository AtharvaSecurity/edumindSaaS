import { prisma } from '../../config/database';
import { NotFoundError, BadRequestError } from '../../common/utils/errors';

export class ExamService {
  // Create exam
  async createExam(tenantId: string, data: any) {
    return prisma.exam.create({ data: { ...data, tenantId } });
  }

  // List exams
  async listExams(tenantId: string) {
    return prisma.exam.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Enter marks
  async enterMarks(tenantId: string, userId: string, data: any) {
    const { examId, studentId, subjectId, marks } = data;

    // Verify exam exists
    const exam = await prisma.exam.findFirst({ where: { id: examId, tenantId } });
    if (!exam) throw new NotFoundError('Exam not found');

    // Calculate grade
    const percentage = (marks / exam.maxMarks) * 100;
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B+';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C';
    else if (percentage >= 40) grade = 'D';
    else if (percentage >= 33) grade = 'E';

    return prisma.result.upsert({
      where: {
        examId_studentId_subjectId: { examId, studentId, subjectId },
      },
      update: { marks, grade, enteredBy: userId },
      create: { tenantId, examId, studentId, subjectId, marks, grade, enteredBy: userId },
    });
  }

  // Get results for an exam
  async getExamResults(tenantId: string, examId: string) {
    return prisma.result.findMany({
      where: { tenantId, examId },
      include: {
        student: { select: { fullName: true, admissionId: true, rollNumber: true } },
        subject: { select: { name: true } },
      },
      orderBy: [{ student: { rollNumber: 'asc' } }, { subject: { name: 'asc' } }],
    });
  }

  // Get student result card
  async getStudentResultCard(tenantId: string, studentId: string, examId: string) {
    const results = await prisma.result.findMany({
      where: { tenantId, studentId, examId },
      include: {
        subject: { select: { name: true, maxMarks: true } },
        exam: { select: { name: true, maxMarks: true, passMarks: true } },
      },
    });

    const student = await prisma.student.findFirst({
      where: { id: studentId, tenantId },
      select: { fullName: true, admissionId: true, rollNumber: true },
    });

    const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
    const maxTotal = results.reduce((sum, r) => sum + r.subject.maxMarks, 0);
    const percentage = maxTotal > 0 ? ((totalMarks / maxTotal) * 100).toFixed(2) : 0;

    return {
      student,
      exam: results[0]?.exam,
      subjects: results.map(r => ({
        subject: r.subject.name,
        maxMarks: r.subject.maxMarks,
        marks: r.marks,
        grade: r.grade,
      })),
      totalMarks,
      maxTotal,
      percentage,
      result: percentage >= 33 ? 'PASS' : 'FAIL',
    };
  }
}

export const examService = new ExamService();
