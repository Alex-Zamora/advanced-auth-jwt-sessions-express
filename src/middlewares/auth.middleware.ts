import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '@utils/jwt';
import { AppError } from '@utils/AppError';
import Session from '@models/Session.model';

export const authentication = async (req: Request, _: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies?.accessToken as string | undefined;
        if (!accessToken)
            throw AppError.unauthorized({
                message: 'Invalid or expired token',
            });

        const { userId, sessionId } = await verifyJWT('accessPublicKey', accessToken),
            session = await Session.findById(sessionId);

        if (!session || session.expiresAt.getTime() <= Date.now())
            throw AppError.unauthorized({ message: 'Session expired' });

        req.userId = userId;
        req.sessionId = sessionId;

        next();
    } catch (error) {
        next(error);
    }
};
