import { create } from 'zustand';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'operator' | 'developer' | 'admin';
  organization: string;
}

interface AuthState {
  user: MockUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const savedUser = (): MockUser | null => {
  const raw = localStorage.getItem('kivo_mock_user');
  return raw ? (JSON.parse(raw) as MockUser) : null;
};

const persist = (user: MockUser | null) => {
  if (user) {
    localStorage.setItem('kivo_mock_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('kivo_mock_user');
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser(),
  login: async (email: string, _password: string) => {
    const user: MockUser = {
      id: 'user_mock_kivo_operator',
      name: email.split('@')[0] || 'Operador Kivo',
      email,
      role: 'developer',
      organization: 'Kivo Labs',
    };
    persist(user);
    set({ user });
  },
  register: async (name: string, email: string, _password: string) => {
    const user: MockUser = {
      id: 'user_mock_kivo_operator',
      name,
      email,
      role: 'operator',
      organization: 'Kivo Labs',
    };
    persist(user);
    set({ user });
  },
  logout: () => {
    persist(null);
    set({ user: null });
  },
}));
