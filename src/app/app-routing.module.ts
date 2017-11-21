// main components
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';

// other components
import { LoginComponent } from './login/login.component';

// auth guard and routing
import { AfAuthGuardService } from './shared/services/af-auth-guard.service';
import { RouterModule, Routes, CanActivate } from '@angular/router';

// set routes, guard dashboard and its children
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'app',
    component: MainComponent,
    canActivate: [AfAuthGuardService],
    // children: [
    //   {
    //     path: 'dashboard',
    //     component: DashboardComponent
    //   },
    //   { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    // ]
  },
  { path: '**', redirectTo: 'app' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
