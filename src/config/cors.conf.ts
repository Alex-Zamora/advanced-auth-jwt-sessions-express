import { CorsOptions } from 'cors';
import { config } from './env.conf';

const whiteList = config.CORS_ORIGINS.split(',').map((origin) => origin.trim());

/**
 * @description Configures Cross-Origin Resource Sharing (CORS)
 * @property credentials - Enables cookies and authentication headers in cross-origin requests
 * @property optionsSuccessStatus - Sets status code for successful OPTIONS preflight requests (legacy browser support)
 */
export const corsOptions: CorsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, origin?: string) => void,
    ) => {
        if (!origin || whiteList.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    //
    credentials: true,
    optionsSuccessStatus: 200,
};
