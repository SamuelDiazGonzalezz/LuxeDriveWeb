import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    IonAvatar,
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonText,
    IonTitle,
    IonToolbar
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  isSubmitting = false;
  selectedPhotoPreview: string | null = null;

  form = this.fb.group(
    {
      firstName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
      lastName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: this.fb.nonNullable.control('', [Validators.required]),
      photo: this.fb.nonNullable.control('', [Validators.required])
    },
    { validators: passwordsMatch }
  );

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      this.selectedPhotoPreview = result;
      this.form.controls.photo.setValue(result);
      this.form.controls.photo.markAsTouched();
      this.form.controls.photo.updateValueAndValidity();
    };
    reader.readAsDataURL(file);
  }

  async submit(): Promise<void> {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      const { firstName, lastName, email, password, photo } = this.form.getRawValue();
      const result = await this.authService.register(
        firstName ?? '',
        lastName ?? '',
        email ?? '',
        password ?? '',
        photo ?? null
      );

      if (!result.success) {
        this.errorMessage = result.message ?? 'No se pudo registrar el usuario';
        return;
      }

      const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '/';
      void this.router.navigateByUrl(redirectTo);
    } finally {
      this.isSubmitting = false;
    }
  }
}
