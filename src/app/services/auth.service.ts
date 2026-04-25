import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { AppUser } from '../models/user.model';

interface FirebaseUserDocument {
  nombre: string;
  correo: string;
  rol: 'admin' | 'client';
  creadoEn: string;
  ultimoAcceso: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  private authReadyResolver!: () => void;
  private authReady = new Promise<void>((resolve) => {
    this.authReadyResolver = resolve;
  });

  constructor() {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (!firebaseUser) {
        this.currentUserSubject.next(null);
        this.authReadyResolver();
        return;
      }

      try {
        const appUser = await this.buildAppUser(firebaseUser);
        this.currentUserSubject.next(appUser);
      } catch {
        this.currentUserSubject.next({
          id: firebaseUser.uid,
          name: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'Usuario',
          email: firebaseUser.email ?? '',
          role: 'client',
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        });
      } finally {
        this.authReadyResolver();
      }
    });
  }

  get currentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  async waitForAuthReady(): Promise<void> {
    await this.authReady;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  async login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const credentials = await signInWithEmailAndPassword(this.auth, email, password);
      const now = new Date().toISOString();
      const userRef = doc(this.firestore, 'usuarios', credentials.user.uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        await updateDoc(userRef, { ultimoAcceso: now });
      } else {
        await setDoc(userRef, {
          nombre: credentials.user.displayName ?? email.split('@')[0] ?? 'Usuario',
          correo: email,
          rol: 'client',
          creadoEn: now,
          ultimoAcceso: now
        } satisfies FirebaseUserDocument);
      }

      const appUser = await this.buildAppUser(credentials.user);
      this.currentUserSubject.next(appUser);

      return { success: true };
    } catch (error) {
      console.error('Firebase login error', error);
      return { success: false, message: this.mapFirebaseError(error) };
    }
  }

  async register(name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const credentials = await createUserWithEmailAndPassword(this.auth, email, password);
      const now = new Date().toISOString();

      try {
        await updateProfile(credentials.user, { displayName: name });
        await setDoc(doc(this.firestore, 'usuarios', credentials.user.uid), {
          nombre: name,
          correo: email,
          rol: 'client',
          creadoEn: now,
          ultimoAcceso: now
        } satisfies FirebaseUserDocument);
      } catch (error) {
        await deleteUser(credentials.user).catch(() => undefined);
        throw error;
      }

      const appUser = await this.buildAppUser(credentials.user);
      this.currentUserSubject.next(appUser);

      return { success: true };
    } catch (error) {
      console.error('Firebase register error', error);
      return { success: false, message: this.mapFirebaseError(error) };
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUserSubject.next(null);
  }

  private async buildAppUser(firebaseUser: User): Promise<AppUser> {
    const userRef = doc(this.firestore, 'usuarios', firebaseUser.uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      const data = snapshot.data() as FirebaseUserDocument;

      return {
        id: firebaseUser.uid,
        name: data.nombre,
        email: data.correo,
        role: data.rol ?? 'client',
        created_at: data.creadoEn ?? new Date().toISOString(),
        last_login: data.ultimoAcceso ?? null
      };
    }

    const fallbackUser: AppUser = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'Usuario',
      email: firebaseUser.email ?? '',
      role: 'client',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    };

    await setDoc(userRef, {
      nombre: fallbackUser.name,
      correo: fallbackUser.email,
      rol: fallbackUser.role,
      creadoEn: fallbackUser.created_at,
      ultimoAcceso: fallbackUser.last_login
    } satisfies FirebaseUserDocument);

    return fallbackUser;
  }

  private mapFirebaseError(error: unknown): string {
    const details = this.extractErrorDetails(error);
    const code = details.code;

    switch (code) {
      case 'auth/email-already-in-use':
        return 'El correo ya esta registrado.';
      case 'auth/operation-not-allowed':
        return 'Firebase Auth no tiene habilitado el acceso con correo y contrasena.';
      case 'auth/invalid-email':
        return 'El correo no es valido.';
      case 'auth/weak-password':
        return 'La contrasena debe tener al menos 6 caracteres.';
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Correo o contrasena incorrectos.';
      case 'permission-denied':
        return 'Firestore esta rechazando el acceso a la coleccion usuarios. Revisa las reglas.';
      case 'unavailable':
        return 'Firebase no esta disponible ahora mismo. Revisa la conexion y vuelve a intentarlo.';
      default:
        if (code) {
          return `Error de Firebase: ${code}`;
        }

        if (details.message) {
          return `Error de Firebase: ${details.message}`;
        }

        return 'Se produjo un error al conectar con Firebase.';
    }
  }

  private extractErrorDetails(error: unknown): { code: string; message: string } {
    if (typeof error === 'object' && error !== null) {
      const objectError = error as { code?: unknown; message?: unknown };

      return {
        code: typeof objectError.code === 'string' ? objectError.code : '',
        message: typeof objectError.message === 'string' ? objectError.message : ''
      };
    }

    return {
      code: '',
      message: typeof error === 'string' ? error : ''
    };
  }
}
