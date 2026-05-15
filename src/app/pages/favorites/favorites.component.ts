import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { FavoritesStorageService } from '../../services/favorites-storage.service';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    NgClass,
    RouterLink,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonTitle,
    IonToolbar
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  private vehicleService = inject(VehicleService);
  private favoritesStorage = inject(FavoritesStorageService);
  pendingFavoriteIds = new Set<string>();
  removingFavoriteIds = new Set<string>();

  vehiclesWithFavoriteState$ = combineLatest([
    this.vehicleService.getVehicles(),
    this.favoritesStorage.favorites$
  ]).pipe(
    map(([vehicles, favorites]) =>
      vehicles
        .filter((vehicle) => favorites.has(vehicle.id))
        .map((vehicle) => ({
          ...vehicle,
          isFavorite: true
        }))
    )
  );

  async toggleFavorite(vehicleId: string): Promise<void> {
    if (this.pendingFavoriteIds.has(vehicleId)) {
      return;
    }

    this.pendingFavoriteIds = new Set(this.pendingFavoriteIds).add(vehicleId);
    this.removingFavoriteIds = new Set(this.removingFavoriteIds).add(vehicleId);

    try {
      await this.favoritesStorage.toggleFavorite(vehicleId);
    } finally {
      window.setTimeout(() => {
        const nextRemoving = new Set(this.removingFavoriteIds);
        nextRemoving.delete(vehicleId);
        this.removingFavoriteIds = nextRemoving;
      }, 260);

      const nextPending = new Set(this.pendingFavoriteIds);
      nextPending.delete(vehicleId);
      this.pendingFavoriteIds = nextPending;
    }
  }
}
