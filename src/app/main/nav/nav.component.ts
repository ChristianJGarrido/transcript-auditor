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
   * opens conversation list panel
   */
  openSideNavList(): void {
    this.sideNavList.open();
  }

  ngOnInit() {
  }

}
