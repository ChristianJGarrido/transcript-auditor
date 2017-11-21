import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// app components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { ModalComponent } from './main/modal/modal.component';
import { ConversationsComponent } from './main/conversations/conversations.component';
import { MessagesComponent } from './main/messages/messages.component';
import { FormComponent } from './main/form/form.component';

// services
import { AfAuthService } from './shared/services/af-auth.service';
import { AfAuthGuardService } from './shared/services/af-auth-guard.service';
import { AfDataService } from './shared/services/af-data.service';
import { ApiDataService } from './shared/services/api-data.service';
import { ApiLoginService } from './shared/services/api-login.service';
import { ExportService } from './shared/services/export.service';

// routing
import { AppRoutingModule } from './app-routing.module';

// material
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

// 3rd party
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    ModalComponent,
    ConversationsComponent,
    MessagesComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AppRoutingModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule
  ],
  providers: [
    AfAuthService,
    AfAuthGuardService,
    AfDataService,
    ApiDataService,
    ApiLoginService,
    ExportService
  ],
  entryComponents: [ModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
