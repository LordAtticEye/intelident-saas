import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/User';
import { UserRole } from '@intelident/shared';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI no está definida en apps/backend/.env');
      process.exit(1);
    }

    console.log('🔄 Conectando a la nueva base de datos MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado exitosamente.');

    // Verificar si ya existen usuarios
    const count = await User.countDocuments();
    if (count > 0) {
      console.log(`ℹ️ La base de datos ya contiene ${count} usuarios.`);
      const proceed = process.argv.includes('--force');
      if (!proceed) {
        console.log('Usa "tsx src/utils/seed.ts --force" si deseas recrear los usuarios iniciales.');
        process.exit(0);
      }
      console.log('⚠️ Limpiando usuarios antiguos...');
      await User.deleteMany({});
    }

    console.log('🌱 Creando usuarios iniciales por rol...');

    const defaultUsers = [
      {
        firstName: 'Marco',
        lastName: 'Admin',
        email: 'admin@intelident.com',
        password: 'Password123!',
        role: UserRole.ADMIN,
        isActive: true,
        isEmailVerified: true,
      },
      {
        firstName: 'Dr. Roberto',
        lastName: 'Gómez',
        email: 'dentista@intelident.com',
        password: 'Password123!',
        role: UserRole.DENTIST,
        isActive: true,
        isEmailVerified: true,
      },
      {
        firstName: 'Laura',
        lastName: 'Martínez',
        email: 'recepcion@intelident.com',
        password: 'Password123!',
        role: UserRole.RECEPTIONIST,
        isActive: true,
        isEmailVerified: true,
      },
      {
        firstName: 'Carlos',
        lastName: 'Pérez',
        email: 'paciente@intelident.com',
        password: 'Password123!',
        role: UserRole.PATIENT,
        isActive: true,
        isEmailVerified: true,
      },
    ];

    for (const userData of defaultUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`  ✓ Creado: ${userData.email} (${userData.role}) | Pass: ${userData.password}`);
    }

    console.log('\n🎉 Base de datos poblada exitosamente con usuarios de prueba para todos los roles.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();
