export type FieldError = Record<string, string[]>;

export type TypeError = 'simple' | 'form';

export interface AppErrorOptions {
    statusCode: number;
    message: string;
    type?: TypeError;
    code: string;
    detail?: string;
    errors?: FieldError;
}

interface ErrorOptions extends Pick<AppErrorOptions, 'type' | 'detail' | 'errors'> {
    message?: string;
}

// TODO: refactorizar la respuesta de success
export class AppError extends Error {
    statusCode: number;
    type: TypeError;
    code: string;
    detail?: string;
    errors?: FieldError;

    constructor(options: AppErrorOptions) {
        const { statusCode, message, type, code, detail, errors } = options;

        super(message);
        this.statusCode = statusCode;
        this.type = type || 'simple';
        this.code = code;
        this.detail = detail;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(options: ErrorOptions) {
        const { message = 'Bad request', type, errors } = options;
        return new AppError({ statusCode: 400, message, type, code: 'BAD_REQUEST', errors });
    }

    static unauthorized(options: ErrorOptions) {
        const { message = 'Unauthorized', detail } = options;
        return new AppError({ statusCode: 401, message, code: 'UNAUTHORIZED', detail });
    }

    static forbidden(options: ErrorOptions) {
        const { message = 'Access denied', detail } = options;
        return new AppError({ statusCode: 403, message, code: 'FORBIDDEN', detail });
    }

    static notFound(options: ErrorOptions) {
        const { message = 'Resource not found', detail } = options;
        return new AppError({ statusCode: 404, message, code: 'NOT_FOUND', detail });
    }

    static conflict(options: ErrorOptions) {
        const { message = 'Conflict', type, detail, errors } = options;
        return new AppError({ statusCode: 409, message, type, code: 'CONFLICT', detail, errors });
    }
}
