export interface ProfileFormData {
  name: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  currentJobTitle?: string;
  yearsOfExperience?: number;
  expectedSalary?: number;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
}

export interface ProfileUpdateResponse {
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';
    avatar?: string;
    phone?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    dateOfBirth?: string;
    address?: string;
    city?: string;
    country?: string;
    bio?: string;
    currentJobTitle?: string;
    yearsOfExperience?: number;
    expectedSalary?: number;
    linkedinUrl?: string;
    portfolioUrl?: string;
    githubUrl?: string;
  };
}
