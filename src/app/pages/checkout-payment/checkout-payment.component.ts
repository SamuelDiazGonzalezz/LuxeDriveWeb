import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DecimalPipe, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SelectionService } from '../../services/selection.service';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink, DecimalPipe],
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.css'
})
export class CheckoutPaymentComponent {
  private fb = inject(FormBuilder);
  private selectionService = inject(SelectionService);
  private router = inject(Router);

  vehicle: Vehicle | null = this.selectionService.getSelectedVehicle();
  paymentCompleted = false;

  form = this.fb.nonNullable.group({
    cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9 ]{19}$/)]],
    holderName: ['', Validators.required],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]]
  });

  constructor() {
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

  formatCardNumber(): void {
    const value = this.form.controls.cardNumber.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') ?? value;
    this.form.controls.cardNumber.setValue(formatted, { emitEvent: false });
  }

  formatExpiry(): void {
    const value = this.form.controls.expiry.value.replace(/\D/g, '').slice(0, 4);
    const formatted = value.length >= 3 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
    this.form.controls.expiry.setValue(formatted, { emitEvent: false });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.paymentCompleted = true;
    this.selectionService.clearCheckout();
    setTimeout(() => this.router.navigate(['/']), 1200);
  }

  private parsePrice(price: string): number {
    return Number(price.replace('€', '').replace(/\./g, '').replace(',', '.')) || 0;
  }
}
