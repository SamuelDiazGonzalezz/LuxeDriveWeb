export interface AppUser {
  id: number | string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'client';
  created_at: string;
  last_login: string | null;
}
