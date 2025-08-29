import { Request, Response } from 'express';
import { loginService, refreshService, registerService } from '@services/auth.service';
import { setAuthCookies } from '@utils/cookies';
import { catchErrors } from '@utils/catchError';
import { AppError } from '@utils/AppError';

export const register = catchErrors(async (req: Request, res: Response) => {
    const { name, email, password } = req.body,
        { user, refreshToken, accessToken } = await registerService(name, email, password);

    return setAuthCookies({
        res,
        accessToken,
        refreshToken,
    })
        .status(201)
        .json({
            message: 'User registered successfully',
            data: {
                user,
            },
        });
});

export const login = catchErrors(async (req: Request, res: Response) => {
    const { email, password } = req.body,
        { user, accessToken, refreshToken } = await loginService(email, password);

    return setAuthCookies({
        res,
        accessToken,
        refreshToken,
    })
        .status(200)
        .json({
            message: 'User successfully authenticated',
            data: {
                user,
            },
        });
});

export const refreshToken = catchErrors(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken as string | undefined;

    if (!token)
        throw AppError.unauthorized({
            message: 'Unauthorized access',
            detail: 'Missing refresh token',
        });

    const { accessToken, refreshToken } = await refreshService(token, res);

    return setAuthCookies({
        res,
        accessToken,
        refreshToken,
    })
        .status(200)
        .json({ message: 'Tokens successfully updated' });
});
