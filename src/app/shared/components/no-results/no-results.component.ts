import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.css']
})
export class NoResultsComponent implements OnInit {
  @Input() results: boolean;
  @Input() messagePrimary: string;
  @Input() messageSecondary: string;

  constructor() {}

  ngOnInit() {}
}
