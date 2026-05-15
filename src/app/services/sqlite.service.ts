import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection
} from '@capacitor-community/sqlite';

@Injectable({ providedIn: 'root' })
export class SqliteService {
  private readonly databaseName = 'luxedrive';
  private readonly databaseVersion = 1;
  private readonly sqlite = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private initializationPromise: Promise<SQLiteDBConnection> | null = null;

  async getConnection(): Promise<SQLiteDBConnection> {
    if (!this.initializationPromise) {
      this.initializationPromise = this.initialize();
    }

    return this.initializationPromise;
  }

  async persist(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.saveToStore(this.databaseName);
    }
  }

  private async initialize(): Promise<SQLiteDBConnection> {
    if (Capacitor.getPlatform() === 'web') {
      await customElements.whenDefined('jeep-sqlite');
      await this.sqlite.initWebStore();
    }

    try {
      await this.sqlite.checkConnectionsConsistency();
    } catch {
      // The plugin can throw during the first web bootstrap before any connection exists.
    }

    const hasConnection = await this.sqlite.isConnection(this.databaseName, false);

    this.db = hasConnection.result
      ? await this.sqlite.retrieveConnection(this.databaseName, false)
      : await this.sqlite.createConnection(
          this.databaseName,
          false,
          'no-encryption',
          this.databaseVersion,
          false
        );

    const isOpen = await this.db.isDBOpen();
    if (!isOpen.result) {
      await this.db.open();
    }

    await this.db.execute(
      `CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        vehicle_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        UNIQUE(user_id, vehicle_id)
      );`
    );

    await this.persist();

    return this.db;
  }
}
