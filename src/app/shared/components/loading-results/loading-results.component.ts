import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading-results',
  templateUrl: './loading-results.component.html',
  styleUrls: ['./loading-results.component.css']
})
export class LoadingResultsComponent implements OnInit {
  @Input() messagePrimary: string;

  constructor() { }

  ngOnInit() {
  }

}
