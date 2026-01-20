import { prisma } from './client.js';

export async function systemConfigSeed() {
  console.log('🌱 Seeding system config...');

  const globalCode = '123456'; // Default development code

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  await prisma.systemConfig.upsert({
    where: { key: 'MASTER_RESET_CODE' },
    update: { value: globalCode },
    create: {
      key: 'MASTER_RESET_CODE',
      value: globalCode,
    },
  });

  console.log('🌱 System config seeded.');
}
