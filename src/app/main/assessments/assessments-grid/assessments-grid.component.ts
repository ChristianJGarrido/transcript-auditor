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

  selected = [];
  columns: TableColumn[] = [];
  rows = [];

  constructor(private store: Store<StoreModel>) {}

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected = [...selected];
  }

  /**
   * returns columns for data grid depending on type of grid
   * @return {TableColumn[]}
   */
  getColums(): TableColumn[] {
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

  ngOnInit(): void {
    this.rows = this.data;
    this.columns = this.getColums();
  }

  ngOnChanges(): void {
    // console.log(this.data)
    // this.rows = this.data;
  }
}
