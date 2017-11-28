import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// app components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { ModalComponent } from './main/modal/modal.component';
import { ConversationsComponent } from './main/conversations/conversations.component';
import { MessagesComponent } from './main/messages/messages.component';
import { FormComponent } from './main/form/form.component';
import { FormSaveComponent } from './main/form/form-save/form-save.component';
import { FormNotesComponent } from './main/form/form-notes/form-notes.component';
import { FormSelectComponent } from './main/form/form-select/form-select.component';
import { ConversationsFilterComponent } from './main/conversations/conversations-filter/conversations-filter.component';
import { NoResultsComponent } from './shared/components/no-results/no-results.component';
import { SideNavComponent } from './main/side-nav/side-nav.component';
import { ConversationStatsComponent } from './main/conversation-stats/conversation-stats.component';
import { ConversationStatsWidgetComponent } from './main/conversation-stats/conversation-stats-widget/conversation-stats-widget.component';
import { ConversationChartComponent } from './main/conversation-chart/conversation-chart.component';
import { HeaderComponent } from './main/header/header.component';
import { MessageTextComponent } from './main/messages/message-text/message-text.component';
import { MessageLinkComponent } from './main/messages/message-link/message-link.component';
import { MessageParticipantComponent } from './main/messages/message-participant/message-participant.component';
import { MessageTransferComponent } from './main/messages/message-transfer/message-transfer.component';
import { MessageInteractionComponent } from './main/messages/message-interaction/message-interaction.component';

// services
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNativeDateModule } from '@angular/material';

// angular fire
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// store
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, metaReducers } from './app.store';
import { AfLoginEffects } from './shared/store/af-login/af-login.effects';

// 3rd party
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    ModalComponent,
    ConversationsComponent,
    MessagesComponent,
    FormComponent,
    FormSaveComponent,
    FormNotesComponent,
    FormSelectComponent,
    ConversationsFilterComponent,
    NoResultsComponent,
    SideNavComponent,
    ConversationStatsComponent,
    ConversationStatsWidgetComponent,
    ConversationChartComponent,
    HeaderComponent,
    MessageTextComponent,
    MessageLinkComponent,
    MessageParticipantComponent,
    MessageTransferComponent,
    MessageInteractionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    // AngularFireDatabaseModule,
    AngularFireAuthModule,
    AppRoutingModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDatatableModule,
    MultiselectDropdownModule,
    ChartsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([AfLoginEffects])
  ],
  providers: [
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
