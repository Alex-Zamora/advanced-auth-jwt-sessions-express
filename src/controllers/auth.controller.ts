import { Request, Response } from 'express';
import { loginService, refreshService, registerService } from '@services/auth.service';
import { getAccessTokenOptions, getRefreshTokenOptions, setAuthCookies } from '@utils/cookies';
import { catchErrors } from '@utils/catchError';
import { AppError } from '@utils/AppError';

export const register = catchErrors(async (req: Request, res: Response) => {
    const { name, email, password } = req.body,
        body = {
            name,
            email,
            password,
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip,
        },
        { user, refreshToken, accessToken } = await registerService(body);

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
        body = {
            email,
            password,
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip,
        },
        { user, accessToken, refreshToken } = await loginService(body);

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

    const { accessToken, newRefreshToken } = await refreshService(token, res);

    if (newRefreshToken) res.cookie('refreshToken', refreshToken, getRefreshTokenOptions());

    return res.status(200).cookie('accessToken', accessToken, getAccessTokenOptions()).json({
        message: 'Refresh token successfully updated',
    });
});
