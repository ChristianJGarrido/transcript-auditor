import { Component, OnInit, Input } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiLoginModel } from '../../shared/store/api-login/api-login.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() apiLogin: ApiLoginModel;
  dialogRef: MatDialogRef<ModalComponent>;

  constructor(public dialog: MatDialog) {}

  /**
   * Opens the material dialog modal
   */
  openDialog(): void {
    this.dialogRef = this.dialog.open(ModalComponent, {
      maxWidth: 400,
      position: { top: '5%', right: '5%' }
    });
  }

  /**
   * if api session valid, don't open dialog
   */
  checkApiSession(): void {
    if (this.apiLogin.bearer) {
      if (this.dialogRef) {
        this.dialogRef.close();
      }
    } else {
      if (!this.dialogRef) {
        // timeout required due to known angular bug with opening dialog during change detection
        setTimeout(() => this.openDialog(), 100);
      }
    }
  }

  ngOnInit() {
    this.checkApiSession();
  }

}
