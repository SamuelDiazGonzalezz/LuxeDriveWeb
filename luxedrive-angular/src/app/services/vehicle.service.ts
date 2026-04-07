import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private http = inject(HttpClient);

  private vehicles$ = this.http
    .get<Record<string, Omit<Vehicle, 'id'>>>('assets/data/coches.json')
    .pipe(
      map(entries => Object.entries(entries).map(([id, vehicle]) => ({ id, ...vehicle }))),
      shareReplay(1)
    );

  getVehicles(): Observable<Vehicle[]> {
    return this.vehicles$;
  }

  getVehicleById(id: string): Observable<Vehicle | null> {
    return this.vehicles$.pipe(
      map(vehicles => vehicles.find(vehicle => vehicle.id === id) ?? null)
    );
  }
}
