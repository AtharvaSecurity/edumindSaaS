import { app } from './app';
import { config } from './config';
import { testDatabaseConnection, disconnectDatabase } from './config/database';

async function startServer(): Promise<void> {
  try {
    const isConnected = await testDatabaseConnection();
    if (!isConnected) { console.error('❌ Database connection failed'); process.exit(1); }

    const server = app.listen(config.port, () => {
      console.log('🚀 VidyaERP Server Started');
      console.log(`   Port: ${config.port}`);
      console.log(`   API: http://localhost:${config.port}/api/v1`);
      console.log(`   Health: http://localhost:${config.port}/health`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down...`);
      server.close(async () => { await disconnectDatabase(); process.exit(0); });
      setTimeout(() => process.exit(1), 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
