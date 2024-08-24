import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './components/booking/booking.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { HotelDetailComponent } from './components/hotel-detail/hotel-detail.component';
import { HotelListComponent } from './components/hotel-list/hotel-list.component';
import { AuthGuard } from './middleware/AuthGuard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { UserProfileComponent } from './components/auth/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', component: HotelListComponent },
  {
    path: 'hotel/:id',
    component: HotelDetailComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: 'booking', component: BookingComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: '**', redirectTo: '/hotels' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
