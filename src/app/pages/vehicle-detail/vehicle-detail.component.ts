import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { SelectionService } from '../../services/selection.service';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './vehicle-detail.component.html',
  styleUrl: './vehicle-detail.component.css'
})
export class VehicleDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private selectionService = inject(SelectionService);

  vehicle: Vehicle | null = null;
  loading = true;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      return;
    }

    this.vehicleService.getVehicleById(id).subscribe((vehicle) => {
      this.vehicle = vehicle;
      this.loading = false;
    });
  }

  buyNow(): void {
    if (!this.vehicle) {
      return;
    }

    this.selectionService.setSelectedVehicle(this.vehicle);
    void this.router.navigate(['/checkout/info']);
  }
}
