import { Injectable } from '@angular/core';
import { Vehicle } from '../models/vehicle.model';
import { PurchaseInfo } from '../models/purchase-info.model';

@Injectable({ providedIn: 'root' })
export class SelectionService {
  private readonly vehicleKey = 'luxedrive_selected_vehicle';
  private readonly infoKey = 'luxedrive_purchase_info';

  setSelectedVehicle(vehicle: Vehicle): void {
    localStorage.setItem(this.vehicleKey, JSON.stringify(vehicle));
  }

  getSelectedVehicle(): Vehicle | null {
    const raw = localStorage.getItem(this.vehicleKey);
    return raw ? JSON.parse(raw) as Vehicle : null;
  }

  savePurchaseInfo(info: PurchaseInfo): void {
    localStorage.setItem(this.infoKey, JSON.stringify(info));
  }

  getPurchaseInfo(): PurchaseInfo | null {
    const raw = localStorage.getItem(this.infoKey);
    return raw ? JSON.parse(raw) as PurchaseInfo : null;
  }

  clearCheckout(): void {
    localStorage.removeItem(this.vehicleKey);
    localStorage.removeItem(this.infoKey);
  }
}
