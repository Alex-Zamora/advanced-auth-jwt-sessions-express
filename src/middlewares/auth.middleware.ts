import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '@utils/jwt';
import { AppError } from '@utils/AppError';

export const authentication = async (req: Request, _: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies?.accessToken as string | undefined;
        if (!accessToken)
            throw AppError.unauthorized({
                message: 'Invalid or expired token',
            });

        const { id } = await verifyJWT('accessPublicKey', accessToken);
        req.userId = id;

        next();
    } catch (error) {
        next(error);
    }
};
