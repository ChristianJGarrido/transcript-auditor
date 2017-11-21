import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// components
import { ModalComponent } from './modal/modal.component';

// interfaces
import { AfConversations, ApiData } from '../shared/interfaces/interfaces';

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
export class MainComponent implements OnInit {
  apiData$: BehaviorSubject<ApiData>;
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
   * Takes the api data and returns an array of messages
   * @param {ApiData} data data from api
   * @return {any[]}
   */
  findMessages(data: ApiData): any[] {
    if (data) {
      const conversaton = data.conversationHistoryRecords.find(record => record.info.conversationId === this.conversationId);
      if (conversaton) {
        return conversaton.messageRecords;
      }
    }
    return [];
  }

  /**
   * selects an individual conversation
   * @param {string} id
   */
  selectConversation(id: string): void {
    this.conversationId = id;
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
    this.apiData$ = this.apiDataService.apiData$;
  }
}
