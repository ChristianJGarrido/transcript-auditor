import { Component, OnInit } from '@angular/core';
import { ApiLoginService } from '../../shared/services/api-login.service';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  dialogRef: MatDialogRef<ModalComponent>;

  constructor(public dialog: MatDialog, private apiLoginService: ApiLoginService) {}

  /**
   * Opens the material dialog modal
   */
  openDialog(): void {
    this.dialogRef = this.dialog.open(ModalComponent, { maxWidth: 400 });
  }

  ngOnInit() {
    // open dialog on login if no token found
    // timeout required due to known angular bug with opening dialog during change detection
    if (!this.apiLoginService.bearer) {
      setTimeout(() => this.openDialog(), 100);
    }
  }
}
