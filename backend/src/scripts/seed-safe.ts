import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

/**
 * Safe seed script that only seeds if database is empty
 * This is useful for initial deployment
 */
async function main() {
  console.log('🔍 Checking database...');

  // Check if database already has data
  const userCount = await prisma.user.count();
  const categoryCount = await prisma.category.count();
  const companyCount = await prisma.company.count();

  if (userCount > 0 || categoryCount > 0 || companyCount > 0) {
    console.log('⚠️  Database already has data:');
    console.log(`   - ${userCount} users`);
    console.log(`   - ${categoryCount} categories`);
    console.log(`   - ${companyCount} companies`);
    console.log('\n⏭️  Skipping seed to preserve existing data.');
    console.log('💡 To force seed, run: npm run seed:force');
    return;
  }

  console.log('✨ Database is empty. Running seed...\n');

  // Run the regular seed script
  execSync('tsx src/scripts/seed.ts', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
}

main()
  .catch((e) => {
    console.error('❌ Error checking database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
