export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailVerificationRequired: boolean;
}

export interface EmailSettings {
  mailHost: string;
  mailPort: number;
  mailSecure: boolean;
  mailUser: string;
  mailFrom: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  applicationAlerts: boolean;
  jobExpiryReminders: boolean;
  weeklyReports: boolean;
}

export interface SecuritySettings {
  maxLoginAttempts: number;
  sessionTimeout: number;
  passwordMinLength: number;
  requireStrongPassword: boolean;
  twoFactorEnabled: boolean;
}

export interface AllSettings {
  system: SystemSettings;
  email: EmailSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
}

export const settingsService = {
  // Get all settings
  async getSettings(): Promise<AllSettings> {
    // Since there's no backend endpoint yet, return mock data
    // In production, this would call: const response = await apiClient.get<AllSettings>('/admin/settings');
    return {
      system: {
        siteName: 'HRM Platform',
        siteDescription: 'Human Resource Management System',
        supportEmail: 'support@hrm-platform.com',
        maintenanceMode: false,
        allowRegistration: true,
        emailVerificationRequired: true,
      },
      email: {
        mailHost: 'smtp.gmail.com',
        mailPort: 587,
        mailSecure: false,
        mailUser: 'noreply@hrm-platform.com',
        mailFrom: 'noreply@hrm-platform.com',
      },
      notifications: {
        emailNotifications: true,
        applicationAlerts: true,
        jobExpiryReminders: true,
        weeklyReports: false,
      },
      security: {
        maxLoginAttempts: 5,
        sessionTimeout: 3600,
        passwordMinLength: 8,
        requireStrongPassword: true,
        twoFactorEnabled: false,
      },
    };
  },

  // Update system settings
  async updateSystemSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
    // Mock implementation - in production would call API
    // const response = await apiClient.patch<SystemSettings>('/admin/settings/system', data);
    return { ...data } as SystemSettings;
  },

  // Update email settings
  async updateEmailSettings(data: Partial<EmailSettings>): Promise<EmailSettings> {
    // Mock implementation
    return { ...data } as EmailSettings;
  },

  // Update notification settings
  async updateNotificationSettings(
    data: Partial<NotificationSettings>,
  ): Promise<NotificationSettings> {
    // Mock implementation
    return { ...data } as NotificationSettings;
  },

  // Update security settings
  async updateSecuritySettings(data: Partial<SecuritySettings>): Promise<SecuritySettings> {
    // Mock implementation
    return { ...data } as SecuritySettings;
  },

  // Test email connection
  async testEmailConnection(): Promise<{ success: boolean; message: string }> {
    // Mock implementation
    return {
      success: true,
      message: 'Email connection successful',
    };
  },

  // Clear cache
  async clearCache(): Promise<void> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
};
