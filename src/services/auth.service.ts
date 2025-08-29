import { Response } from 'express';
import type { StringValue } from 'ms';
import { config } from '@config/env.conf';
import { User } from '@models/User.model';
import Session from '@models/Session.model';
import { AppError } from '@utils/AppError';
import { signJWT, verifyJWT } from '@utils/jwt';
import { clearAuthCookies } from '@utils/cookies';

export const registerService = async (name: string, email: string, password: string) => {
    const user = await User.exists({ email });

    if (user)
        throw AppError.conflict({
            type: 'form',
            errors: { email: ['User already exists with this email'] },
        });

    const newUser = await User.create({ name, email, password }),
        userId = newUser._id.toString();

    // Validate if in register flow is good idea atenticate to the user.
    // or afeter register form, show a otp form to validate email.
    const session = await Session.create({ userId: user._id }),
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

export const loginService = async (email: string, password: string) => {
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

    const session = await Session.create({ userId: user._id });

    const userId = user._id.toString(),
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
    const { id } = await verifyJWT('refreshPublicKey', token);

    if (!id) throw AppError.unauthorized({ message: 'Invalid refresh token' });

    const user = await User.findById(id);
    if (!user) {
        clearAuthCookies(res);
        throw AppError.unauthorized({ message: 'User not found or deactivated' });
    }

    const accessToken = signJWT(
            'accessPrivateKey',
            { id },
            { expiresIn: config.JWT_ACCESS_EXPIRES_IN as StringValue },
        ),
        refreshToken = signJWT(
            'refreshPrivateKey',
            { id },
            { expiresIn: config.JWT_REFRESH_EXPIRES_IN as StringValue },
        );

    return { accessToken, refreshToken };
};
