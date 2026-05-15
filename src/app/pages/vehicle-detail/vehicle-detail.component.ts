import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { VehicleService } from '../../services/vehicle.service';
import { SelectionService } from '../../services/selection.service';
import { Vehicle } from '../../models/vehicle.model';
import { FavoritesStorageService } from '../../services/favorites-storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    IonBackButton,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonNote,
    IonSpinner,
    IonTitle,
    IonToolbar
  ],
  templateUrl: './vehicle-detail.component.html',
  styleUrl: './vehicle-detail.component.css'
})
export class VehicleDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private selectionService = inject(SelectionService);
  private favoritesStorage = inject(FavoritesStorageService);
  private authService = inject(AuthService);

  vehicle: Vehicle | null = null;
  loading = true;
  isFavorite = false;
  favoritePending = false;
  favoriteBurst = false;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      return;
    }

    this.vehicleService.getVehicleById(id).subscribe((vehicle) => {
      this.vehicle = vehicle;
      this.isFavorite = vehicle ? this.favoritesStorage.isFavorite(vehicle.id) : false;
      this.loading = false;
    });

    this.favoritesStorage.favorites$.subscribe(() => {
      this.isFavorite = !!this.vehicle && this.favoritesStorage.isFavorite(this.vehicle.id);
    });
  }

  buyNow(): void {
    if (!this.vehicle) {
      return;
    }

    this.selectionService.setSelectedVehicle(this.vehicle);
    void this.router.navigate(['/checkout/info']);
  }

  async toggleFavorite(): Promise<void> {
    if (!this.vehicle || this.favoritePending) {
      return;
    }

    if (!this.authService.isAuthenticated()) {
      await this.router.navigate(['/login'], {
        queryParams: { redirectTo: `/vehiculos/${this.vehicle.id}` }
      });
      return;
    }

    this.favoritePending = true;

    try {
      const wasFavorite = this.favoritesStorage.isFavorite(this.vehicle.id);
      await this.favoritesStorage.toggleFavorite(this.vehicle.id);
      this.isFavorite = this.favoritesStorage.isFavorite(this.vehicle.id);

      if (!wasFavorite && this.isFavorite) {
        this.favoriteBurst = true;
        window.setTimeout(() => {
          this.favoriteBurst = false;
        }, 700);
      }
    } finally {
      this.favoritePending = false;
    }
  }
}
