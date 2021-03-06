/* tslint:disable:max-line-length */
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
import { HeaderComponent } from './main/header/header.component';

// shared
import { NoResultsComponent } from './shared/components/no-results/no-results.component';
import { MessageByComponent } from './shared/components/message-by/message-by.component';
import { CycleItemsComponent } from './shared/components/cycle-items/cycle-items.component';
import { AssessmentControlComponent } from './shared/components/assessment-control/assessment-control.component';
import { SaveNotificationComponent } from './shared/components/save-notification/save-notification.component';
import { PlaylistManagerComponent } from './shared/components/playlist-manager/playlist-manager.component';
import { LoadingResultsComponent } from './shared/components/loading-results/loading-results.component';
import { TranscriptControlComponent } from './shared/components/transcript-control/transcript-control.component';
import { NoteModalComponent } from './shared/components/note-modal/note-modal.component';

// assessments
import { AssessmentsComponent } from './main/assessments/assessments.component';
import { AssessmentsGridComponent } from './main/assessments/assessments-grid/assessments-grid.component';
import { AssessmentsStatsComponent } from './main/assessments/assessments-stats/assessments-stats.component';

// conversations
import { ConversationComponent } from './main/conversation/conversation.component';

// conversation stats
import { ConversationStatsComponent } from './main/conversation/conversation-stats/conversation-stats.component';
import { ConversationStatsWidgetComponent } from './main/conversation/conversation-stats/conversation-stats-widget/conversation-stats-widget.component';

// conversation assessment
import { ConversationAssessmentComponent } from './main/conversation/conversation-assessment/conversation-assessment.component';
import { ConversationAssessmentQaComponent } from './main/conversation/conversation-assessment/conversation-assessment-qa/conversation-assessment-qa.component';
import { ConversationAssessmentSummaryComponent } from './main/conversation/conversation-assessment/conversation-assessment-summary/conversation-assessment-summary.component';
import { ConversationAssessmentSummaryNotesComponent } from './main/conversation/conversation-assessment/conversation-assessment-summary/conversation-assessment-summary-notes/conversation-assessment-summary-notes.component';
import { ConversationAssessmentSummaryStarsComponent } from './main/conversation/conversation-assessment/conversation-assessment-summary/conversation-assessment-summary-stars/conversation-assessment-summary-stars.component';
import { ConversationAssessmentSummarySliderComponent } from './main/conversation/conversation-assessment/conversation-assessment-summary/conversation-assessment-summary-slider/conversation-assessment-summary-slider.component';
import { ConversationAssessmentControlComponent } from './main/conversation/conversation-assessment/conversation-assessment-control/conversation-assessment-control.component';

// conversation messages
import { ConversationMessagesComponent } from './main/conversation/conversation-messages/conversation-messages.component';
import { ConversationMessageTextComponent } from './main/conversation/conversation-messages/conversation-message-text/conversation-message-text.component';
import { ConversationMessageLinkComponent } from './main/conversation/conversation-messages/conversation-message-link/conversation-message-link.component';
import { ConversationMessageParticipantComponent } from './main/conversation/conversation-messages/conversation-message-participant/conversation-message-participant.component';
import { ConversationMessageTransferComponent } from './main/conversation/conversation-messages/conversation-message-transfer/conversation-message-transfer.component';
import { ConversationMessageInteractionComponent } from './main/conversation/conversation-messages/conversation-message-interaction/conversation-message-interaction.component';

import { ConversationPlaylistComponent } from './main/conversation/conversation-playlist/conversation-playlist.component';
import { ConversationsListPlaylistComponent } from './main/conversations-list/conversations-list-playlist/conversations-list-playlist.component';

// services
import { AfAuthGuardService } from './shared/services/af-auth-guard.service';
import { WatsonService } from './shared/services/watson.service';
import { FirestoreService } from './shared/services/firestore.service';
import { UtilityService } from './shared/services/utility.service';
import { NotificationService } from './shared/services/notification.service';
import { MessagesService } from './shared/services/messages.service';
import { QaService } from './shared/services/qa.service';

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
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
import { ApiLoginEffects } from './shared/store/api-login/api-login.effects';
import { AssessmentEffects } from './shared/store/assessment/assessment.effects';
import { PlaylistEffects } from './shared/store/playlist/playlist.effects';
import { ConversationEffects } from './shared/store/conversation/conversation.effects';
import { StatsEffects } from './shared/store/stats/stats.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ListEffects } from './shared/store/list/list.effects';
import { FilterEffects } from './shared/store/filter/filter.effects';
import { ExporterEffects } from './shared/store/exporter/exporter.effects';

import { SafePipe } from './shared/pipes/safe.pipe';

// 3rd party
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { StarRatingModule } from 'angular-star-rating';
import 'hammerjs';

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
    ConversationAssessmentComponent,
    ConversationAssessmentControlComponent,
    ConversationAssessmentQaComponent,
    ConversationAssessmentSummaryComponent,
    ConversationAssessmentSummaryNotesComponent,
    ConversationAssessmentSummaryStarsComponent,
    ConversationAssessmentSummarySliderComponent,
    NoResultsComponent,
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
    AssessmentsGridComponent,
    CycleItemsComponent,
    AssessmentControlComponent,
    SaveNotificationComponent,
    ConversationPlaylistComponent,
    ConversationsListPlaylistComponent,
    PlaylistManagerComponent,
    LoadingResultsComponent,
    AssessmentsStatsComponent,
    TranscriptControlComponent,
    NoteModalComponent,
    SafePipe,
  ],
  imports: [
    StarRatingModule.forRoot(),
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
    MatSliderModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDatatableModule,
    MultiselectDropdownModule,
    ChartsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([
      AssessmentEffects,
      PlaylistEffects,
      AfLoginEffects,
      ApiLoginEffects,
      ConversationEffects,
      StatsEffects,
      ListEffects,
      FilterEffects,
      ExporterEffects,
    ]),
    // StoreDevtoolsModule.instrument({
    //   maxAge: 25,
    //   logOnly: environment.production,
    // }),
  ],
  providers: [
    AfAuthGuardService,
    WatsonService,
    FirestoreService,
    UtilityService,
    NotificationService,
    MessagesService,
    QaService,
  ],
  entryComponents: [
    ModalComponent,
    ConversationAssessmentSummarySliderComponent,
    PlaylistManagerComponent,
    NoteModalComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
