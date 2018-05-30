import { Injectable } from '@angular/core';
import {
  ConversationChatModel,
  ConversationMessageModel,
  ConversationModel,
} from '../store/conversation/conversation.model';

import * as _ from 'lodash';
import { AssessmentModel } from '../store/assessment/assessment.model';

@Injectable()
export class MessagesService {
  constructor() {}

  // sort chat events
  getChatEvents(conversationChat: ConversationChatModel): any[] {
    // proceed only if we have data
    if (!conversationChat || !conversationChat.transcript.lines) {
      return [];
    }
    return conversationChat.transcript.lines.map(item => {
      const mcs = conversationChat.lineScores.find(
        score => score.lineSeq === item.lineSeq
      );
      return {
        ...item,
        eventKey: 'MESSAGE',
        mcs: mcs ? mcs.mcs : null,
        mcsRawScore: mcs ? mcs.lineRawScore : null,
      };
    });
  }

  // sort conversation message events
  getMessageEvents(conversationMessage: ConversationMessageModel): any[] {
    // proceed only if we have data
    if (!conversationMessage || !conversationMessage.messageRecords) {
      return [];
    }
    // combine all events
    const events = [
      ...conversationMessage.messageRecords.map(item => {
        const mcs = conversationMessage.messageScores.find(
          score => score.messageId === item.messageId
        );
        return {
          ...item,
          eventKey: 'MESSAGE',
          mcs:  mcs ? mcs.mcs : null,
          mcsRawScore: mcs ? mcs.messageRawScore : null,
        };
      }),
      ...conversationMessage.agentParticipants.map(item => ({
        ...item,
        eventKey: 'PARTICIPANT',
      })),
      ...conversationMessage.transfers.map(item => ({
        ...item,
        eventKey: 'TRANSFER',
      })),
    ];

    return _.orderBy(events, 'timeL', 'asc');
  }

  // update message events according to type
  getEvents(conversationSelect: any): any[] {
    const { isChat } = conversationSelect;
    return isChat
      ? this.getChatEvents(conversationSelect)
      : this.getMessageEvents(conversationSelect);
  }

  // retrieve message note
  getMessageNote(id: string, assessmentSelect: AssessmentModel): string {
    const msgs = assessmentSelect.messages;
    if (msgs && msgs[id] && msgs[id].note) {
      return msgs[id].note;
    }
    return;
  }

  // the message id prop
  getMessageIdProp(isChat: boolean): string {
    return isChat ? 'lineSeq' : 'messageId';
  }

  // the agent id prop
  getAgentIdProp(isChat: boolean): string {
    return isChat ? 'agentId' : 'participantId';
  }

  // retrieve message text
  getMessageText(isChat: boolean, message: any): string {
    return isChat
      ? message.text
      : message.messageData &&
          message.messageData.msg &&
          message.messageData.msg.text;
  }

  // who sent the message
  getSource(isChat: boolean, message: any): string {
    const param = isChat ? 'source' : 'sentBy';
    const sentBy = message[param].toLowerCase();
    switch (sentBy) {
      case 'visitor':
      case 'consumer':
        return 'consumer';
      default:
        return sentBy;
    }
  }

  // returns the user participant type (human, bot, system)
  getUserType(id: string, conversation: any): string {
    const participant = conversation.agentParticipants.find(agent => agent.agentId === id);
    return participant ? participant.userTypeName : '';
  }

  // returns the mcs score
  getMcs(id: string, isChat: boolean, conversation: any): number {
    const mcsScores = isChat
      ? conversation.lineScores
      : conversation.messageScores;
    const prop = isChat ? 'lineSeq' : 'messageId';
    const score = mcsScores.find(item => item[prop] === id);
    if (score) {
      return score.mcs;
    }
    return null;
  }

}
