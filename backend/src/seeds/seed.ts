import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/entities/user.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const existingAdmin = await usersService.findByUsername('admin');
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await usersService.create({
      username: 'admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    console.log('✅ Admin user created (username: admin, password: admin123)');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  await app.close();
}

seed();
