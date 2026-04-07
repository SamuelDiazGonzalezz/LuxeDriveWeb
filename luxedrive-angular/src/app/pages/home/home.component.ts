import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ContentService } from '../../services/content.service';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, RouterLink, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private fb = inject(FormBuilder);
  private contentService = inject(ContentService);
  private vehicleService = inject(VehicleService);

  content$ = this.contentService.content$;
  vehicles$ = this.vehicleService.getVehicles();
  contactSent = false;

  contactForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    mensaje: ['']
  });

  submitContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.contactSent = true;
    this.contactForm.reset();
  }
}
