import {
  Component,
  OnInit,
  Output,
  Input,
  OnChanges,
} from '@angular/core';
import { UtilityService } from '../../../shared/services/utility.service';
import * as fromConversation from '../../../shared/store/conversation/conversation.reducer';
import * as fromPlaylist from '../../../shared/store/playlist/playlist.reducer';
import { AssessmentModel } from '../../../shared/store/assessment/assessment.model';

import { PlaylistModel } from '../../../shared/store/playlist/playlist.model';
import {
  ConversationChatModel,
  ConversationMessageModel,
  ConversationModel,
} from '../../../shared/store/conversation/conversation.model';
import { MessagesService } from '../../../shared/services/messages.service';

@Component({
  selector: 'app-conversation-messages',
  templateUrl: './conversation-messages.component.html',
  styleUrls: ['./conversation-messages.component.css'],
})
export class ConversationMessagesComponent implements OnInit, OnChanges {
  @Input() conversationState: fromConversation.State;
  @Input() conversationSelect: any;
  @Input() assessmentSelect: AssessmentModel;
  @Input() playlistSelect: PlaylistModel;
  @Input() playlistState: fromPlaylist.State;
  @Input() playlists: PlaylistModel[];

  currentId: string = null;
  messageEvents = [];
  hoverConId = false;
  hoverId = false;

  constructor(
    private utilityService: UtilityService,
    private messagesService: MessagesService,
  ) {}

  // returns conversation ids
  get ids(): any[] {
    if (this.conversationState.playlistIds.length) {
      return this.conversationState.playlistIds;
    }
    return this.conversationState.ids;
  }

  // get conversation index
  get index(): number {
    return this.utilityService.findIndex(
      this.conversationSelect.id,
      this.ids
    );
  }

  // get conversation type
  get type(): string {
    return this.conversationSelect.isChat ? 'Chat' : 'Conversation';
  }

  // get conversation id
  get id(): string {
    const { isChat } = this.conversationSelect;
    const param = isChat ? 'engagementId' : 'conversationId';
    return this.conversationSelect.info[param];
  }

  // get consumer id
  get conId(): string {
    const { isChat } = this.conversationSelect;
    return isChat
      ? this.conversationSelect.info.visitorId
      : this.conversationSelect.consumerParticipants[0].participantId;
  }

  // slices long id/conId if not hovering
  showId(conId: boolean): string {
    const hover = conId ? this.hoverConId : this.hoverId;
    const id = conId ? this.conId : this.id;
    if (hover) {
      return id;
    }
    return id.length > 15 ? `${id.slice(0, 15)}...` : id;
  }


  get start(): string {
    return this.conversationSelect.info.startTime;
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.currentId !== this.conversationState.selectedId) {
      this.messageEvents = this.messagesService.getEvents(this.conversationSelect);
      this.currentId = this.conversationState.selectedId;
    }
  }
}
