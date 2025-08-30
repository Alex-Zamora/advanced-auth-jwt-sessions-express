import { Response } from 'express';
import type { StringValue } from 'ms';
import { config } from '@config/env.conf';
import { User } from '@models/User.model';
import Session from '@models/Session.model';
import { AppError } from '@utils/AppError';
import { signJWT, verifyJWT } from '@utils/jwt';
import { calculateExpirationDate, ONE_DAY_IN_MS } from '@utils/date';
import { clearAuthCookies } from '@utils/cookies';

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    userAgent?: string;
    ipAddress?: string;
}

type LoginPayload = Omit<RegisterPayload, 'name'>;

export const registerService = async ({
    name,
    email,
    password,
    userAgent,
    ipAddress,
}: RegisterPayload) => {
    const user = await User.exists({ email });

    if (user)
        throw AppError.conflict({
            type: 'form',
            errors: { email: ['User already exists with this email'] },
        });

    const newUser = await User.create({ name, email, password }),
        userId = newUser._id.toString();

    const session = await Session.create({ userId, userAgent, ipAddress }),
        sessionId = session._id.toString();

    const accessToken = signJWT(
            'accessPrivateKey',
            { userId, sessionId },
            { expiresIn: config.JWT_ACCESS_EXPIRES_IN as StringValue },
        ),
        refreshToken = signJWT(
            'refreshPrivateKey',
            { sessionId },
            { expiresIn: config.JWT_REFRESH_EXPIRES_IN as StringValue },
        );

    return { user: newUser, accessToken, refreshToken };
};

export const loginService = async ({ email, password, userAgent, ipAddress }: LoginPayload) => {
    const user = await User.findOne({ email });

    if (!user)
        throw AppError.badRequest({
            message: 'Invalid email or password provided',
            type: 'simple',
        });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
        throw AppError.badRequest({
            message: 'Invalid email or password provided',
            type: 'simple',
        });

    const userId = user._id.toString(),
        session = await Session.create({ userId, userAgent, ipAddress }),
        sessionId = session._id.toString(),
        accessToken = signJWT(
            'accessPrivateKey',
            { userId, sessionId },
            { expiresIn: config.JWT_ACCESS_EXPIRES_IN as StringValue },
        ),
        refreshToken = signJWT(
            'refreshPrivateKey',
            { sessionId },
            { expiresIn: config.JWT_REFRESH_EXPIRES_IN as StringValue },
        );

    return { user, accessToken, refreshToken };
};

export const refreshService = async (token: string, res: Response) => {
    const { sessionId } = await verifyJWT('refreshPublicKey', token);

    if (!sessionId) throw AppError.unauthorized({ message: 'Invalid refresh token' });

    const session = await Session.findById({ _id: sessionId }),
        DATE_NOW = Date.now();

    if (!session) throw AppError.unauthorized({ message: 'Session does not exist' });

    // another option:
    // session.expiresAt <= new Date() using dates
    if (session.expiresAt.getTime() <= DATE_NOW)
        throw AppError.unauthorized({ message: 'Session expired' });

    const user = await User.findById({ _id: session.userId });
    if (!user) {
        await Session.findByIdAndDelete(session._id);
        clearAuthCookies(res);
        throw AppError.unauthorized({ message: 'User not found or deactivated' });
    }

    // another option:
    // session.expiresAt.getTime() using miliseconds
    // new Date().getTime() using miliseconds
    /**
     * const timestamp1 = Date.now();           // 1693425600000
     * const timestamp2 = new Date().getTime(); // 1693425600000
     */
    const sessionRequireRefresh = session.expiresAt.getTime() - DATE_NOW <= ONE_DAY_IN_MS;
    if (sessionRequireRefresh) {
        session.expiresAt = calculateExpirationDate(config.JWT_REFRESH_EXPIRES_IN);
        await session.save();
    }

    const newRefreshToken = sessionRequireRefresh
        ? signJWT(
              'refreshPrivateKey',
              { sessionId },
              { expiresIn: config.JWT_REFRESH_EXPIRES_IN as StringValue },
          )
        : undefined;

    const accessToken = signJWT(
        'accessPrivateKey',
        { userId: session.userId.toString(), sessionId: session._id.toString() },
        { expiresIn: config.JWT_ACCESS_EXPIRES_IN as StringValue },
    );

    return { accessToken, newRefreshToken };
};
