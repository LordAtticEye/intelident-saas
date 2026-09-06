import 'dotenv/config';
import app from './app';
import { connectDatabase } from './config/database';
// import { connectRedis } from './config/redis'; // Comentar completamente
import { logger } from './utils/logger';

const PORT = parseInt(process.env.PORT ?? '5000');

const start = async (): Promise<void> => {
  try {
    await connectDatabase();
    
    // No intentar conectar Redis
    logger.info('Redis no configurado - continuando sin Redis');
    
    const server = app.listen(PORT, () => {
      logger.info(`InteliDent API corriendo en puerto ${PORT} [${process.env.NODE_ENV}]`);
      console.log(`🎉 Servidor corriendo en http://localhost:${PORT}`);
    });

    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`Señal ${signal} recibida. Apagando servidor...`);
      server.close(async () => {
        const mongoose = await import('mongoose');
        await mongoose.default.disconnect();
        logger.info('Servidor apagado correctamente');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', (reason) => {
      logger.error('Rechazo no manejado:', reason);
      process.exit(1);
    });
  } catch (err) {
    logger.error('Error al iniciar servidor:', err);
    process.exit(1);
  }
};

start();