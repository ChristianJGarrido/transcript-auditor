import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// app components
import { AppComponent } from './app.component';
import { NavComponent } from './main/nav/nav.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { ModalComponent } from './main/modal/modal.component';
import { ConversationsListComponent } from './main/conversations-list/conversations-list.component';
import { ConversationsListFilterComponent } from './main/conversations-list/conversations-list-filter/conversations-list-filter.component';
import { NoResultsComponent } from './shared/components/no-results/no-results.component';
import { SideNavComponent } from './main/side-nav/side-nav.component';
import { HeaderComponent } from './main/header/header.component';
import { AssessmentsComponent } from './main/assessments/assessments.component';
import { MessageByComponent } from './shared/components/message-by/message-by.component';

import { ConversationComponent } from './main/conversation/conversation.component';
import { ConversationQaComponent } from './main/conversation/conversation-qa/conversation-qa.component';
import { ConversationStatsComponent } from './main/conversation/conversation-stats/conversation-stats.component';
import {
  ConversationStatsWidgetComponent
} from './main/conversation/conversation-stats/conversation-stats-widget/conversation-stats-widget.component';
import { ConversationChartComponent } from './main/conversation/conversation-chart/conversation-chart.component';
import { ConversationSummaryComponent } from './main/conversation/conversation-summary/conversation-summary.component';
import {
  ConversationSummarySaveComponent
} from './main/conversation/conversation-summary/conversation-summary-save/conversation-summary-save.component';
import {
  ConversationSummaryNotesComponent
} from './main/conversation/conversation-summary/conversation-summary-notes/conversation-summary-notes.component';
import {
  ConversationSummarySelectComponent
} from './main/conversation/conversation-summary/conversation-summary-select/conversation-summary-select.component';
import { ConversationMessagesComponent } from './main/conversation/conversation-messages/conversation-messages.component';
import {
  ConversationMessageTextComponent
} from './main/conversation/conversation-messages/conversation-message-text/conversation-message-text.component';
import {
  ConversationMessageLinkComponent
} from './main/conversation/conversation-messages/conversation-message-link/conversation-message-link.component';
import {
  ConversationMessageParticipantComponent
} from './main/conversation/conversation-messages/conversation-message-participant/conversation-message-participant.component';
import {
  ConversationMessageTransferComponent
} from './main/conversation/conversation-messages/conversation-message-transfer/conversation-message-transfer.component';
import {
  ConversationMessageInteractionComponent
} from './main/conversation/conversation-messages/conversation-message-interaction/conversation-message-interaction.component';

// services
import { AfAuthGuardService } from './shared/services/af-auth-guard.service';
import { AfDataService } from './shared/services/af-data.service';
import { ApiDataService } from './shared/services/api-data.service';
import { ApiLoginService } from './shared/services/api-login.service';
import { ExportService } from './shared/services/export.service';
import { WatsonService } from './shared/services/watson.service';

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
    ConversationsListComponent,
    ConversationsListFilterComponent,
    ConversationComponent,
    ConversationStatsComponent,
    ConversationStatsWidgetComponent,
    ConversationChartComponent,
    ConversationSummaryComponent,
    ConversationSummarySaveComponent,
    ConversationSummaryNotesComponent,
    ConversationSummarySelectComponent,
    NoResultsComponent,
    SideNavComponent,
    HeaderComponent,
    ConversationMessagesComponent,
    ConversationMessageTextComponent,
    ConversationMessageLinkComponent,
    ConversationMessageParticipantComponent,
    ConversationMessageTransferComponent,
    ConversationMessageInteractionComponent,
    MessageByComponent,
    NavComponent,
    AssessmentsComponent,
    ConversationQaComponent,
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
    EffectsModule.forRoot([AfLoginEffects]),
  ],
  providers: [
    AfAuthGuardService,
    AfDataService,
    ApiDataService,
    ApiLoginService,
    ExportService,
    WatsonService,
  ],
  entryComponents: [ModalComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
