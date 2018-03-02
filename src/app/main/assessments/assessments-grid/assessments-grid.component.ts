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
import { AssessmentModel } from '../../../shared/store/assessment/assessment.model';
import { Router } from '@angular/router';

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
  @Input() data: any[];
  @Input() type: string;
  @Input() dataState: fromAssessment.State | fromPlaylist.State;
  @Input() stats: StatsModel;

  selected = [];
  columns: TableColumn[] = [];
  rows = [];

  PLAYLIST = 'playlists';
  ASSESSMENT = 'assessments';

  constructor(private store: Store<StoreModel>, private router: Router) {}

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

  /**
   * returns columns for data grid depending on type
   * @return {TableColumn[]}
   */
  setColums(): TableColumn[] {
    const common = {
      cellTemplate: this.checkCell,
      headerTemplate: this.checkHeader,
      width: 30,
    };
    let columns = [];
    if (this.type === 'playlists') {
      columns = [
        common,
        { prop: 'createdBy', name: 'By', cellClass: 'datatable-cells' },
        { prop: 'createdAt', name: 'Created', cellClass: 'datatable-cells' },
        { prop: 'id', name: 'ID' },
      ];
    } else {
      columns = [
        common,
        { prop: 'createdBy', name: 'By', cellClass: 'datatable-cells' },
        { prop: 'createdAt', name: 'Created', cellClass: 'datatable-cells' },
        { prop: 'id', name: 'ID' },
      ];
    }
    return columns;
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
    this.rows = this.updateRows();
  }
}
