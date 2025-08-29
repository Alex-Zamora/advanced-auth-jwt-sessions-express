import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../utils/AppError';
import { formatZodError } from './error.middleware';

type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void;

type Validate = (
    schema: z.ZodObject<{
        body?: z.ZodTypeAny;
        query?: z.ZodTypeAny;
        params?: z.ZodTypeAny;
    }>,
) => MiddlewareFunction;

export const validate: Validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
    });

    if (!result.success) {
        const errors = formatZodError(result.error);
        return next(
            AppError.badRequest({
                message: 'Validation failed',
                type: 'form',
                errors,
            }),
        );
    }

    next();
};
