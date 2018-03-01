import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { ConversationModel } from '../../store/conversation/conversation.model';
import * as playlistActions from '../../store/playlist/playlist.actions';
import * as conversationActions from '../../store/conversation/conversation.actions';
import { PlaylistModel } from '../../store/playlist/playlist.model';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../app.store';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-transcript-control',
  templateUrl: './transcript-control.component.html',
  styleUrls: ['./transcript-control.component.css'],
})
export class TranscriptControlComponent implements OnInit {
  @HostBinding('class') class = 'col-auto';
  @Input() conversationSelect: ConversationModel;
  @Input() playlistSelect: PlaylistModel;
  @Input() messageEvents: any[];

  confirm = false;

  constructor(
    private store: Store<StoreModel>,
    private exportService: ExportService
  ) {}

  /**
   * Download message data to CSV
   */
  downloadCsv(): void {
    // prepare message records
    const messages = this.messageEvents.map(event => {
      return {
        event: event.eventKey,
        sentBy: event.sentBy,
        agentFullName: event.agentFullName,
        time: event.time,
        text:
          event.messageData &&
          event.messageData.msg &&
          event.messageData.msg.text,
      };
    });
    this.exportService.downloadCsvFile(messages, 'Conversation');
  }

  // looks for conv id in playlist
  conversationIndex(): number {
    const convId = this.conversationSelect.id;
    const convIds = this.playlistSelect.conversationIds;
    return convIds.indexOf(convId);
  }

  // removes conversation from playlist
  removeFromPlaylist(): void {
    const playlistId = this.playlistSelect.id;
    const convIds = this.playlistSelect.conversationIds;
    const index = this.conversationIndex();
    if (index !== -1) {
      const conversationIds = [
        ...convIds.slice(0, index),
        ...convIds.slice(index + 1),
      ];
      this.store.dispatch(
        new playlistActions.Update(playlistId, { conversationIds })
      );
      this.store.dispatch(
        new conversationActions.FilterPlaylist(conversationIds)
      );
    }
    this.confirm = false;
  }

  ngOnInit() {}
}
