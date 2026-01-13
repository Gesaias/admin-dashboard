import { Role } from '@prisma/client';
import { prisma } from './client.js';
import bcrypt from 'bcrypt';

export async function userSeed() {
  const adminEmail = 'admin@admin.com';
  const adminPassword = 'admin';

  console.log('   👤 Seeding admin user...');

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('   ⚠️  Admin user already exists. Skipping...');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      username: 'admin',
      name: 'Administrator',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`   ✅ Admin user created: ${admin.email}`);
}
