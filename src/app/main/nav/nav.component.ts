import { Component, OnInit, Input } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Input() sideNavList: MatDrawer;

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

  ngOnInit() {
  }

}
