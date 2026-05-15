import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../services/auth.service';
import { FavoritesStorageService } from '../../services/favorites-storage.service';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent {
  private authService = inject(AuthService);
  private favoritesStorage = inject(FavoritesStorageService);
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  pendingFavoriteIds = new Set<string>();
  animatedFavoriteIds = new Set<string>();

  vehicles$ = combineLatest([
    this.vehicleService.getVehicles(),
    this.favoritesStorage.favorites$
  ]).pipe(
    map(([vehicles, favorites]) =>
      vehicles.map((vehicle) => ({
        ...vehicle,
        isFavorite: favorites.has(vehicle.id)
      }))
    )
  );

  async toggleFavorite(vehicleId: string): Promise<void> {
    if (this.pendingFavoriteIds.has(vehicleId)) {
      return;
    }

    if (!this.authService.isAuthenticated()) {
      await this.router.navigate(['/login'], {
        queryParams: { redirectTo: '/vehiculos' }
      });
      return;
    }

    this.pendingFavoriteIds = new Set(this.pendingFavoriteIds).add(vehicleId);

    try {
      const wasFavorite = this.favoritesStorage.isFavorite(vehicleId);
      await this.favoritesStorage.toggleFavorite(vehicleId);

      if (!wasFavorite) {
        this.triggerFavoriteAnimation(vehicleId);
      }
    } finally {
      const nextPending = new Set(this.pendingFavoriteIds);
      nextPending.delete(vehicleId);
      this.pendingFavoriteIds = nextPending;
    }
  }

  private triggerFavoriteAnimation(vehicleId: string): void {
    this.animatedFavoriteIds = new Set(this.animatedFavoriteIds).add(vehicleId);

    window.setTimeout(() => {
      const nextAnimated = new Set(this.animatedFavoriteIds);
      nextAnimated.delete(vehicleId);
      this.animatedFavoriteIds = nextAnimated;
    }, 700);
  }
}
