export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'HR' | 'EMPLOYEE';
  avatar: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface LoginResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}
