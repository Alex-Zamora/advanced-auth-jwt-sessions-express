import { Request, Response, NextFunction } from 'express';

type AsyncController = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<Response | void>;

export const catchErrors =
    (controller: AsyncController): AsyncController =>
    async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error);
        }
    };
