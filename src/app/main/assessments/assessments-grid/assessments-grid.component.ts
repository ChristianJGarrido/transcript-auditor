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
import * as fromPlaylist from '../../../shared/store/playlist/playlist.reducer';

import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';

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

  constructor(private store: Store<StoreModel>) {}

  // select item in grid
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected = [...selected];
    switch (this.type) {
      case 'playlists':
        this.store.dispatch(new statsActions.SelectPlaylist(this.selected));
        break;
      case 'assessments':
        this.store.dispatch(new statsActions.SelectAssessment(this.selected));
        break;
    }
  }

  /**
   * returns columns for data grid depending on type of grid
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

  // refresh rows
  updateRows() {
    switch (this.type) {
      case 'playlists':
        return this.data;
      case 'assessments':
        const { playlistSelect, assesmentFilter } = this.stats;
        if (playlistSelect.length) {
          return this.data.filter(row => assesmentFilter.includes(row.id));
        } else {
          return this.data;
        }
    }
  }

  // refresh selected
  setSelected() {
    switch (this.type) {
      case 'playlists':
        return this.stats.playlistSelect;
      case 'assessments':
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
