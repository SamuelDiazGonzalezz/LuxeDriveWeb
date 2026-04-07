import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SelectionService } from '../../services/selection.service';
import { VehicleService } from '../../services/vehicle.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './vehicle-detail.component.html',
  styleUrl: './vehicle-detail.component.css'
})
export class VehicleDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private selectionService = inject(SelectionService);
  private authService = inject(AuthService);

  vehicle$ = this.route.paramMap.pipe(
    map(params => params.get('id') ?? ''),
    switchMap(id => this.vehicleService.getVehicleById(id))
  );

  buy(vehicleIdRedirect = '/checkout/info', vehicle: any): void {
    this.selectionService.setSelectedVehicle(vehicle);
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate([vehicleIdRedirect]);
  }
}
