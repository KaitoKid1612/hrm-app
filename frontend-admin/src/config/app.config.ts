/**
 * Application configuration
 * Centralized configuration for the entire application
 */

import { API_CONFIG, AUTH_CONFIG } from '../lib/constants';

export const config = {
  // Application info
  app: {
    name: 'HRM Admin Dashboard',
    version: '1.0.0',
    description: 'Human Resource Management Admin Panel',
  },

  // API configuration
  api: API_CONFIG,

  // Authentication configuration
  auth: AUTH_CONFIG,

  // Feature flags
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
    enableDarkMode: true,
    enableExport: true,
    enableBulkActions: true,
  },

  // External services
  services: {
    sentry: {
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      enabled: process.env.NODE_ENV === 'production',
    },
    googleAnalytics: {
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      enabled: process.env.NODE_ENV === 'production',
    },
  },

  // Environment
  environment: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },
} as const;

export type Config = typeof config;
