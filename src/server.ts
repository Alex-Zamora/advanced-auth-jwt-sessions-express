import app from './app';
import { connectDB, disconnectDB } from './config/db.conf';
import { config } from './config/env.conf';

const startServer = async () => {
    await connectDB();

    const server = app.listen(config.PORT, () => {
        console.log(`🚀 Server is running on: http://localhost:${config.PORT}`);
    });

    const gracefulShutdown = async () => {
        console.log('Shutting down server...');
        server.close(async () => {
            await disconnectDB();
            process.exit(0);
        });
    };

    process.on('SIGINT', gracefulShutdown); // Ctrl+C
    process.on('SIGTERM', gracefulShutdown); // Stopping the app via kill <PID>, PM2, Docker stop, etc.
    process.on('uncaughtException', async (err) => {
        console.log('Uncaught Exception:', err);
        await gracefulShutdown();
    });
};

startServer();
