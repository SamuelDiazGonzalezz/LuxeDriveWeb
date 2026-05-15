import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private contentService = inject(ContentService);

  content$ = this.contentService.content$;
  contactSent = false;

  contactForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
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
    this.contactForm.reset({
      nombre: '',
      email: '',
      telefono: '',
      mensaje: ''
    });
  }
}
