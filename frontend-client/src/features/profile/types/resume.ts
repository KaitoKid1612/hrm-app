export interface Resume {
  id: string;
  userId: string;
  categoryId?: string;
  title: string;
  objective?: string;
  experience?:
    | 'NO_EXPERIENCE'
    | 'ONE_TO_THREE_YEARS'
    | 'THREE_TO_FIVE_YEARS'
    | 'FIVE_TO_TEN_YEARS'
    | 'MORE_THAN_TEN_YEARS';
  education?: string;
  workHistory?: string;
  certifications?: string;
  projects?: string;
  address?: string;
  city?: string;
  country?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  isPublic: boolean;
  cvFileUrl?: string;
  skills?: ResumeSkill[];
  category?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ResumeSkill {
  id: string;
  skill: {
    id: string;
    name: string;
    slug: string;
  };
  level?: string;
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
  categoryId?: string;
  objective?: string;
  experience?:
    | 'NO_EXPERIENCE'
    | 'ONE_TO_THREE_YEARS'
    | 'THREE_TO_FIVE_YEARS'
    | 'FIVE_TO_TEN_YEARS'
    | 'MORE_THAN_TEN_YEARS';
  education?: string;
  workHistory?: string;
  certifications?: string;
  projects?: string;
  address?: string;
  city?: string;
  country?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  isPublic?: boolean;
  cvFileUrl?: string;
  skillIds?: string[];
}
