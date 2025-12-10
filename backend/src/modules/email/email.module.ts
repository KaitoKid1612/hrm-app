import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { EmailService } from './email.service';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mailUser = configService.get<string>('MAIL_USER');
        const mailPassword = configService.get<string>('MAIL_PASSWORD');

        // Build transport config
        const transport: any = {
          host: configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
          port: configService.get<number>('MAIL_PORT', 587),
          secure: configService.get<boolean>('MAIL_SECURE', false),
        };

        // Only add auth if credentials are provided (for Mailpit, we don't need auth)
        if (mailUser && mailPassword) {
          transport.auth = {
            user: mailUser,
            pass: mailPassword,
          };
        }

        return {
          transport,
          defaults: {
            from: `"${configService.get<string>('APP_NAME', 'HRM Platform')}" <${configService.get<string>('MAIL_FROM', 'noreply@hrm-platform.com')}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter({
              // Handlebars helpers
              eq: (a: any, b: any) => a === b,
            }),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
