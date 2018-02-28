import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable()
export class NotificationService {
  config: MatSnackBarConfig = {
    duration: 4000,
    verticalPosition: 'top',
  };

  constructor(public snackBar: MatSnackBar) {}

  openSnackBar(message) {
    this.snackBar.open(message, 'DISMISS', this.config);
  }
}
