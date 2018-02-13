// main components
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ConversationComponent } from './main/conversation/conversation.component';
import { AssessmentsComponent } from './main/assessments/assessments.component';

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
    children: [
      { path: 'conversations', component: ConversationComponent },
      { path: 'assessments', component: AssessmentsComponent },
      { path: '', redirectTo: 'conversations', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
