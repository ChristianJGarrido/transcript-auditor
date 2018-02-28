import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  @Input() sideNavList: MatDrawer;

  clockInterval;
  time: Date = new Date();

  constructor() { }

  /**
   * toggles conversation list panel open or closed
   */
  toggleSideNavList(): void {
    if (this.sideNavList.opened) {
      this.sideNavList.close();
    } else {
      this.sideNavList.open();
    }
  }

  ngOnInit(): void {
    this.clockInterval = setInterval(() => this.time = new Date(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.clockInterval);
  }

}
