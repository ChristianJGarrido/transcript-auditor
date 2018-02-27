import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../app.store';
import * as assessmentActions from '../../store/assessment/assessment.actions';
import * as playlistActions from '../../store/playlist/playlist.actions';
import * as conversationActions from '../../store/conversation/conversation.actions';

@Component({
  selector: 'app-cycle-items',
  templateUrl: './cycle-items.component.html',
  styleUrls: ['./cycle-items.component.css']
})
export class CycleItemsComponent implements OnInit {
  @HostBinding('class') class = 'col-auto';
  @Input() type: string;
  @Input() items: any[];
  @Input() index: number;

  constructor(private store: Store<StoreModel>) { }

  /**
   * toggle through items (true is forward, false is back)
   * @param {boolean} next
   */
  cycleItem(next: boolean) {
    const currentIndex = this.index;
    const maxIndex = this.items.length - 1;
    let nextIndex = 0;

    if (currentIndex !== -1) {
      const direction = next ? 1 : -1;
      const newIndex = currentIndex + direction;
      const safeIndex = next ? 0 : maxIndex;
      const isSafe = next ? newIndex <= maxIndex : newIndex >= 0;
      nextIndex = isSafe ? newIndex : safeIndex;
    }

    const newId = this.items[nextIndex].id;

    switch (this.type) {
      case 'conversation':
        return this.store.dispatch(new conversationActions.Select(newId));
      case 'assessment':
        return this.store.dispatch(new assessmentActions.Select(newId));
      case 'playlist':
        return this.store.dispatch(new playlistActions.Select(newId));
      default:
        return console.log('CYCLE_TYPE_ERROR');
    }
  }

  ngOnInit() {
  }

}
