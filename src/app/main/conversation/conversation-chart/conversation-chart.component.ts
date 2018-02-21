import { Component, OnInit, OnChanges, ViewChild, Input, HostBinding } from '@angular/core';
import { ConversationModel } from '../../../shared/store/conversation/conversation.model';

import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-conversation-chart',
  templateUrl: './conversation-chart.component.html',
  styleUrls: ['./conversation-chart.component.css']
})
export class ConversationChartComponent implements OnInit, OnChanges {
  @HostBinding('class') class = 'col-12';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  @Input() conversationSelect: ConversationModel;

  chartData: Chart.ChartDataSets[] = [{data: [0, 0, 0]}];
  chartLabels: string[] = ['1', '2', '3'];
  chartFont = 'MyriadPro, sans-serif';

  // setup chart.js options
  chartOptions: Chart.ChartOptions = {
    tooltips: {
      titleFontFamily: this.chartFont,
      bodyFontFamily: this.chartFont
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          display: true,
          ticks: {
            fontFamily: this.chartFont,
            min: -100,
            max: 100
          },
          scaleLabel: {
            fontFamily: this.chartFont,
            display: true,
            labelString: 'MCS'
          }
        }
      ],
      xAxes: [
        {
          scaleLabel: {
            fontFamily: this.chartFont,
            display: true,
            labelString: 'Consumer Message #'
          }
        }
      ]
    },
    legend: {
      display: false
    }
  };
  chartColors: Chart.ChartDataSets[] = [
    {
      backgroundColor: 'rgba(0, 0, 0,0.0)',
      borderColor: 'rgba(0, 60, 197,1)',
      pointBackgroundColor: 'rgba(0, 60, 197,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0, 60, 197,0.8)',
      pointRadius: 5,
      pointHitRadius: 10,
      pointHoverRadius: 10
    }
  ];
  chartLegend = true;
  chartType = 'line';

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.apiConversation) {
      const scores = this.apiConversation.messageScores;
      this.chartData = [
        { data: scores.map(score => score.mcs)}
      ];
      setTimeout(() => {
        if (this.chart && this.chart.chart && this.chart.chart.config) {
          this.chart.chart.config.data.labels = scores.map((score, index) => (index + 1).toString());
          this.chart.chart.update();
        }
      }, 100);
    }
  }

}
