import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AfDataService } from '../../../shared/services/af-data.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AfConversationData } from '../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-form-notes',
  templateUrl: './form-notes.component.html',
  styleUrls: ['./form-notes.component.css']
})
export class FormNotesComponent implements OnInit, OnDestroy {
  @Input() formData: AfConversationData;
  @Input() id: string;

  note$: Subject<string> = new Subject();
  noteSub: Subscription;

  constructor(private afDataService: AfDataService) {}

  /**
   * Updates the conversations note
   * @param {string} note
   */
  changeNote(note: string) {
    this.afDataService.toggleSave('saving');
    this.note$.next(note);
  }

  /**
   * Method to apply debounce listener to note input
   */
  debounceInput() {
    this.noteSub = this.note$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((data: string) => {
          return Observable.of(
            this.afDataService.updateConversation(this.id, {
              note: data
            })
          );
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.debounceInput();
  }

  ngOnDestroy() {
    this.noteSub.unsubscribe();
  }
}
