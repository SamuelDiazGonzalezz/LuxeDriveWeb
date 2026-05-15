import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VehicleDetailComponent } from './pages/vehicle-detail/vehicle-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CheckoutInfoComponent } from './pages/checkout-info/checkout-info.component';
import { CheckoutPaymentComponent } from './pages/checkout-payment/checkout-payment.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { AboutComponent } from './pages/about/about.component';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';
import { ContactComponent } from './pages/contact/contact.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sobre', component: AboutComponent },
  { path: 'vehiculos', component: VehiclesComponent },
  { path: 'contacto', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'favoritos', component: FavoritesComponent, canActivate: [authGuard] },
  { path: 'vehiculos/:id', component: VehicleDetailComponent },
  { path: 'checkout/info', component: CheckoutInfoComponent, canActivate: [authGuard] },
  { path: 'checkout/pago', component: CheckoutPaymentComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
