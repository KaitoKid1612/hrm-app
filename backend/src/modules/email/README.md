# Email Service Module

Module gửi email cho hệ thống tuyển dụng với Nodemailer và Handlebars templates.

## Setup

### 1. Environment Variables

Thêm vào file `.env`:

```env
# Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@hrm-platform.com

# App Configuration
APP_NAME=HRM Platform
SUPPORT_EMAIL=support@hrm-platform.com
```

### 2. Gmail Setup (Recommended)

Để sử dụng Gmail:

1. Bật **2-Step Verification** trong Google Account
2. Tạo **App Password** tại: https://myaccount.google.com/apppasswords
3. Sử dụng App Password làm `MAIL_PASSWORD`

### 3. Other SMTP Providers

#### SendGrid

```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASSWORD=your-sendgrid-api-key
```

#### Mailgun

```env
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USER=your-mailgun-smtp-username
MAIL_PASSWORD=your-mailgun-smtp-password
```

#### AWS SES

```env
MAIL_HOST=email-smtp.us-east-1.amazonaws.com
MAIL_PORT=587
MAIL_USER=your-ses-smtp-username
MAIL_PASSWORD=your-ses-smtp-password
```

## Email Templates

Module hỗ trợ 4 loại email templates:

### 1. Welcome Email (`welcome.hbs`)

Gửi khi user đăng ký tài khoản mới.

**Usage:**

```typescript
await emailService.sendWelcomeEmail({
  userName: 'Nguyễn Văn A',
  userEmail: 'user@example.com',
  isEmployer: false,
  dashboardUrl: 'https://hrm-platform.com/dashboard',
});
```

### 2. Application Status Update (`application-status.hbs`)

Gửi khi trạng thái đơn ứng tuyển thay đổi.

**Usage:**

```typescript
await emailService.sendApplicationStatusEmail({
  candidateName: 'Nguyễn Văn A',
  candidateEmail: 'candidate@example.com',
  jobTitle: 'Senior Backend Developer',
  companyName: 'Tech Company',
  status: ApplicationStatus.SHORTLISTED,
  appliedDate: '15/12/2024',
  applicationUrl: 'https://hrm-platform.com/applications/123',
  message: 'Chúc mừng! Bạn đã được chọn vào vòng phỏng vấn.',
});
```

### 3. New Application Notification (`new-application.hbs`)

Gửi cho employer khi có đơn ứng tuyển mới.

**Usage:**

```typescript
await emailService.sendNewApplicationEmail({
  employerName: 'HR Manager',
  employerEmail: 'hr@company.com',
  jobTitle: 'Senior Backend Developer',
  candidateName: 'Nguyễn Văn A',
  candidateEmail: 'candidate@example.com',
  candidatePhone: '0912345678',
  appliedDate: '15/12/2024',
  applicationUrl: 'https://hrm-platform.com/employer/applications/123',
  coverLetter: 'Tôi rất hứng thú với vị trí này...',
});
```

### 4. Job Alert (`job-alert.hbs`)

Gửi thông báo việc làm mới phù hợp với candidate.

**Usage:**

```typescript
await emailService.sendJobAlertEmail({
  userName: 'Nguyễn Văn A',
  userEmail: 'user@example.com',
  jobs: [
    {
      title: 'Senior Backend Developer',
      companyName: 'Tech Company',
      location: 'Hà Nội',
      type: 'Full-time',
      salary: '20-30 triệu',
      description: 'Mô tả công việc...',
      skills: ['Node.js', 'NestJS', 'PostgreSQL'],
      url: 'https://hrm-platform.com/jobs/123',
    },
  ],
  allJobsUrl: 'https://hrm-platform.com/jobs',
  unsubscribeUrl: 'https://hrm-platform.com/unsubscribe',
});
```

## Service Methods

### `sendEmail(options: SendEmailOptions)`

Generic method để gửi email tùy chỉnh.

### `sendWelcomeEmail(data: WelcomeEmailData)`

