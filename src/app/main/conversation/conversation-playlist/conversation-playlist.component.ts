import { Component, OnInit, Input } from '@angular/core';
import { PlaylistModel } from '../../../shared/store/playlist/playlist.model';
import * as fromPlaylist from '../../../shared/store/playlist/playlist.reducer';
import * as fromAssessment from '../../../shared/store/assessment/assessment.reducer';
import { UtilityService } from '../../../shared/services/utility.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PlaylistManagerComponent } from '../../../shared/components/playlist-manager/playlist-manager.component';

@Component({
  selector: 'app-conversation-playlist',
  templateUrl: './conversation-playlist.component.html',
  styleUrls: ['./conversation-playlist.component.css']
})
export class ConversationPlaylistComponent implements OnInit {
  @Input() assessmentState: fromAssessment.State;
  @Input() playlistSelect: PlaylistModel;
  @Input() playlistState: fromPlaylist.State;
  dialogRef: MatDialogRef<PlaylistManagerComponent>;

  constructor(private utilityService: UtilityService, public dialog: MatDialog) { }

  /**
   * Opens the material dialog modal
   */
  openDialog(event: any): void {
    const left = (event && `${event.clientX}px`) || '10%';
    const top = (event && `${event.clientY}px`) || '10%';
    this.dialogRef = this.dialog.open(PlaylistManagerComponent, {
      position: { left, top },
      width: '300px',
    });
  }

  // get conversation index
  findIndex(): number {
    return this.utilityService.findIndex(this.playlistSelect.id, this.playlistState.ids);
  }

  ngOnInit() {
  }

}
