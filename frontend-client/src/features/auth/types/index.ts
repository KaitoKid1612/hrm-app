export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  role?: 'EMPLOYER' | 'CANDIDATE';
  phone?: string;
  address?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  fullName?: string;
  role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';
  avatar?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
  createdAt?: string;
  company?: {
    name: string;
    logo?: string | null;
  } | null;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
