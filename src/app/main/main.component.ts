import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

// components
import { ModalComponent } from './modal/modal.component';

// interfaces
import { AfConversations, ApiData, ApiConversationHistoryRecord } from '../shared/interfaces/interfaces';

// material
import { MatDialog } from '@angular/material';

// services
import { AfDataService } from '../shared/services/af-data.service';
import { ApiLoginService } from '../shared/services/api-login.service';
import { ApiDataService } from '../shared/services/api-data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  // subscripitions & observables
  apiDataSub: Subscription;
  afData$: Observable<AfConversations>;

  // properties
  conversation: ApiConversationHistoryRecord;
  conversations: ApiConversationHistoryRecord[] = [];

  constructor(
    public dialog: MatDialog,
    private afDataService: AfDataService,
    private apiDataService: ApiDataService
  ) {}

  /**
   * assigns conversation property from event emission
   * @param {ApiConversationHistoryRecord} conversation
   */
  getConversation(conversation: ApiConversationHistoryRecord) {
    this.conversation = conversation;
  }

  /**
   * Opens the material dialog modal
   */
  openDialog(): void {
    this.dialog.open(ModalComponent);
  }

  ngOnInit() {
    // stream from angularFire
    this.afData$ = this.afDataService.afData$;

    // stream from api
    this.apiDataSub = this.apiDataService.apiData$.subscribe(data => {
      this.conversations = data ? data.conversationHistoryRecords : [];
    });
  }

  ngOnDestroy() {
    this.apiDataSub.unsubscribe();
  }

}
