import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { config } from '@config/env.conf';

export type SignJWTPayload = { userId?: string; sessionId: string };

export type DecodedJWTPayload = SignJWTPayload & JwtPayload;

const JWT_KEYS = {
    accessPublicKey: config.JWT_ACCESS_PUBLIC_KEY,
    accessPrivateKey: config.JWT_ACCESS_PRIVATE_KEY,
    refreshPublicKey: config.JWT_REFRESH_PUBLIC_KEY,
    refreshPrivateKey: config.JWT_REFRESH_PRIVATE_KEY,
} as const;

// Example with Extract
/**
 * type Keys = 'a' | 'b' | 'c';
 * type OnlyAorC = Extract<Keys, 'a' | 'c'>; // 'a' | 'c'
 */

export type PrefixKey = keyof typeof JWT_KEYS;
// filter only keys that end with PrivateKey
export type PrefixPrivateKey = Extract<PrefixKey, `${string}PrivateKey`>;
// filter only keys that end with PublicKey
type PrefixPublicKey = Extract<PrefixKey, `${string}PublicKey`>;

export const signJWT = (
    prefix: PrefixPrivateKey,
    payload: SignJWTPayload,
    options: SignOptions = {},
) => jwt.sign(payload, JWT_KEYS[prefix], { algorithm: 'ES256', ...options });

export const verifyJWT = (
    prefix: PrefixPublicKey,
    token: string,
    options: VerifyOptions = {},
): Promise<DecodedJWTPayload> =>
    new Promise((resolve, reject) => {
        jwt.verify(
            token,
            JWT_KEYS[prefix],
            { algorithms: ['ES256'], ...options },
            (error, decode) => {
                if (error || !decode) return reject(error);
                resolve(decode as DecodedJWTPayload);
            },
        );
    });
