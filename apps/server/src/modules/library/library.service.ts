import { prisma } from '../../config/database';
import { NotFoundError, BadRequestError } from '../../common/utils/errors';

export class LibraryService {
  async addBook(tenantId: string, data: any) {
    return prisma.book.create({ data: { ...data, tenantId, available: data.quantity } });
  }

  async listBooks(tenantId: string, search?: string) {
    return prisma.book.findMany({
      where: { tenantId, ...(search && { OR: [{ title: { contains: search, mode: 'insensitive' } }, { author: { contains: search, mode: 'insensitive' } }] }) },
      orderBy: { title: 'asc' },
    });
  }

  async issueBook(tenantId: string, data: any) {
    const book = await prisma.book.findFirst({ where: { id: data.bookId, tenantId } });
    if (!book) throw new NotFoundError('Book not found');
    if (book.available < 1) throw new BadRequestError('No copies available');

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const [issue] = await prisma.$transaction([
      prisma.bookIssue.create({ data: { tenantId, bookId: data.bookId, studentId: data.studentId, dueDate, status: 'ISSUED' } }),
      prisma.book.update({ where: { id: data.bookId }, data: { available: book.available - 1 } }),
    ]);

    return issue;
  }

  async returnBook(tenantId: string, issueId: string) {
    const issue = await prisma.bookIssue.findFirst({ where: { id: issueId, tenantId } });
    if (!issue || issue.status === 'RETURNED') throw new BadRequestError('Invalid issue');

    let fine = 0;
    const today = new Date();
    if (today > issue.dueDate) {
      const days = Math.ceil((today.getTime() - issue.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      fine = days * 5;
    }

    await prisma.$transaction([
      prisma.bookIssue.update({ where: { id: issueId }, data: { returnDate: today, status: 'RETURNED', fine } }),
      prisma.book.update({ where: { id: issue.bookId }, data: { available: { increment: 1 } } }),
    ]);

    return { fine, message: fine > 0 ? `Late fee: ₹${fine}` : 'Returned on time!' };
  }

  async getIssues(tenantId: string) {
    return prisma.bookIssue.findMany({
      where: { tenantId },
      include: { book: { select: { title: true } }, student: { select: { fullName: true, admissionId: true } } },
      orderBy: { issueDate: 'desc' },
    });
  }
}

export const libraryService = new LibraryService();
