import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-assessments-stats',
  templateUrl: './assessments-stats.component.html',
  styleUrls: ['./assessments-stats.component.css']
})
export class AssessmentsStatsComponent implements OnInit {
  @HostBinding('class') class = 'col';

  constructor() { }

  ngOnInit() {
  }

}
