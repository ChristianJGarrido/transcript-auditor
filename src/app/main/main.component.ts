import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

// components
import { ModalComponent } from './modal/modal.component';

// interfaces
import { AfConversations, ApiData, ApiConversationHistoryRecords } from '../shared/interfaces/interfaces';

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
  apiDataSub: Subscription;
  conversations: ApiConversationHistoryRecords[] = [];
  messages: any[] = [];

  afData$: Observable<AfConversations>;
  conversationId = '';
  note = '';
  select = '1';

  constructor(
    public dialog: MatDialog,
    private afDataService: AfDataService,
    private apiDataService: ApiDataService
  ) {}

  /**
   * Opens the material dialog modal
   */
  openDialog(): void {
    this.dialog.open(ModalComponent);
  }

  /**
   * selects an individual conversation
   * @param {string} id
   */
  selectConversation(id: string): void {
    this.conversationId = id;
    const conversation = this.conversations.find(record => record.info.conversationId === this.conversationId);
    this.messages = conversation ? conversation.messageRecords : [];
  }

  /**
   * Updates the conversations note
   * @param {string} note
   */
  updateNote(note: string) {
    this.afDataService.updateConversation(this.conversationId, { note });
  }

  /**
   * Updates the conversations select
   * @param {string} select
   */
  updateSelect(select: string) {
    this.afDataService.updateConversation(this.conversationId, {select });
  }

  ngOnInit() {
    this.afData$ = this.afDataService.afData$;
    this.apiDataSub = this.apiDataService.apiData$.subscribe(data => {
      this.conversations = data ? data.conversationHistoryRecords : [];
    });
  }

  ngOnDestroy() {
    this.apiDataSub.unsubscribe();
  }

}
