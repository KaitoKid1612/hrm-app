import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

/**
 * Safe seed script that only seeds if database is empty
 * This is useful for initial deployment
 */
async function main() {
  console.log('🔍 Checking database...');

  // Check if database already has ESSENTIAL data (categories and companies)
  // We check these because users might exist from initial admin creation
  const categoryCount = await prisma.category.count();
  const companyCount = await prisma.company.count();
  const jobCount = await prisma.job.count();

  // Only skip if we have actual business data (not just users)
  if (categoryCount > 0 && companyCount > 0) {
    const userCount = await prisma.user.count();
    console.log('⚠️  Database already has data:');
    console.log(`   - ${userCount} users`);
    console.log(`   - ${categoryCount} categories`);
    console.log(`   - ${companyCount} companies`);
    console.log(`   - ${jobCount} jobs`);
    console.log('\n⏭️  Skipping seed to preserve existing data.');
    console.log('💡 To force seed, run: npm run seed:force');
    return;
  }

  console.log('✨ Database needs seeding. Running seed...\n');

  // Import and run the seed function directly
  try {
    const { default: seedMain } = await import('./seed.js');
    await seedMain();
    console.log('\n✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error running seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error in seed-safe:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
