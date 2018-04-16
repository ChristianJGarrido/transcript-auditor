import { Component, OnChanges, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-save-notification',
  templateUrl: './save-notification.component.html',
  styleUrls: ['./save-notification.component.css'],
})
export class SaveNotificationComponent implements OnChanges, OnDestroy {
  @Input() updating: boolean = null;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnChanges(): void {
    setTimeout(() => {
      this.updating = !this.updating ? null : this.updating;
      this.changeDetector.detectChanges();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.changeDetector.detach();
  }
}
