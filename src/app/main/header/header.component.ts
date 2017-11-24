import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiLoginService } from '../../shared/services/api-login.service';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  dialogRef: MatDialogRef<ModalComponent>;
  eventsSub: Subscription;

  constructor(public dialog: MatDialog, private apiLoginService: ApiLoginService) {}

  /**
   * Opens the material dialog modal
   */
  openDialog(): void {
    this.dialogRef = this.dialog.open(ModalComponent, {
      maxWidth: 400,
      position: { top: '5%', right: '5%' }
    });
  }

  ngOnInit() {
    // sub to events and open dialog if not logged in
    this.eventsSub = this.apiLoginService.events$.subscribe(event => {
      if (event.isLoggedIn) {
        if (this.dialogRef) {
          this.dialogRef.close();
        }
      } else {
        if (!this.dialogRef) {
          // timeout required due to known angular bug with opening dialog during change detection
          setTimeout(() => this.openDialog(), 100);
        }
      }
    });
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
  }
}
