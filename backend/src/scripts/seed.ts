import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const prisma = new PrismaClient();

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Load JSON data
function loadJsonData(filename: string): any[] {
  const filePath = join(__dirname, 'data', filename);
  const rawData = readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}

async function main() {
  console.log('🌱 Seeding database...');

  // Load data from JSON files
  const categoriesData = loadJsonData('categories.json');
  const skillsData = loadJsonData('skills.json');
  const companiesData = loadJsonData('companies.json');
  const jobsData = loadJsonData('jobs.json');

  // Create categories
  console.log('📂 Creating categories...');
  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
      },
    });
    categories.push(category);
  }
  console.log(`✅ Created ${categories.length} categories`);

  // Create a map for easy lookup
  const categoryMap = new Map(categories.map((c) => [c.slug, c]));

  // Create skills
  console.log('🎯 Creating skills...');
  const skills = [];
  for (const skill of skillsData) {
    const createdSkill = await prisma.skill.create({
      data: {
        name: skill.name,
        slug: skill.slug,
      },
    });
    skills.push(createdSkill);
  }
  console.log(`✅ Created ${skills.length} skills`);

  // Create a map for easy lookup
  const skillMap = new Map(skills.map((s) => [s.name, s]));

  // Create admin user
  console.log('👤 Creating admin user...');
  const _admin = await prisma.user.create({
    data: {
      email: 'admin@hrm.com',
      password: await hashPassword('Admin@123'),
      name: 'Admin User',
      role: 'ADMIN',
      phone: '0123456789',
    },
  });
  console.log('✅ Created admin user');

  // Create employers and companies
  console.log('🏢 Creating companies and employers...');
  const companyInstances = [];
  for (const comp of companiesData) {
    // Create employer user for this company
    const employer = await prisma.user.create({
      data: {
        email: `${comp.slug || comp.name.toLowerCase().replace(/\s+/g, '')}@company.com`,
        password: await hashPassword('Employer@123'),
        name: `HR ${comp.name}`,
        role: 'EMPLOYER',
        phone: comp.phone,
      },
    });

    // Create company
    const company = await prisma.company.create({
      data: {
        userId: employer.id,
        name: comp.name,
        logo: comp.logo,
        description: comp.description,
        website: comp.website || null,
        email: comp.email,
        phone: comp.phone,
        address: comp.address,
        city: comp.city,
        country: comp.country,
        size: comp.size,
        isVerified: comp.isVerified,
      },
    });

    companyInstances.push({ ...company, categorySlug: comp.categorySlug });
  }
  console.log(`✅ Created ${companyInstances.length} companies`);

  // Create a company map by name for lookup
  const companyMap = new Map(companyInstances.map((c) => [c.name, c]));

  // Create jobs
  console.log('💼 Creating jobs...');
  let jobCount = 0;
  for (const job of jobsData) {
    const company = companyMap.get(job.companyName);
    const category = categoryMap.get(job.categorySlug);

    if (!company || !category) {
      console.warn(`⚠️  Skipping job "${job.title}" - company or category not found`);
      continue;
    }

    // Find skills for this job
    const jobSkills = job.skills
      .map((skillName: string) => skillMap.get(skillName))
      .filter((s: any) => s !== undefined);

    const slug = `${job.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await prisma.job.create({
      data: {
        companyId: company.id,
        categoryId: category.id,
        title: job.title,
        slug: slug,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits || '',
        jobType: job.jobType,
        jobLevel: job.jobLevel,
        salaryMin: job.salaryMin ? Math.round(job.salaryMin * 1000000) : null,
        salaryMax: job.salaryMax ? Math.round(job.salaryMax * 1000000) : null,
        positions: job.positions,
        experience: job.experience || null,
        address: company.address,
        city: company.city,
        country: company.country,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        skills: {
          create: jobSkills.map((skill: any) => ({
            skillId: skill.id,
          })),
        },
      },
    });
    jobCount++;
  }
  console.log(`✅ Created ${jobCount} jobs`);

  // Create candidate user
  console.log('👤 Creating candidate user...');
  const candidate = await prisma.user.create({
    data: {
      email: 'candidate@example.com',
      password: await hashPassword('Candidate@123'),
      name: 'Nguyễn Văn A',
      role: 'CANDIDATE',
      phone: '0999888777',
    },
  });

  // Create resume for candidate
  const itCategory = categoryMap.get('cong-nghe-thong-tin');
  if (itCategory) {
    await prisma.resume.create({
      data: {
        userId: candidate.id,
        categoryId: itCategory.id,
        title: 'Lập trình viên Full Stack',
        objective: 'Tìm kiếm vị trí Full Stack Developer để phát huy kinh nghiệm và kỹ năng',
        experience: 'THREE_TO_FIVE_YEARS',
        education: 'Đại học Bách Khoa - Khoa Công nghệ thông tin (2018-2022)',
        workHistory:
          'Lập trình viên tại Công ty ABC (2022-2024)\n- Phát triển ứng dụng web với React và Node.js\n- Tham gia dự án cho khách hàng nước ngoài',
        city: 'Hồ Chí Minh',
        country: 'Vietnam',
        gender: 'MALE',
        dateOfBirth: new Date('1999-05-15'),
        isPublic: true,
        skills: {
          create: [
            { skillId: skillMap.get('JavaScript')?.id, level: 'advanced' },
            { skillId: skillMap.get('TypeScript')?.id, level: 'advanced' },
            { skillId: skillMap.get('React')?.id, level: 'expert' },
            { skillId: skillMap.get('Node.js')?.id, level: 'advanced' },
          ].filter((s) => s.skillId),
        },
      },
    });
  }

  console.log('✅ Created candidate and resume');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Test accounts:');
  console.log('Admin: admin@hrm.com / Admin@123');
  console.log('Employers: [company-slug]@company.com / Employer@123');
  console.log('Candidate: candidate@example.com / Candidate@123');
  console.log('\n📊 Summary:');
  console.log(`- ${categories.length} categories`);
  console.log(`- ${skills.length} skills`);
  console.log(`- ${companyInstances.length} companies`);
  console.log(`- ${jobCount} jobs`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
