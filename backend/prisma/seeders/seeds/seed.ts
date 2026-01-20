import { prisma, pool } from './client.js';
import { userSeed } from './user.seed.js';
import { systemConfigSeed } from './system-config.seed.js';

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    await userSeed();
    await systemConfigSeed();

    console.log('🌱 Seeding process finished successfully.');
  } catch (error) {
    console.error('❌ Error during seeding process:', error);
    process.exit(1);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main().finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
