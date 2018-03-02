import { Component, OnChanges, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-save-notification',
  templateUrl: './save-notification.component.html',
  styleUrls: ['./save-notification.component.css']
})
export class SaveNotificationComponent implements OnChanges {
  @Input() updating: boolean = null;

  constructor() { }

  ngOnChanges() {
    setTimeout(() => this.updating = !this.updating ? null : this.updating, 1000);
  }

}
