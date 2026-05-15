export interface AppUser {
  id: number | string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'admin' | 'client';
  photoUrl: string | null;
  created_at: string;
  last_login: string | null;
}
