import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate = (schema: z.ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};

// Validation schemas
export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const postSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  categoryId: z.number().int().positive(),
  published: z.boolean().optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1),
  postId: z.number().int().positive(),
}); 