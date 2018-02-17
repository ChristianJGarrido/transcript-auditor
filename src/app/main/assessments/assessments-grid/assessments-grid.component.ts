import { Component, OnInit, Input, ViewChild, HostBinding } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '../../../app.store';

import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-assessments-grid',
  templateUrl: './assessments-grid.component.html',
  styleUrls: ['./assessments-grid.component.css']
})
export class AssessmentsGridComponent implements OnInit {
  @HostBinding('class') class = 'col';
  @ViewChild('table') table: DatatableComponent;
  @Input() data: any[];
  @Input() type: string;

  selected = [];
  columns = [];
  rows = [];

  constructor(private store: Store<StoreModel>) { }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected = [...selected];
    // this.store.dispatch(new AfDataActions.SelectDocument(this.type, this.selected));
  }

  ngOnInit() {
    this.rows = this.data;
    this.columns = [
      { prop: 'createdBy', name: 'Created', cellClass: 'datatable-cells' },
      { prop: 'id', name: 'ID' },
    ];
  }

}
