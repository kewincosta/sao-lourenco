import 'reflect-metadata';
import { buildApp } from './app';
import { env } from './config/env';
import { AppDataSource } from './shared/database/data-source';

async function bootstrap(): Promise<void> {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations(); // aplica o schema no boot (idempotente)

  const app = await buildApp();
  await app.listen({ port: env.PORT, host: '0.0.0.0' });

  const shutdown = async (signal: string): Promise<void> => {
    app.log.info(`Received ${signal}, shutting down...`);
    await app.close();
    await AppDataSource.destroy();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
