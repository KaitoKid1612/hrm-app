import { PrismaClient, ApplicationStatus, InterviewStatus } from '@prisma/client';
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

  // Clean up existing data
  console.log('🧹 Cleaning up existing data...');
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.jobInvite.deleteMany();
  await prisma.resumeSkill.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.jobSkill.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.category.deleteMany();
  console.log('✅ Cleaned up existing data');

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
            { skill: { connect: { id: skillMap.get('JavaScript')?.id } }, level: 'advanced' },
            { skill: { connect: { id: skillMap.get('TypeScript')?.id } }, level: 'advanced' },
            { skill: { connect: { id: skillMap.get('React')?.id } }, level: 'expert' },
            { skill: { connect: { id: skillMap.get('Node.js')?.id } }, level: 'advanced' },
          ].filter((s) => s.skill.connect.id),
        },
      },
    });
  }

  console.log('✅ Created candidate and resume');

  // Create more candidates
  console.log('👥 Creating more candidates...');
  const candidatesData = [
    {
      email: 'nguyenvana@example.com',
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      city: 'Hà Nội',
      bio: 'Lập trình viên với 3 năm kinh nghiệm',
      currentJobTitle: 'Full Stack Developer',
      yearsOfExperience: 3,
    },
    {
      email: 'tranthib@example.com',
      name: 'Trần Thị B',
      phone: '0976543210',
      city: 'Đà Nẵng',
      bio: 'Chuyên viên marketing với kinh nghiệm trong digital marketing',
      currentJobTitle: 'Marketing Specialist',
      yearsOfExperience: 2,
    },
    {
      email: 'lequangc@example.com',
      name: 'Lê Quang C',
      phone: '0965432109',
      city: 'Hồ Chí Minh',
      bio: 'Designer với đam mê sáng tạo',
      currentJobTitle: 'UI/UX Designer',
      yearsOfExperience: 4,
    },
    {
      email: 'phamthid@example.com',
      name: 'Phạm Thị D',
      phone: '0954321098',
      city: 'Hồ Chí Minh',
      bio: 'Nhân viên kinh doanh năng động',
      currentJobTitle: 'Sales Executive',
      yearsOfExperience: 1,
    },
    {
      email: 'hoangvane@example.com',
      name: 'Hoàng Văn E',
      phone: '0943210987',
      city: 'Hà Nội',
      bio: 'Data Analyst với kinh nghiệm phân tích dữ liệu',
      currentJobTitle: 'Data Analyst',
      yearsOfExperience: 2,
    },
  ];

  const candidates = [candidate];
  for (const candData of candidatesData) {
    const cand = await prisma.user.create({
      data: {
        email: candData.email,
        password: await hashPassword('Candidate@123'),
        name: candData.name,
        role: 'CANDIDATE',
        phone: candData.phone,
        city: candData.city,
        bio: candData.bio,
        currentJobTitle: candData.currentJobTitle,
        yearsOfExperience: candData.yearsOfExperience,
      },
    });
    candidates.push(cand);
  }
  console.log(`✅ Created ${candidates.length} candidates`);

  // Get all jobs for applications
  const allJobs = await prisma.job.findMany({
    take: 20,
  });

  // Create applications
  console.log('📝 Creating applications...');
  const applicationStatuses: ApplicationStatus[] = [
    'PENDING',
    'REVIEWING',
    'INTERVIEWED',
    'ACCEPTED',
    'REJECTED',
  ];
  let applicationCount = 0;

  for (const cand of candidates) {
    const numApplications = Math.floor(Math.random() * 5) + 1; // 1-5 applications per candidate
    const candidateJobs = allJobs.sort(() => 0.5 - Math.random()).slice(0, numApplications);

    for (const job of candidateJobs) {
      const status = applicationStatuses[Math.floor(Math.random() * applicationStatuses.length)];
      await prisma.application.create({
        data: {
          userId: cand.id,
          jobId: job.id,
          resumeId: null,
          coverLetter: `Tôi rất quan tâm đến vị trí ${job.title} tại công ty. Với kinh nghiệm của mình, tôi tin rằng tôi có thể đóng góp tích cực cho đội ngũ.`,
          status: status,
        },
      });
      applicationCount++;
    }
  }
  console.log(`✅ Created ${applicationCount} applications`);

  // Create saved jobs
  console.log('💾 Creating saved jobs...');
  let savedJobCount = 0;
  for (const cand of candidates.slice(0, 3)) {
    const numSaved = Math.floor(Math.random() * 8) + 2; // 2-10 saved jobs
    const savedJobsList = allJobs.sort(() => 0.5 - Math.random()).slice(0, numSaved);

    for (const job of savedJobsList) {
      await prisma.savedJob.create({
        data: {
          userId: cand.id,
          jobId: job.id,
        },
      });
      savedJobCount++;
    }
  }
  console.log(`✅ Created ${savedJobCount} saved jobs`);

  // Create interviews
  console.log('🗓️  Creating interviews...');
  const applications = await prisma.application.findMany({
    where: {
      status: {
        in: ['REVIEWING', 'INTERVIEWED', 'ACCEPTED'],
      },
    },
    include: {
      job: {
        include: {
          company: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    take: 15,
  });

  let interviewCount = 0;
  for (const app of applications) {
    const scheduledAt = new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000); // Within 14 days
    const interviewStatuses: InterviewStatus[] = ['SCHEDULED', 'CONFIRMED', 'COMPLETED'];
    const status = interviewStatuses[Math.floor(Math.random() * interviewStatuses.length)];

    // Get employer user ID from the job's company
    const createdBy = app.job?.company?.userId || _admin.id;

    await prisma.interview.create({
      data: {
        applicationId: app.id,
        scheduledAt: scheduledAt,
        duration: 60,
        location: 'Online - Google Meet',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        notes: 'Phỏng vấn với team leader',
        status: status,
        createdBy: createdBy,
      },
    });
    interviewCount++;
  }
  console.log(`✅ Created ${interviewCount} interviews`);

  // Create notifications
  console.log('🔔 Creating notifications...');
  let notificationCount = 0;
  for (const cand of candidates.slice(0, 4)) {
    const notificationTypes = [
      {
        title: 'Ứng tuyển thành công',
        message: 'Hồ sơ của bạn đã được gửi đến nhà tuyển dụng',
        type: 'application',
      },
      {
        title: 'Lịch phỏng vấn mới',
        message: 'Bạn có một lịch phỏng vấn mới được sắp xếp',
        type: 'interview',
      },
      {
        title: 'Công việc phù hợp',
        message: 'Có công việc mới phù hợp với hồ sơ của bạn',
        type: 'job_recommendation',
      },
    ];

    for (const notif of notificationTypes) {
      await prisma.notification.create({
        data: {
          userId: cand.id,
          title: notif.title,
          message: notif.message,
          type: notif.type,
          isRead: Math.random() > 0.5,
        },
      });
      notificationCount++;
    }
  }
  console.log(`✅ Created ${notificationCount} notifications`);

  // Create reviews
  console.log('⭐ Creating reviews...');
  let reviewCount = 0;
  const reviewTemplates = [
    {
      title: 'Môi trường làm việc tốt',
      content: 'Công ty có môi trường làm việc chuyên nghiệp, đồng nghiệp thân thiện.',
      pros: 'Lương thưởng ổn định, có chế độ đãi ngộ tốt',
      cons: 'Áp lực công việc cao vào cuối tháng',
    },
    {
      title: 'Phù hợp cho người mới',
      content: 'Công ty tốt cho người mới bắt đầu sự nghiệp, có nhiều cơ hội học hỏi.',
      pros: 'Được đào tạo bài bản, mentor nhiệt tình',
      cons: 'Lương khởi điểm chưa cao',
    },
    {
      title: 'Văn hóa công ty tuyệt vời',
      content: 'Văn hóa công ty rất tốt, nhiều hoạt động team building.',
      pros: 'Có nhiều phúc lợi, văn phòng hiện đại',
      cons: 'Yêu cầu làm việc khá cao',
    },
  ];

  for (const company of companyInstances.slice(0, 10)) {
    const numReviews = Math.floor(Math.random() * 3) + 1; // 1-3 reviews per company
    const reviewCandidates = candidates.sort(() => 0.5 - Math.random()).slice(0, numReviews);

    for (const cand of reviewCandidates) {
      const rating = Math.floor(Math.random() * 3) + 3; // 3-5 stars
      const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];

      await prisma.review.create({
        data: {
          userId: cand.id,
          companyId: company.id,
          rating: rating,
          title: template.title,
          content: template.content,
          pros: template.pros,
          cons: template.cons,
        },
      });
      reviewCount++;
    }
  }
  console.log(`✅ Created ${reviewCount} reviews`);

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Test accounts:');
  console.log('Admin: admin@hrm.com / Admin@123');
  console.log('Employers: [company-slug]@company.com / Employer@123');
  console.log('Candidate: candidate@example.com / Candidate@123');
  console.log(
    'Other candidates: nguyenvana@example.com, tranthib@example.com, etc. / Candidate@123',
  );
  console.log('\n📊 Summary:');
  console.log(`- ${categories.length} categories`);
  console.log(`- ${skills.length} skills`);
  console.log(`- ${companyInstances.length} companies`);
  console.log(`- ${jobCount} jobs`);
  console.log(`- ${candidates.length} candidates`);
  console.log(`- ${applicationCount} applications`);
  console.log(`- ${savedJobCount} saved jobs`);
  console.log(`- ${interviewCount} interviews`);
  console.log(`- ${notificationCount} notifications`);
  console.log(`- ${reviewCount} reviews`);
}

// Export main for use by seed-safe.ts
export default main;

// Auto-run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .catch((e) => {
      console.error('❌ Error seeding database:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
