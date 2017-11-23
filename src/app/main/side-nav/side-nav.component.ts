import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { AfUser } from '../../shared/interfaces/interfaces';
import { ApiDataService } from '../../shared/services/api-data.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ExportService } from '../../shared/services/export.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit, OnChanges {
  @Input() afData: AfUser;

  afKeys: string[] = [];
  apiLoading$: BehaviorSubject<boolean>;

  constructor(private apiDataService: ApiDataService, private exportService: ExportService) { }

  /**
   * trigger download of all note data
   */
  downloadCsv() {
    this.exportService.downloadNotes(this.afData);
  }

  /**
   * selects previous note and downloads and displays associated conversation
   * @param {string} id
   */
  selectNote(id: string) {
    this.apiDataService.getConversation(id);
  }

  ngOnInit() {
    this.apiLoading$ = this.apiDataService.apiLoading$;
  }

  ngOnChanges() {
    // when firebase data updates, get new keys
    if (this.afData && this.afData.conversations) {
      this.afKeys = Object.keys(this.afData.conversations);
    }
  }

}
