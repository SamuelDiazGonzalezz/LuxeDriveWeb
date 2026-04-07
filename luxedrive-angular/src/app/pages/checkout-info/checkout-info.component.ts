import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DecimalPipe, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SelectionService } from '../../services/selection.service';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-checkout-info',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink, DecimalPipe],
  templateUrl: './checkout-info.component.html',
  styleUrl: './checkout-info.component.css'
})
export class CheckoutInfoComponent {
  private fb = inject(FormBuilder);
  private selectionService = inject(SelectionService);
  private router = inject(Router);

  vehicle: Vehicle | null = this.selectionService.getSelectedVehicle();

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
    ciudad: ['', Validators.required],
    codigo_postal: ['', Validators.required],
    pais: ['ES', Validators.required]
  });

  constructor() {
    const savedInfo = this.selectionService.getPurchaseInfo();
    if (savedInfo) {
      this.form.patchValue(savedInfo);
    }
    if (!this.vehicle) {
      this.router.navigate(['/']);
    }
  }

  get subtotal(): number {
    return this.parsePrice(this.vehicle?.precio ?? '€0');
  }

  get iva(): number {
    return this.subtotal * 0.21;
  }

  get total(): number {
    return this.subtotal + this.iva;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.selectionService.savePurchaseInfo(this.form.getRawValue());
    this.router.navigate(['/checkout/pago']);
  }

  private parsePrice(price: string): number {
    return Number(price.replace('€', '').replace(/\./g, '').replace(',', '.')) || 0;
  }
}
