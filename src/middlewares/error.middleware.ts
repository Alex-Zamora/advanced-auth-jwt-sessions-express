import { ZodError } from 'zod';
import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError';

export const formatZodError = (error: ZodError) => {
    return error.issues.reduce<Record<string, string[]>>((acc, issue) => {
        /**
         * To avoid return body.**, example:
         * "body.name": ["Min 3 character"]
         * "body.email",
         * "body.password"
         */
        const rawPath = [...issue.path];
        if (rawPath.length && ['body', 'query', 'params'].includes(String(rawPath[0]))) {
            rawPath.shift();
        }
        const key = rawPath.length ? rawPath.join('.') : 'non_field_errors';
        // Another way
        // acc[key] = acc[key] || [];
        if (!acc[key]) acc[key] = [];
        acc[key].push(issue.message);
        return acc;
    }, {});
};

export const errorHandler: ErrorRequestHandler = (
    error,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    // TODO: Add some logger
    console.error(`Error occured on PATH: ${req.path}`, error);

    if (error instanceof AppError) {
        const { statusCode, message, type, code, detail, errors } = error;
        return res
            .status(statusCode)
            .json({ message, type, code, ...(detail && { detail }), ...(errors && { errors }) });
    }

    return res.status(500).json({
        message: 'Internal server error.',
        type: 'simple',
        detail: error?.message || 'Unknown error ocurred',
    });
};
