import { requireEnvVar } from '@utils/requireEnvVar';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ override: true });

/**
 * @remarks
 * - JWT_PRIVATE_KEY and JWT_PUBLIC_KEY values in .env should come from a secret manager for production environments
 * - Default values are provided for development purposes only
 */
export const config = {
    BASE_PATH: process.env.BASE_PATH || '/api/v1',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CORS_ORIGINS: process.env.CORS_ORIGINS || 'http://localhost:3000',
    PORT: process.env.PORT || 8000,
    BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
    MONGO_URI: requireEnvVar('MONGO_URI'),
    // Expiry format: 'm' = minutes, 'h' = hours, 'd' = days
    JWT_ACCESS_EXPIRES_IN: requireEnvVar('JWT_ACCESS_EXPIRES_IN'), // '15m'
    JWT_REFRESH_EXPIRES_IN: requireEnvVar('JWT_REFRESH_EXPIRES_IN'), // '10d'
    JWT_REFRESH_PRIVATE_KEY: requireEnvVar('JWT_REFRESH_PRIVATE_KEY'),
    JWT_REFRESH_PUBLIC_KEY: requireEnvVar('JWT_REFRESH_PUBLIC_KEY'),
    JWT_ACCESS_PRIVATE_KEY: requireEnvVar('JWT_ACCESS_PRIVATE_KEY'),
    JWT_ACCESS_PUBLIC_KEY: requireEnvVar('JWT_ACCESS_PUBLIC_KEY'),
};

if (config.NODE_ENV === 'development') {
    console.log('🔧 Environment loaded:', {
        PORT: config.PORT,
        NODE_ENV: config.NODE_ENV,
        MONGO_URI: config.MONGO_URI ? '✅ Set' : '❌ Missing',
        CORS_ORIGINS: config.CORS_ORIGINS,
    });
}
