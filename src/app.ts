import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.router';
import userRouter from './routes/user.router';
import { errorHandler } from './middlewares/error.middleware';
import { corsOptions } from './config/cors.conf';
import { config } from '@config/env.conf';

const app = express(),
    BASE_PATH = config.BASE_PATH;

app.use(cors(corsOptions));
// This middleware read the body when the request are application/json
app.use(express.json());
// Middleware to accept cookies
app.use(cookieParser());

// Routes
app.use(`${BASE_PATH}/auth`, authRouter);
app.use(`${BASE_PATH}`, userRouter);

// Middleware for handling errors globally
app.use(errorHandler);

export default app;
