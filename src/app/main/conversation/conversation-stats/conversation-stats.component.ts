import { Component, OnChanges, Input, HostBinding } from '@angular/core';
import { ConversationModel } from '../../../shared/store/conversation/conversation.model';
import { ApiConversationHistoryRecord } from '../../../shared/interfaces/conversation';
import { StatsWidget } from '../../../shared/interfaces/interfaces';
import * as _ from 'lodash';
import { ApiChatHistoryRecord } from '../../../shared/interfaces/chat';

@Component({
  selector: 'app-conversation-stats',
  templateUrl: './conversation-stats.component.html',
  styleUrls: ['./conversation-stats.component.css'],
})
export class ConversationStatsComponent implements OnChanges {
  @HostBinding('class') class = 'col-12';
  @Input() conversationSelect: any;

  metrics: StatsWidget[] = [];

  constructor() {}

  /**
   * Calculates response times between all messages
   * @return {number}
   */
  calculateResponseTimes(): number {
    if (!this.conversationSelect) {
      return 0;
    }
    let time = 0;
    this.conversationSelect.messageRecords.forEach((msg, idx, arr) => {
      time += idx > 0 ? msg.timeL - arr[idx - 1].timeL : 0;
    });
    return time / this.conversationSelect.messageRecords.length / 1000 / 3600;
  }

  /**
   * Calculate first time to response
   */
  calculateFirstResponseTime(): number {
    if (!this.conversationSelect) {
      return 0;
    }
    let sentBy: string;
    let time: number;
    for (const msg of this.conversationSelect.messageRecords) {
      if (!sentBy) {
        sentBy = msg.sentBy;
        time = msg.timeL;
      }
      if (sentBy !== msg.sentBy) {
        return (msg.timeL - time) / 1000 / 60;
      }
    }
  }

  /**
   * returns array of conversation widgets
   * @param {ApiConversationHistoryRecord} record
   */
  getConversationMetrics(record: ApiConversationHistoryRecord): StatsWidget[] {
    return record
      ? [
          { name: 'Close Reason', value: record.info.closeReason, format: 'string' },
          {
            name: 'Duration Hrs',
            value: record.info.duration / 1000 / 3600 || 0,
            format: 'number',
          },
          { name: 'Messages', value: record.messageRecords.length, format: 'number' },
          { name: 'TTFR Min', value: this.calculateFirstResponseTime(), format: 'number' },
          { name: 'ART Hrs', value: this.calculateResponseTimes(), format: 'number' },
          { name: 'MCS', value: record.info.mcs, format: 'number' },
          {
            name: 'CSAT',
            value: record.info.csatRate ? record.info.csatRate / 100 : null, format: 'number'
          },
          { name: 'Source', value: record.info.source, format: 'string' },
          { name: 'Status', value: record.info.status, format: 'string' },
          { name: 'Transfers', value: record.transfers.length, format: 'number' },
          { name: 'Participants', value: record.agentParticipants.length, format: 'number' },
          { name: 'Assignments', value: record.interactions.length, format: 'number' },
        ]
      : [];
  }

  /**
   * returns array of conversation widgets
   * @param {ApiChatHistoryRecord} record
   */
  getChatMetrics(record: ApiChatHistoryRecord): StatsWidget[] {
    return record
      ? [
          {
            name: 'Start Reason',
            value: record.info.startReasonDesc,
            format: 'string'
          },
          { name: 'End Reason', value: record.info.endReasonDesc, format: 'string' },
          {
            name: 'Duration Min',
            value: record.info.duration / 1000 / 3600 || 0,
            format: 'number'
          },
          { name: 'Messages', value: record.transcript.lines.length, format: 'number' },
          { name: 'TTFR Min', value: 0, format: 'number' },
          { name: 'ART Hrs', value: 0, format: 'number' },
          { name: 'MCS', value: record.info.mcs, format: 'number' },

          { name: 'LOB', value: record.campaign.lobName, format: 'string' },
          { name: 'Channel', value: record.info.channel, format: 'string' },
          { name: 'Agent Survey', value: record.info.isAgentSurvey, format: 'string' },
          { name: 'Agent Group', value: record.info.agentGroupName, format: 'string' },
          { name: 'Skill Name', value: record.info.skillName, format: 'string' },
        ]
      : [];
  }

  ngOnChanges() {
    const { isChat } = this.conversationSelect;
    this.metrics = isChat
      ? this.getChatMetrics(this.conversationSelect)
      : this.getConversationMetrics(this.conversationSelect);
  }
}