Gửi email chào mừng user mới.

### `sendApplicationStatusEmail(data: ApplicationStatusEmailData)`

Gửi email cập nhật trạng thái đơn ứng tuyển.

### `sendNewApplicationEmail(data: NewApplicationEmailData)`

Gửi email thông báo đơn ứng tuyển mới cho employer.

### `sendJobAlertEmail(data: JobAlertEmailData)`

Gửi email thông báo việc làm mới cho candidate.

### `sendBulkEmails(recipients, subject, template, context)`

Gửi email hàng loạt (newsletters, announcements).

**Features:**

- Gửi theo batch (50 emails/batch)
- Auto retry với delay 1s giữa các batch
- Trả về số lượng success/failed

## Testing

### Test Email Service

```typescript
// In your test file
import { Test } from '@nestjs/testing';
import { EmailModule } from './email.module';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [EmailModule],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
  });

  it('should send welcome email', async () => {
    const result = await emailService.sendWelcomeEmail({
      userName: 'Test User',
      userEmail: 'test@example.com',
      isEmployer: false,
      dashboardUrl: 'http://localhost:3000/dashboard',
    });

    expect(result).toBe(true);
  });
});
```

### Manual Testing

Tạo endpoint test trong controller:

```typescript
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test-welcome')
  async testWelcome(@Body() body: any) {
    return this.emailService.sendWelcomeEmail(body);
  }
}
```

## Production Considerations

### 1. Email Queue (Recommended)

Để xử lý email async, nên sử dụng Bull queue:

```bash
npm install @nestjs/bull bull
```

### 2. Email Logs

Nên lưu log email vào database:

- Email sent time
- Recipient
- Status (sent/failed)
- Error message (if failed)

### 3. Rate Limiting

Thiết lập rate limit cho:

- SMTP provider (check provider limits)
- Số email gửi per user per day
- Bulk email limits

### 4. Unsubscribe

Implement unsubscribe feature:

- Lưu preference trong database
- Check preference trước khi gửi
- Link unsubscribe trong mỗi email

### 5. Email Templates Versioning

- Lưu template versions
- A/B testing templates
- Analytics (open rate, click rate)

## Troubleshooting

### Email không gửi được

1. **Check SMTP credentials**

   ```bash
   # Test SMTP connection
   telnet smtp.gmail.com 587
   ```

2. **Check logs**

   ```bash
   # Enable debug logs
   DEBUG=nodemailer npm run start:dev
   ```

3. **Gmail blocked?**
   - Check https://myaccount.google.com/security
   - Enable "Less secure app access" (not recommended)
   - Use App Password instead

### Email vào Spam

1. **Setup SPF, DKIM, DMARC records**
2. **Use verified sender domain**
3. **Avoid spam trigger words**
4. **Test with mail-tester.com**

## Integration Examples

### Auth Module (Welcome Email)

```typescript
// auth.service.ts
async register(registerDto: RegisterDto) {
  const user = await this.usersService.create(registerDto);

  // Send welcome email
  await this.emailService.sendWelcomeEmail({
    userName: user.fullName,
    userEmail: user.email,
    isEmployer: user.role === Role.EMPLOYER,
    dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
  });

  return user;
}
```

### Applications Module (Status Update)

```typescript
// applications.service.ts
async updateStatus(id: number, updateDto: UpdateApplicationStatusDto) {
  const application = await this.prisma.application.update({
    where: { id },
    data: { status: updateDto.status },
    include: { job: { include: { company: true } }, user: true },
  });

  // Send email notification
  await this.emailService.sendApplicationStatusEmail({
    candidateName: application.user.fullName,
    candidateEmail: application.user.email,
    jobTitle: application.job.title,
    companyName: application.job.company.name,
    status: application.status,
    appliedDate: application.createdAt.toLocaleDateString('vi-VN'),
    applicationUrl: `${process.env.FRONTEND_URL}/applications/${id}`,
    message: updateDto.message,
  });

  return application;
}
```
