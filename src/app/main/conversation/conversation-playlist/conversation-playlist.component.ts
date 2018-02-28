import { Component, OnInit, Input } from '@angular/core';
import { PlaylistModel } from '../../../shared/store/playlist/playlist.model';
import * as fromPlaylist from '../../../shared/store/playlist/playlist.reducer';
import { UtilityService } from '../../../shared/services/utility.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PlaylistManagerComponent } from '../../../shared/components/playlist-manager/playlist-manager.component';

@Component({
  selector: 'app-conversation-playlist',
  templateUrl: './conversation-playlist.component.html',
  styleUrls: ['./conversation-playlist.component.css']
})
export class ConversationPlaylistComponent implements OnInit {
  @Input() playlistIds: string[]|number[];
  @Input() playlistSelect: PlaylistModel;
  @Input() playlistState: fromPlaylist.State;
  dialogRef: MatDialogRef<PlaylistManagerComponent>;

  constructor(private utilityService: UtilityService, public dialog: MatDialog) { }

  /**
   * Opens the material dialog modal
   */
  openDialog(): void {
    this.dialogRef = this.dialog.open(PlaylistManagerComponent, {
      maxWidth: 400,
    });
  }

  // get conversation index
  findIndex(): number {
    return this.utilityService.findIndex(this.playlistSelect.id, this.playlistIds);
  }

  ngOnInit() {
  }

}
