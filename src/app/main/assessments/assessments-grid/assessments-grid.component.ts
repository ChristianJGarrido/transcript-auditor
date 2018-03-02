import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ViewChild,
  HostBinding,
  TemplateRef,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '../../../app.store';
import * as statsActions from '../../../shared/store/stats/stats.actions';
import { StatsModel } from '../../../shared/store/stats/stats.model';
import * as fromAssessment from '../../../shared/store/assessment/assessment.reducer';
import * as assessmentActions from '../../../shared/store/assessment/assessment.actions';
import * as fromPlaylist from '../../../shared/store/playlist/playlist.reducer';
import * as playlistActions from '../../../shared/store/playlist/playlist.actions';
import * as fromConversation from '../../../shared/store/conversation/conversation.reducer';
import * as conversationActions from '../../../shared/store/conversation/conversation.actions';

import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { PlaylistModel } from '../../../shared/store/playlist/playlist.model';
import {
  AssessmentModel,
  AssessmentQaModel,
  AssessmentPersonalityModel,
} from '../../../shared/store/assessment/assessment.model';
import { Router } from '@angular/router';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-assessments-grid',
  templateUrl: './assessments-grid.component.html',
  styleUrls: ['./assessments-grid.component.css'],
})
export class AssessmentsGridComponent implements OnInit, OnChanges {
  @HostBinding('class') class = 'col';

  @ViewChild('table') table: DatatableComponent;
  @ViewChild('checkCell') checkCell: TemplateRef<any>;
  @ViewChild('checkHeader') checkHeader: TemplateRef<any>;
  @ViewChild('dateCell') dateCell: TemplateRef<any>;
  @ViewChild('percentCell') percentCell: TemplateRef<any>;

  @Input() data: any[];
  @Input() type: string;
  @Input() dataState: fromAssessment.State | fromPlaylist.State;
  @Input() stats: StatsModel;

  selected = [];
  columns: TableColumn[] = [];
  rows = [];

  PLAYLIST = 'playlists';
  ASSESSMENT = 'assessments';

  constructor(
    private store: Store<StoreModel>,
    private router: Router,
    private utilityService: UtilityService
  ) {}

  /**
   * selects a given row based on type of grid
   * @param {any} event
   */
  selectRow(event: any): void {
    if (event.type === 'click') {
      const id = event.row.id;
      const convId = event.row.conversationId;
      const name = event.column.name;
      if (name) {
        switch (this.type) {
          case this.PLAYLIST:
            this.store.dispatch(new playlistActions.Select(id));
            break;
          case this.ASSESSMENT:
            this.store.dispatch(new playlistActions.Select(null));
            this.store.dispatch(new conversationActions.Select(convId));
            this.store.dispatch(new assessmentActions.Select(id));
            break;
        }
        this.router.navigate(['app/conversations']);
      }
    }
  }

  /**
   * selects checkbox in grid
   * @param {{string[]}} selected
   */
  onCheck({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected = [...selected];
    switch (this.type) {
      case this.PLAYLIST:
        return this.store.dispatch(
          new statsActions.SelectPlaylist(this.selected)
        );
      case this.ASSESSMENT:
        return this.store.dispatch(
          new statsActions.SelectAssessment(this.selected)
        );
    }
  }

  // returns qa score
  getQaScore(qa: AssessmentQaModel[]): number {
    return this.utilityService.calculateTotalScore(qa);
  }

  // returns qa score
  getPersonality(personality: AssessmentPersonalityModel[]): string {
    return this.utilityService.calculatePersonality(personality);
  }

  /**
   * counts and returns number of keys
   * @param {any} messages
   */
  countKeys(messages: any): number {
    return messages ? Object.keys(messages).length : 0;
  }

  /**
   * returns columns for data grid depending on type
   * @return {TableColumn[]}
   */
  setColums(): TableColumn[] {
    const check: TableColumn = {
      cellTemplate: this.checkCell,
      headerTemplate: this.checkHeader,
      maxWidth: 20,
    };
    const common: TableColumn[] = [
      { prop: 'createdBy', name: 'By', cellClass: 'font-tertiary' },
      { prop: 'lastUpdateAt', name: 'Updated', cellTemplate: this.dateCell },
    ];
    switch (this.type) {
      case this.PLAYLIST:
        return [
          check,
          { prop: 'name', name: 'Name', cellClass: 'font-tertiary' },
          ...common,
          {
            prop: 'convCount',
            name: 'IDs',
            maxWidth: 60,
          },
        ];
      case this.ASSESSMENT:
        return [
          check,
          {
            prop: 'conversationId',
            name: 'Conv ID',
            cellClass: 'font-tertiary',
          },
          ...common,
          {
            prop: 'messagesCount',
            name: 'Msgs',
            maxWidth: 70,
          },
          { prop: 'rating', name: 'Rating', maxWidth: 80 },
          {
            prop: 'personalityScore',
            name: 'Personality',
            maxWidth: 90,
            cellTemplate: this.percentCell,
          },
          {
            prop: 'qaScore',
            name: 'Score',
            maxWidth: 70,
            cellTemplate: this.percentCell,
          },
          { prop: 'note', name: 'Note', cellClass: 'font-tertiary' },
        ];
    }
  }

  // add new properties to grid
  hydrateDate(type: string, rows: any[]): any[] {
    return rows.map(row => {
      switch (type) {
        case this.PLAYLIST:
          return {
            ...row,
            convCount: row.conversationIds.length,
          };
        case this.ASSESSMENT:
          return {
            ...row,
            qaScore: this.utilityService.calculateTotalScore(row.qa),
            personalityScore: this.utilityService.calculatePersonality(
              row.personality
            ),
            messagesCount:
              (row.messages && Object.keys(row.messages).length) || 0,
          };
      }
    });
  }

  /**
   * refresh rows
   * @return {any[]}
   */
  updateRows(): any[] {
    switch (this.type) {
      case this.PLAYLIST:
        return this.data;
      case this.ASSESSMENT:
        const { playlistSelect, assesmentFilter } = this.stats;
        if (playlistSelect.length) {
          return this.data.filter(row => assesmentFilter.includes(row.id));
        } else {
          return this.data;
        }
    }
  }

  /**
   * sets checked items on load
   * @return {PlaylistModel[] | AssessmentModel[]}
   */
  setSelected(): PlaylistModel[] | AssessmentModel[] {
    switch (this.type) {
      case this.PLAYLIST:
        return this.stats.playlistSelect;
      case this.ASSESSMENT:
        return this.stats.assessmentSelect;
    }
  }

  ngOnInit(): void {
    this.columns = this.setColums();
    this.selected = this.setSelected();
  }

  ngOnChanges(): void {
    this.rows = this.hydrateDate(this.type, this.updateRows());
  }
}
