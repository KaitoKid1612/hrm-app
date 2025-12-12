export interface Resume {
  id: string;
  userId: string;
  title: string;
  summary?: string;
  skills: string[];
  experiences: WorkExperience[];
  educations: Education[];
  certifications: Certification[];
  languages: Language[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id?: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Certification {
  id?: string;
  name: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Language {
  id?: string;
  name: string;
  proficiency: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE';
}

export interface ResumeFormData {
  title: string;
  summary?: string;
  skills: string[];
  experiences: WorkExperience[];
  educations: Education[];
  certifications: Certification[];
  languages: Language[];
}
