import { Request, Response, NextFunction } from 'express';
import { libraryService } from './library.service';

export class LibraryController {
  async addBook(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json({ success: true, data: await libraryService.addBook(req.user!.tenantId, req.body) }); } catch(e) { next(e); }
  }
  async listBooks(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await libraryService.listBooks(req.user!.tenantId, req.query.search as string) }); } catch(e) { next(e); }
  }
  async issueBook(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await libraryService.issueBook(req.user!.tenantId, req.body), message: 'Book issued!' }); } catch(e) { next(e); }
  }
  async returnBook(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await libraryService.returnBook(req.user!.tenantId, req.params.issueId) }); } catch(e) { next(e); }
  }
  async getIssues(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await libraryService.getIssues(req.user!.tenantId) }); } catch(e) { next(e); }
  }
}

export const libraryController = new LibraryController();
