import { CookieOptions, Response } from 'express';
import { config } from '@config/env.conf';
import { calculateExpirationDate } from './date';

type AuthCookiesParams = {
    res: Response;
    accessToken: string;
    refreshToken: string;
};

const DEFAULT_CONFIG: CookieOptions = {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: config.NODE_ENV === 'production' ? 'strict' : 'lax',
    },
    REFRESH_PATH = `${config.BASE_PATH}/auth/refresh-token`;

export const getRefreshTokenOptions = (): CookieOptions => {
    const expiresIn = config.JWT_REFRESH_EXPIRES_IN,
        expires = calculateExpirationDate(expiresIn);

    return {
        ...DEFAULT_CONFIG,
        expires,
        // maxAge: 1000 * 60 * 60 * 24 * 10, // 10 days in ms
        path: REFRESH_PATH,
    };
};

export const getAccessTokenOptions = (): CookieOptions => {
    const expiresIn = config.JWT_ACCESS_EXPIRES_IN,
        expires = calculateExpirationDate(expiresIn);

    return {
        ...DEFAULT_CONFIG,
        expires,
        // maxAge: 1000 * 60 * 15, // 15 minutes in ms
        path: '/',
    };
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: AuthCookiesParams): Response =>
    res
        .cookie('accessToken', accessToken, getAccessTokenOptions())
        .cookie('refreshToken', refreshToken, getRefreshTokenOptions());

export const clearAuthCookies = (res: Response): Response =>
    res.clearCookie('accessToken').clearCookie('refreshToken', { path: REFRESH_PATH });
