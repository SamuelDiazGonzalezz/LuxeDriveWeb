import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { SqliteService } from './sqlite.service';

@Injectable({ providedIn: 'root' })
export class FavoritesStorageService {
  private authService = inject(AuthService);
  private sqliteService = inject(SqliteService);
  private favoritesSubject = new BehaviorSubject<Set<string>>(new Set<string>());
  readonly favorites$ = this.favoritesSubject.asObservable();
  private activeUserId: string | null = null;
  private useLocalStorageFallback = false;

  constructor() {
    this.authService.currentUser$.subscribe((user) => {
      if (!user) {
        this.activeUserId = null;
        this.favoritesSubject.next(new Set<string>());
        return;
      }

      this.activeUserId = `${user.id}`;
      void this.refreshFavorites();
    });
  }

  isFavorite(vehicleId: string): boolean {
    return this.favoritesSubject.value.has(vehicleId);
  }

  async toggleFavorite(vehicleId: string): Promise<boolean> {
    const currentUserId = this.activeUserId;
    if (!currentUserId) {
      return false;
    }

    const alreadyFavorite = this.favoritesSubject.value.has(vehicleId);
    const nextFavorites = new Set(this.favoritesSubject.value);

    if (alreadyFavorite) {
      nextFavorites.delete(vehicleId);
    } else {
      nextFavorites.add(vehicleId);
    }

    this.favoritesSubject.next(nextFavorites);

    try {
      if (this.useLocalStorageFallback) {
        this.writeLocalFavorites(currentUserId, nextFavorites);
        return true;
      }

      const db = await this.withTimeout(this.sqliteService.getConnection(), 2500);

      if (alreadyFavorite) {
        await this.withTimeout(
          db.run('DELETE FROM favorites WHERE user_id = ? AND vehicle_id = ?;', [
            currentUserId,
            vehicleId
          ]),
          2500
        );
      } else {
        await this.withTimeout(
          db.run(
            'INSERT OR IGNORE INTO favorites (user_id, vehicle_id, created_at) VALUES (?, ?, ?);',
            [currentUserId, vehicleId, new Date().toISOString()]
          ),
          2500
        );
      }

      await this.withTimeout(this.sqliteService.persist(), 2500);
      await this.refreshFavorites();
      return true;
    } catch {
      this.useLocalStorageFallback = true;
      this.writeLocalFavorites(currentUserId, nextFavorites);
      this.favoritesSubject.next(new Set(nextFavorites));
      return true;
    }
  }

  private async refreshFavorites(): Promise<void> {
    const currentUserId = this.activeUserId;
    if (!currentUserId) {
      this.favoritesSubject.next(new Set<string>());
      return;
    }

    if (this.useLocalStorageFallback) {
      this.favoritesSubject.next(this.readLocalFavorites(currentUserId));
      return;
    }

    try {
      const db = await this.withTimeout(this.sqliteService.getConnection(), 2500);
      const result = await this.withTimeout(
        db.query('SELECT vehicle_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC;', [
          currentUserId
        ]),
        2500
      );
      const favoriteIds = (result.values ?? [])
        .map((row) => row.vehicle_id)
        .filter((value): value is string => typeof value === 'string');

      this.favoritesSubject.next(new Set(favoriteIds));
    } catch {
      this.useLocalStorageFallback = true;
      this.favoritesSubject.next(this.readLocalFavorites(currentUserId));
    }
  }

  private readLocalFavorites(userId: string): Set<string> {
    try {
      const raw = localStorage.getItem(this.buildStorageKey(userId));
      const parsed = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(parsed)) {
        return new Set<string>();
      }

      return new Set(parsed.filter((value): value is string => typeof value === 'string'));
    } catch {
      return new Set<string>();
    }
  }

  private writeLocalFavorites(userId: string, favorites: Set<string>): void {
    localStorage.setItem(this.buildStorageKey(userId), JSON.stringify([...favorites]));
  }

  private buildStorageKey(userId: string): string {
    return `luxedrive:favorites:${userId}`;
  }

  private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = window.setTimeout(() => reject(new Error('timeout')), timeoutMs);

      promise
        .then((value) => {
          window.clearTimeout(timeoutId);
          resolve(value);
        })
        .catch((error) => {
          window.clearTimeout(timeoutId);
          reject(error);
        });
    });
  }
}
