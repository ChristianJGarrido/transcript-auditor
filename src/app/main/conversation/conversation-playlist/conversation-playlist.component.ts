import { Component, OnInit, Input } from '@angular/core';
import { PlaylistModel } from '../../../shared/store/playlist/playlist.model';
import * as fromPlaylist from '../../../shared/store/playlist/playlist.reducer';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-conversation-playlist',
  templateUrl: './conversation-playlist.component.html',
  styleUrls: ['./conversation-playlist.component.css']
})
export class ConversationPlaylistComponent implements OnInit {
  @Input() playlists: PlaylistModel[];
  @Input() playlistSelect: PlaylistModel;
  @Input() playlistState: fromPlaylist.State;

  constructor(private utilityService: UtilityService) { }

  // get conversation index
  findIndex(): number {
    return this.utilityService.findIndex(this.playlistSelect.id, this.playlists);
  }

  ngOnInit() {
  }

}
