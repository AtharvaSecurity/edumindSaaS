import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestError } from '../utils/errors';

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const messages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        throw new BadRequestError(`Validation failed: ${messages.join(', ')}`);
      }
      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
}
