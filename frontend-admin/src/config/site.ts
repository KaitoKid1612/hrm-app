/**
 * Site configuration
 * Centralized configuration for the admin dashboard
 */

export const siteConfig = {
  name: 'HRM Admin Dashboard',
  description: 'Human Resource Management System - Admin Panel',
  version: '1.0.0',
  url: 'http://localhost:3001',
  links: {
    github: 'https://github.com/KaitoKid1612/hrm-app',
  },
};

export type NavItem = {
  title: string;
  href: string;
  icon?: string;
  label?: string;
  disabled?: boolean;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: '👥',
  },
  {
    title: 'Companies',
    href: '/dashboard/companies',
    icon: '🏢',
  },
  {
    title: 'Jobs',
    href: '/dashboard/jobs',
    icon: '💼',
  },
  {
    title: 'Applications',
    href: '/dashboard/applications',
    icon: '📝',
  },
  {
    title: 'Categories',
    href: '/dashboard/categories',
    icon: '🏷️',
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: '📈',
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: '⚙️',
  },
];

export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 30000,
};
