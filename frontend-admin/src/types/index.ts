/**
 * Type definitions for the admin dashboard
 */

export type Role = 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
};

export type Company = {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  industry?: string;
  size?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  companyId: string;
  company?: Company;
  location?: string;
  salary?: number;
  type: string;
  level: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Application = {
  id: string;
  jobId: string;
  job?: Job;
  candidateId: string;
  candidate?: User;
  status: string;
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
};

export type Stats = {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  recentActivity: number;
};
