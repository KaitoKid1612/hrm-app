import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Information Technology',
        slug: 'information-technology',
        description: 'Jobs related to IT, software development, and technology',
        icon: '💻',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Marketing',
        slug: 'marketing',
        description: 'Marketing, advertising, and PR jobs',
        icon: '📱',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Finance & Banking',
        slug: 'finance-banking',
        description: 'Finance, banking, and accounting jobs',
        icon: '💰',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Human Resources',
        slug: 'human-resources',
        description: 'HR and recruitment jobs',
        icon: '👥',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sales',
        slug: 'sales',
        description: 'Sales and business development jobs',
        icon: '💼',
      },
    }),
  ]);

  console.log('✅ Created categories');

  // Create skills
  const skills = await Promise.all([
    prisma.skill.create({ data: { name: 'JavaScript', slug: 'javascript' } }),
    prisma.skill.create({ data: { name: 'TypeScript', slug: 'typescript' } }),
    prisma.skill.create({ data: { name: 'React', slug: 'react' } }),
    prisma.skill.create({ data: { name: 'Node.js', slug: 'nodejs' } }),
    prisma.skill.create({ data: { name: 'Python', slug: 'python' } }),
    prisma.skill.create({ data: { name: 'Java', slug: 'java' } }),
    prisma.skill.create({ data: { name: 'SQL', slug: 'sql' } }),
    prisma.skill.create({ data: { name: 'MongoDB', slug: 'mongodb' } }),
    prisma.skill.create({ data: { name: 'Docker', slug: 'docker' } }),
    prisma.skill.create({ data: { name: 'AWS', slug: 'aws' } }),
  ]);

  console.log('✅ Created skills');

  // Create admin user
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

  // Create employer user
  const employer = await prisma.user.create({
    data: {
      email: 'employer@company.com',
      password: await hashPassword('Employer@123'),
      name: 'John Employer',
      role: 'EMPLOYER',
      phone: '0987654321',
    },
  });

  // Create company for employer
  const company = await prisma.company.create({
    data: {
      userId: employer.id,
      name: 'Tech Innovation Corp',
      logo: 'https://via.placeholder.com/150',
      description: 'A leading technology company specializing in innovative solutions',
      website: 'https://techinnovation.com',
      email: 'hr@techinnovation.com',
      phone: '0123456789',
      address: '123 Tech Street',
      city: 'Ho Chi Minh City',
      country: 'Vietnam',
      size: '201-500',
      isVerified: true,
    },
  });

  console.log('✅ Created employer and company');

  // Create jobs
  const _job1 = await prisma.job.create({
    data: {
      companyId: company.id,
      categoryId: categories[0].id,
      title: 'Senior Full Stack Developer',
      slug: 'senior-full-stack-developer-' + Date.now(),
      description: 'We are looking for an experienced Full Stack Developer to join our team.',
      requirements:
        '- 5+ years of experience in web development\n- Strong knowledge of React and Node.js\n- Experience with TypeScript\n- Good communication skills',
      benefits: '- Competitive salary\n- Health insurance\n- Free lunch\n- Flexible working hours',
      jobType: 'FULL_TIME',
      jobLevel: 'SENIOR',
      salaryMin: 2000,
      salaryMax: 3000,
      positions: 2,
      experience: 'FIVE_TO_TEN_YEARS',
      address: '123 Tech Street',
      city: 'Ho Chi Minh City',
      country: 'Vietnam',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      skills: {
        create: [
          { skillId: skills[0].id }, // JavaScript
          { skillId: skills[1].id }, // TypeScript
          { skillId: skills[2].id }, // React
          { skillId: skills[3].id }, // Node.js
        ],
      },
    },
  });

  const _job2 = await prisma.job.create({
    data: {
      companyId: company.id,
      categoryId: categories[0].id,
      title: 'Frontend Developer (React)',
      slug: 'frontend-developer-react-' + Date.now(),
      description: 'Join our team as a Frontend Developer working with modern technologies.',
      requirements:
        '- 2+ years of React experience\n- Knowledge of HTML, CSS, JavaScript\n- Understanding of responsive design',
      benefits: '- Attractive salary\n- Training opportunities\n- Modern office',
      jobType: 'FULL_TIME',
      jobLevel: 'JUNIOR',
      salaryMin: 800,
      salaryMax: 1500,
      positions: 3,
      experience: 'ONE_TO_THREE_YEARS',
      address: '123 Tech Street',
      city: 'Ha Noi',
      country: 'Vietnam',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      skills: {
        create: [
          { skillId: skills[0].id }, // JavaScript
          { skillId: skills[1].id }, // TypeScript
          { skillId: skills[2].id }, // React
        ],
      },
    },
  });

  console.log('✅ Created jobs');

  // Create candidate user
  const candidate = await prisma.user.create({
    data: {
      email: 'candidate@example.com',
      password: await hashPassword('Candidate@123'),
      name: 'Jane Candidate',
      role: 'CANDIDATE',
      phone: '0999888777',
    },
  });

  // Create resume for candidate
  const _resume = await prisma.resume.create({
    data: {
      userId: candidate.id,
      categoryId: categories[0].id,
      title: 'Full Stack Developer',
      objective:
        'Seeking a challenging position as a Full Stack Developer where I can utilize my skills',
      experience: 'THREE_TO_FIVE_YEARS',
      education: 'Bachelor of Computer Science - XYZ University (2018-2022)',
      workHistory:
        'Software Developer at ABC Company (2022-2024)\n- Developed web applications using React and Node.js',
      city: 'Ho Chi Minh City',
      country: 'Vietnam',
      gender: 'FEMALE',
      dateOfBirth: new Date('1999-05-15'),
      isPublic: true,
      skills: {
        create: [
          { skillId: skills[0].id, level: 'advanced' },
          { skillId: skills[1].id, level: 'advanced' },
          { skillId: skills[2].id, level: 'expert' },
          { skillId: skills[3].id, level: 'advanced' },
        ],
      },
    },
  });

  console.log('✅ Created candidate and resume');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Test accounts:');
  console.log('Admin: admin@hrm.com / Admin@123');
  console.log('Employer: employer@company.com / Employer@123');
  console.log('Candidate: candidate@example.com / Candidate@123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
