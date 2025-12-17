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

// Function to convert Vietnamese characters to Latin
function vietnameseToLatin(str: string): string {
  const vietnameseMap: { [key: string]: string } = {
    á: 'a',
    à: 'a',
    ả: 'a',
    ã: 'a',
    ạ: 'a',
    ă: 'a',
    ắ: 'a',
    ằ: 'a',
    ẳ: 'a',
    ẵ: 'a',
    ặ: 'a',
    â: 'a',
    ấ: 'a',
    ầ: 'a',
    ẩ: 'a',
    ẫ: 'a',
    ậ: 'a',
    é: 'e',
    è: 'e',
    ẻ: 'e',
    ẽ: 'e',
    ẹ: 'e',
    ê: 'e',
    ế: 'e',
    ề: 'e',
    ể: 'e',
    ễ: 'e',
    ệ: 'e',
    í: 'i',
    ì: 'i',
    ỉ: 'i',
    ĩ: 'i',
    ị: 'i',
    ó: 'o',
    ò: 'o',
    ỏ: 'o',
    õ: 'o',
    ọ: 'o',
    ô: 'o',
    ố: 'o',
    ồ: 'o',
    ổ: 'o',
    ỗ: 'o',
    ộ: 'o',
    ơ: 'o',
    ớ: 'o',
    ờ: 'o',
    ở: 'o',
    ỡ: 'o',
    ợ: 'o',
    ú: 'u',
    ù: 'u',
    ủ: 'u',
    ũ: 'u',
    ụ: 'u',
    ư: 'u',
    ứ: 'u',
    ừ: 'u',
    ử: 'u',
    ữ: 'u',
    ự: 'u',
    ý: 'y',
    ỳ: 'y',
    ỷ: 'y',
    ỹ: 'y',
    ỵ: 'y',
    đ: 'd',
    Á: 'A',
    À: 'A',
    Ả: 'A',
    Ã: 'A',
    Ạ: 'A',
    Ă: 'A',
    Ắ: 'A',
    Ằ: 'A',
    Ẳ: 'A',
    Ẵ: 'A',
    Ặ: 'A',
    Â: 'A',
    Ấ: 'A',
    Ầ: 'A',
    Ẩ: 'A',
    Ẫ: 'A',
    Ậ: 'A',
    É: 'E',
    È: 'E',
    Ẻ: 'E',
    Ẽ: 'E',
    Ẹ: 'E',
    Ê: 'E',
    Ế: 'E',
    Ề: 'E',
    Ể: 'E',
    Ễ: 'E',
    Ệ: 'E',
    Í: 'I',
    Ì: 'I',
    Ỉ: 'I',
    Ĩ: 'I',
    Ị: 'I',
    Ó: 'O',
    Ò: 'O',
    Ỏ: 'O',
    Õ: 'O',
    Ọ: 'O',
    Ô: 'O',
    Ố: 'O',
    Ồ: 'O',
    Ổ: 'O',
    Ỗ: 'O',
    Ộ: 'O',
    Ơ: 'O',
    Ớ: 'O',
    Ờ: 'O',
    Ở: 'O',
    Ỡ: 'O',
    Ợ: 'O',
    Ú: 'U',
    Ù: 'U',
    Ủ: 'U',
    Ũ: 'U',
    Ụ: 'U',
    Ư: 'U',
    Ứ: 'U',
    Ừ: 'U',
    Ử: 'U',
    Ữ: 'U',
    Ự: 'U',
    Ý: 'Y',
    Ỳ: 'Y',
    Ỷ: 'Y',
    Ỹ: 'Y',
    Ỵ: 'Y',
    Đ: 'D',
  };

  return str
    .split('')
    .map((char) => vietnameseMap[char] || char)
    .join('');
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
  await prisma.applicationNote.deleteMany();
  await prisma.jobAlert.deleteMany();
  await prisma.companyFollower.deleteMany();
  await prisma.jobBenefit.deleteMany();
  await prisma.benefit.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.education.deleteMany();
  await prisma.workExperience.deleteMany();
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
    const emailSlug = vietnameseToLatin(comp.slug || comp.name.toLowerCase().replace(/\s+/g, ''));
    const employer = await prisma.user.create({
      data: {
        email: `${emailSlug}@company.com`,
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

  // Create Benefits
  console.log('🎁 Creating benefits...');
  const benefitsData = [
    {
      name: 'Bảo hiểm sức khỏe',
      description: 'Bảo hiểm y tế toàn diện cho nhân viên và gia đình',
      category: 'INSURANCE',
      icon: '🏥',
    },
    {
      name: 'Thưởng hiệu suất',
      description: 'Thưởng theo KPI hàng quý và năm',
      category: 'BONUS',
      icon: '💰',
    },
    {
      name: 'Du lịch công ty',
      description: 'Chuyến du lịch hàng năm cho toàn thể nhân viên',
      category: 'TRAVEL',
      icon: '✈️',
    },
    {
      name: 'Làm việc từ xa',
      description: 'Linh hoạt làm việc từ xa 2-3 ngày/tuần',
      category: 'FLEXIBLE_WORK',
      icon: '🏠',
    },
    {
      name: 'Đào tạo nâng cao',
      description: 'Hỗ trợ chi phí khóa học và chứng chỉ chuyên môn',
      category: 'TRAINING',
      icon: '📚',
    },
    {
      name: 'Phụ cấp ăn trưa',
      description: 'Hỗ trợ ăn trưa 50k/ngày',
      category: 'MEAL',
      icon: '🍱',
    },
    {
      name: 'Phụ cấp đi lại',
      description: 'Hỗ trợ chi phí đi lại hoặc xe đưa đón',
      category: 'TRANSPORTATION',
      icon: '🚗',
    },
    {
      name: 'Nghỉ phép năm',
      description: '12-18 ngày nghỉ phép có lương/năm',
      category: 'LEAVE',
      icon: '🌴',
    },
    {
      name: 'Team building',
      description: 'Hoạt động team building hàng tháng',
      category: 'RECREATION',
      icon: '🎯',
    },
    {
      name: 'Thưởng lễ tết',
      description: 'Thưởng các dịp lễ, tết trong năm',
      category: 'BONUS',
      icon: '🎁',
    },
    {
      name: 'Laptop và thiết bị',
      description: 'Cung cấp laptop và thiết bị làm việc hiện đại',
      category: 'EQUIPMENT',
      icon: '💻',
    },
    {
      name: 'Khám sức khỏe định kỳ',
      description: 'Khám sức khỏe tổng quát hàng năm',
      category: 'INSURANCE',
      icon: '🩺',
    },
  ];

  const benefitInstances = [];
  for (const benefit of benefitsData) {
    const created = await prisma.benefit.create({
      data: {
        name: benefit.name,
        slug: benefit.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
        description: benefit.description,
        category: benefit.category,
        icon: benefit.icon,
      },
    });
    benefitInstances.push(created);
  }
  console.log(`✅ Created ${benefitInstances.length} benefits`);

  // Assign benefits to jobs
  console.log('🔗 Assigning benefits to jobs...');
  const jobsForBenefits = await prisma.job.findMany({ take: 30 });
  let jobBenefitCount = 0;
  for (const job of jobsForBenefits) {
    // Randomly assign 3-6 benefits per job
    const numBenefits = Math.floor(Math.random() * 4) + 3;
    const selectedBenefits = benefitInstances.sort(() => 0.5 - Math.random()).slice(0, numBenefits);

    for (const benefit of selectedBenefits) {
      await prisma.jobBenefit.create({
        data: {
          jobId: job.id,
          benefitId: benefit.id,
        },
      });
      jobBenefitCount++;
    }
  }
  console.log(`✅ Created ${jobBenefitCount} job-benefit associations`);

  // Create Work Experience for candidates
  console.log('💼 Creating work experiences...');
  let workExpCount = 0;
  for (const cand of candidates) {
    const numExperiences = Math.floor(Math.random() * 3) + 1; // 1-3 experiences
    const positions = [
      'Software Engineer',
      'Senior Developer',
      'Team Leader',
      'Project Manager',
      'Business Analyst',
    ];
    const companies = [
      'Công ty TNHH ABC',
      'Tập đoàn XYZ',
      'Công ty Cổ phần Tech Solutions',
      'FPT Software',
      'Viettel Solutions',
    ];

    for (let i = 0; i < numExperiences; i++) {
      const startDate = new Date(2015 + i * 3, Math.floor(Math.random() * 12), 1);
      const isCurrent = i === 0 && Math.random() > 0.5;
      const endDate = isCurrent
        ? null
        : new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000 * 2);

      await prisma.workExperience.create({
        data: {
          userId: cand.id,
          position: positions[Math.floor(Math.random() * positions.length)],
          company: companies[Math.floor(Math.random() * companies.length)],
          location: Math.random() > 0.5 ? 'Hà Nội' : 'Hồ Chí Minh',
          startDate,
          endDate,
          isCurrent,
          description:
            'Phát triển và bảo trì các ứng dụng web, mobile. Làm việc với team đa quốc gia.',
        },
      });
      workExpCount++;
    }
  }
  console.log(`✅ Created ${workExpCount} work experiences`);

  // Create Education for candidates
  console.log('🎓 Creating education records...');
  let educationCount = 0;
  const universities = [
    'Đại học Bách Khoa Hà Nội',
    'Đại học Công nghệ - ĐHQGHN',
    'Đại học FPT',
    'Đại học Khoa học Tự nhiên',
    'Đại học Kinh tế Quốc dân',
  ];
  const degrees = ['Cử nhân', 'Kỹ sư', 'Thạc sĩ'];
  const fields = [
    'Công nghệ thông tin',
    'Khoa học máy tính',
    'Kỹ thuật phần mềm',
    'Hệ thống thông tin',
    'Quản trị kinh doanh',
  ];

  for (const cand of candidates) {
    const numEducation = Math.floor(Math.random() * 2) + 1; // 1-2 education records
    for (let i = 0; i < numEducation; i++) {
      const startYear = 2014 + i * 4;
      const endYear = startYear + 4;

      await prisma.education.create({
        data: {
          userId: cand.id,
          school: universities[Math.floor(Math.random() * universities.length)],
          degree: degrees[Math.floor(Math.random() * degrees.length)],
          fieldOfStudy: fields[Math.floor(Math.random() * fields.length)],
          startDate: new Date(startYear, 8, 1),
          endDate: new Date(endYear, 6, 1),
          grade: (Math.random() * 1.5 + 2.5).toFixed(2), // GPA 2.5-4.0
          description: 'Học tập chuyên sâu về lập trình, cơ sở dữ liệu, và phát triển phần mềm',
        },
      });
      educationCount++;
    }
  }
  console.log(`✅ Created ${educationCount} education records`);

  // Create Certificates for candidates
  console.log('📜 Creating certificates...');
  let certificateCount = 0;
  const certifications = [
    {
      name: 'AWS Certified Solutions Architect',
      organization: 'Amazon Web Services',
      url: 'https://aws.amazon.com/certification/',
    },
    {
      name: 'Google Cloud Professional',
      organization: 'Google Cloud',
      url: 'https://cloud.google.com/certification',
    },
    { name: 'PMP Certification', organization: 'PMI', url: 'https://www.pmi.org/certifications' },
    {
      name: 'Scrum Master Certification',
      organization: 'Scrum Alliance',
      url: 'https://www.scrumalliance.org',
    },
    { name: 'TOEIC 850+', organization: 'ETS', url: null },
  ];

  for (const cand of candidates.slice(0, 8)) {
    const numCerts = Math.floor(Math.random() * 3) + 1; // 1-3 certificates
    const selectedCerts = certifications.sort(() => 0.5 - Math.random()).slice(0, numCerts);

    for (const cert of selectedCerts) {
      const issueDate = new Date(
        2020 + Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 12),
        1,
      );
      const hasExpiry = Math.random() > 0.5;

      await prisma.certificate.create({
        data: {
          userId: cand.id,
          name: cert.name,
          issuingOrg: cert.organization,
          issueDate,
          expirationDate: hasExpiry
            ? new Date(issueDate.getTime() + 365 * 24 * 60 * 60 * 1000 * 3)
            : null,
          credentialId: `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          credentialUrl: cert.url,
        },
      });
      certificateCount++;
    }
  }
  console.log(`✅ Created ${certificateCount} certificates`);

  // Create Company Followers
  console.log('👥 Creating company followers...');
  let followerCount = 0;
  for (const cand of candidates) {
    // Each candidate follows 2-5 companies
    const numFollows = Math.floor(Math.random() * 4) + 2;
    const companiesList = companyInstances.sort(() => 0.5 - Math.random()).slice(0, numFollows);

    for (const company of companiesList) {
      await prisma.companyFollower.create({
        data: {
          userId: cand.id,
          companyId: company.id,
        },
      });
      followerCount++;
    }
  }
  console.log(`✅ Created ${followerCount} company followers`);

  // Create Job Alerts
  console.log('🔔 Creating job alerts...');
  let jobAlertCount = 0;
  const alertCategories = categories.slice(0, 5);
  const alertKeywords = ['developer', 'senior', 'manager', 'analyst', 'designer'];

  for (const cand of candidates.slice(0, 10)) {
    const numAlerts = Math.floor(Math.random() * 2) + 1; // 1-2 alerts per candidate

    for (let i = 0; i < numAlerts; i++) {
      const category = alertCategories[Math.floor(Math.random() * alertCategories.length)];
      const keyword = alertKeywords[Math.floor(Math.random() * alertKeywords.length)];

      await prisma.jobAlert.create({
        data: {
          userId: cand.id,
          name: `${keyword} jobs in ${Math.random() > 0.5 ? 'Hà Nội' : 'Hồ Chí Minh'}`,
          keywords: keyword,
          categoryId: category.id,
          city: Math.random() > 0.5 ? 'Hà Nội' : 'Hồ Chí Minh',
          jobType: Math.random() > 0.5 ? 'FULL_TIME' : null,
          salaryMin: Math.random() > 0.5 ? 10000000 : null,
          frequency: Math.random() > 0.5 ? 'DAILY' : 'WEEKLY',
          isActive: Math.random() > 0.3,
        },
      });
      jobAlertCount++;
    }
  }
  console.log(`✅ Created ${jobAlertCount} job alerts`);

  // Create Application Notes
  console.log('📝 Creating application notes...');
  let noteCount = 0;
  const allApplications = await prisma.application.findMany({
    take: 20,
    include: { job: { include: { company: true } } },
  });

  for (const app of allApplications) {
    if (Math.random() > 0.5) {
      // 50% of applications get notes
      const numNotes = Math.floor(Math.random() * 3) + 1; // 1-3 notes
      const noteTemplates = [
        {
          content: 'Ứng viên có kinh nghiệm tốt, phù hợp với vị trí. Cần sắp xếp phỏng vấn.',
          isPrivate: false,
        },
        {
          content: 'CV ấn tượng nhưng cần xác nhận thêm về kỹ năng tiếng Anh.',
          isPrivate: true,
        },
        { content: 'Đã liên hệ qua email, chờ phản hồi.', isPrivate: false },
        {
          content: 'Ứng viên yêu cầu mức lương cao hơn budget. Cân nhắc thêm.',
          isPrivate: true,
        },
      ];

      for (let i = 0; i < numNotes; i++) {
        const template = noteTemplates[Math.floor(Math.random() * noteTemplates.length)];
        if (app.job.company) {
          await prisma.applicationNote.create({
            data: {
              applicationId: app.id,
              createdBy: app.job.company.userId,
              content: template.content,
              isPrivate: template.isPrivate,
            },
          });
          noteCount++;
        }
      }
    }
  }
  console.log(`✅ Created ${noteCount} application notes`);

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
  console.log(`- ${benefitInstances.length} benefits`);
  console.log(`- ${jobBenefitCount} job-benefit associations`);
  console.log(`- ${workExpCount} work experiences`);
  console.log(`- ${educationCount} education records`);
  console.log(`- ${certificateCount} certificates`);
  console.log(`- ${followerCount} company followers`);
  console.log(`- ${jobAlertCount} job alerts`);
  console.log(`- ${noteCount} application notes`);
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
