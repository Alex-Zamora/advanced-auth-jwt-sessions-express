import { Request, Response } from 'express';
import { getUsersService } from '@services/user.service';
import { catchErrors } from '@utils/catchError';

export const getUsersController = catchErrors(async (_: Request, res: Response) => {
    const users = await getUsersService();
    return res.status(200).json({
        message: 'Get all users',
        data: users,
    });
});
