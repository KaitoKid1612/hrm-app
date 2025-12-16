import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/prisma/prisma.service';
import { EmailService } from '@/modules/email/email.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(EmailService) private emailService: EmailService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email đã được sử dụng');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Prepare user data
    const userData: any = {
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      phone: dto.phone,
      role: dto.role || Role.CANDIDATE,
    };

    // Add optional extended fields if provided
    if (dto.gender) userData.gender = dto.gender;
    if (dto.dateOfBirth) userData.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.city) userData.city = dto.city;
    if (dto.address) userData.address = dto.address;

    // Create user
    const user = await this.prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        city: true,
        address: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Generate token pair
    const { accessToken, refreshToken } = await this.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Send welcome email (async, don't wait)
    this.emailService
      .sendWelcomeEmail({
        userName: user.name || 'User',
        userEmail: user.email,
        isEmployer: user.role === Role.EMPLOYER,
        dashboardUrl: `${this.configService.get('FRONTEND_URL', 'http://localhost:5173')}/dashboard`,
      })
      .catch((error) => {
        console.error('Failed to send welcome email:', error);
      });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async login(dto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    // Update last login time
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate token pair
    const { accessToken, refreshToken } = await this.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
  }

  private async generateTokenPair(payload: JwtPayload) {
    const accessToken = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    // Calculate refresh token expiry
    const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d');
    const expiresDays = parseInt(expiresIn) || 7;
    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + expiresDays);

    // Store refresh token hash in database
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: payload.userId },
      data: {
        refreshToken: hashedRefreshToken,
        refreshTokenExpires,
      },
    });

    return { accessToken, refreshToken };
  }

  async forgotPassword(email: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists for security
      return {
        message: 'Nếu email tồn tại, link reset password đã được gửi',
      };
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = this.jwtService.sign(
      { userId: user.id, type: 'password-reset' },
      { expiresIn: '1h' },
    );

    // Send reset email
    const resetUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:5173')}/reset-password?token=${resetToken}`;

    try {
      await this.emailService.sendPasswordResetEmail({
        userName: user.name,
        userEmail: user.email,
        resetUrl,
      });
    } catch (error) {
      console.error('Failed to send reset email:', error);
      throw new UnauthorizedException('Không thể gửi email reset password');
    }

    return {
      message: 'Link reset password đã được gửi tới email của bạn',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      // Verify token
      const payload = this.jwtService.verify(token) as JwtPayload & {
        type: string;
      };

      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      // Find user
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new UnauthorizedException('User không tồn tại');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return {
        message: 'Mật khẩu đã được cập nhật thành công',
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token đã hết hạn');
      }
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new UnauthorizedException('Mật khẩu mới không được trùng với mật khẩu hiện tại');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      message: 'Mật khẩu đã được thay đổi thành công',
    };
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        avatar: true,
        bio: true,
        gender: true,
        dateOfBirth: true,
        address: true,
        city: true,
        country: true,
        linkedinUrl: true,
        portfolioUrl: true,
        githubUrl: true,
        currentJobTitle: true,
        yearsOfExperience: true,
        expectedSalary: true,
        emailVerified: true,
        twoFactorEnabled: true,
        preferredLanguage: true,
        timezone: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfile(userId: string, dto: any) {
    // Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    // Prevent updating sensitive fields
    const sensitiveFields = [
      'email',
      'password',
      'role',
      'emailVerified',
      'twoFactorEnabled',
      'isActive',
      'refreshToken',
      'refreshTokenExpires',
      'verificationToken',
      'passwordResetToken',
      'passwordResetExpires',
      'twoFactorSecret',
    ];

    const updateData: any = { ...dto };

    // Remove any sensitive fields from update data
    sensitiveFields.forEach((field) => {
      if (field in updateData) {
        delete updateData[field];
      }
    });

    // Validate dateOfBirth is not in the future
    if (updateData.dateOfBirth) {
      const birthDate = new Date(updateData.dateOfBirth);

      // Check if valid date
      if (isNaN(birthDate.getTime())) {
        throw new UnauthorizedException('Ngày sinh không hợp lệ');
      }

      if (birthDate > new Date()) {
        throw new UnauthorizedException('Ngày sinh không thể là ngày trong tương lai');
      }

      // Calculate age - must be at least 16 years old
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const actualAge =
        monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

      if (actualAge < 16) {
        throw new UnauthorizedException('Bạn phải từ 16 tuổi trở lên');
      }

      // Convert string to Date object for Prisma
      updateData.dateOfBirth = birthDate;
    }

    // Validate phone number format (if provided)
    if (updateData.phone) {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(updateData.phone)) {
        throw new UnauthorizedException('Số điện thoại không hợp lệ');
      }

      // Check if phone is already used by another user
      if (updateData.phone !== user.phone) {
        const existingPhone = await this.prisma.user.findFirst({
          where: {
            phone: updateData.phone,
            id: { not: userId },
          },
        });

        if (existingPhone) {
          throw new UnauthorizedException('Số điện thoại đã được sử dụng');
        }
      }
    }

    // If no valid fields to update, return current profile
    if (Object.keys(updateData).length === 0) {
      return this.getProfile(userId);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        avatar: true,
        bio: true,
        gender: true,
        dateOfBirth: true,
        address: true,
        city: true,
        country: true,
        linkedinUrl: true,
        portfolioUrl: true,
        githubUrl: true,
        currentJobTitle: true,
        yearsOfExperience: true,
        expectedSalary: true,
        emailVerified: true,
        twoFactorEnabled: true,
        preferredLanguage: true,
        timezone: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }) as JwtPayload;

      // Get user and validate refresh token
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          role: true,
          refreshToken: true,
          refreshTokenExpires: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User không hợp lệ');
      }

      // Check if refresh token is expired
      if (user.refreshTokenExpires && user.refreshTokenExpires < new Date()) {
        throw new UnauthorizedException('Refresh token đã hết hạn');
      }

      // Verify refresh token matches stored hash
      if (!user.refreshToken) {
        throw new UnauthorizedException('Refresh token không tồn tại');
      }

      const isValidRefreshToken = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValidRefreshToken) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      // Generate new token pair
      const tokens = await this.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return tokens;
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }

  async logout(userId: string) {
    // Clear refresh token
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
        refreshTokenExpires: null,
      },
    });

    return {
      message: 'Đăng xuất thành công',
    };
  }

  async getPreferences(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        emailNotifications: true,
        jobAlerts: true,
        applicationUpdates: true,
        messageNotifications: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    return user;
  }

  async updatePreferences(userId: string, dto: any) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailNotifications: dto.emailNotifications,
        jobAlerts: dto.jobAlerts,
        applicationUpdates: dto.applicationUpdates,
        messageNotifications: dto.messageNotifications,
      },
      select: {
        emailNotifications: true,
        jobAlerts: true,
        applicationUpdates: true,
        messageNotifications: true,
      },
    });

    return {
      message: 'Cập nhật cài đặt thành công',
      preferences: user,
    };
  }

  async deleteAccount(userId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    // Soft delete: set isActive to false
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        bannedAt: new Date(),
        banReason: 'User requested account deletion',
      },
    });

    return {
      message: 'Tài khoản đã được xóa thành công',
    };
  }
}
