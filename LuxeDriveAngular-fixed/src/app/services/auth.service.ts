import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppUser } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly usersKey = 'luxedrive_users';
  private readonly sessionKey = 'luxedrive_current_user';

  private currentUserSubject = new BehaviorSubject<AppUser | null>(this.readSession());
  currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  async login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    const users = await this.getUsers();
    const user = users.find(item => item.email === email && item.password === password);

    if (!user) {
      return { success: false, message: 'Credenciales incorrectas' };
    }

    const updatedUser: AppUser = {
      ...user,
      last_login: new Date().toISOString()
    };

    const updatedUsers = users.map(item => item.email === email ? updatedUser : item);
    this.saveUsers(updatedUsers);
    this.saveSession(updatedUser);

    return { success: true };
  }

  async register(name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> {
    const users = await this.getUsers();
    const exists = users.some(item => item.email === email);

    if (exists) {
      return { success: false, message: 'El email ya está registrado' };
    }

    const newUser: AppUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: 'client',
      created_at: new Date().toISOString(),
      last_login: null
    };

    const updatedUsers = [...users, newUser];
    this.saveUsers(updatedUsers);
    this.saveSession(newUser);

    return { success: true };
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
    this.currentUserSubject.next(null);
  }

  private async getUsers(): Promise<AppUser[]> {
    const localUsers = localStorage.getItem(this.usersKey);
    if (localUsers) {
      return JSON.parse(localUsers) as AppUser[];
    }

    const seededUsers = await firstValueFrom(
      this.http.get<AppUser[]>('assets/data/users.json')
    );
    this.saveUsers(seededUsers);
    return seededUsers;
  }

  private saveUsers(users: AppUser[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  private saveSession(user: AppUser): void {
    localStorage.setItem(this.sessionKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private readSession(): AppUser | null {
    const session = localStorage.getItem(this.sessionKey);
    return session ? JSON.parse(session) as AppUser : null;
  }
}
