import {
  Component,
  OnInit,
  HostBinding,
  Input,
  OnChanges,
} from '@angular/core';
import { StatsModel } from '../../../shared/store/stats/stats.model';
import { ApiLoginModel } from '../../../shared/store/api-login/api-login.model';

@Component({
  selector: 'app-assessments-stats',
  templateUrl: './assessments-stats.component.html',
  styleUrls: ['./assessments-stats.component.css'],
})
export class AssessmentsStatsComponent implements OnInit, OnChanges {
  @HostBinding('class') class = 'col';
  @Input() apiLogin: ApiLoginModel;
  @Input() stats: StatsModel;

  metrics = [
    { key: 'reviewers', value: 0, name: 'Reviewers', format: 'number' },
    { key: 'playlists', value: 0, name: 'Playlists', format: 'number' },
    { key: 'assessments', value: 0, name: 'Assessments', format: 'number' },
    { key: 'rating', value: 0, name: 'Rating', format: 'number' },
    { key: 'personality', value: 0, name: 'Personality', format: 'percent' },
    { key: 'qaScore', value: 0, name: 'Score', format: 'percent' },
  ];

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.metrics.forEach(item => {
      item.value = this.stats.metrics[item.key];
    });
  }
}
