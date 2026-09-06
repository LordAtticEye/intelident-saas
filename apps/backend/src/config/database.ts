import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI!;
    await mongoose.connect(uri, {
      maxPoolSize:      10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS:  45000,
    });
    logger.info('MongoDB conectado exitosamente');
  } catch (error) {
    logger.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    logger.error('Error de MongoDB:', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB desconectado. Reintentando...');
  });
};