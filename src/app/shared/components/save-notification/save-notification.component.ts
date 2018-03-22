import { Component, OnChanges, Input, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-save-notification',
  templateUrl: './save-notification.component.html',
  styleUrls: ['./save-notification.component.css'],
})
export class SaveNotificationComponent implements OnChanges {
  @Input() updating: boolean = null;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnChanges() {
    setTimeout(() => {
      this.updating = !this.updating ? null : this.updating;
      this.changeDetector.detectChanges();
    }, 1000);
  }
}
