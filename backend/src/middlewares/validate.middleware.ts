import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      const zodError = error as { errors?: Array<{ path: string[]; message: string }> };
      res.status(400).json({
        message: 'Dữ liệu không hợp lệ',
        errors: zodError.errors?.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
  };
};
