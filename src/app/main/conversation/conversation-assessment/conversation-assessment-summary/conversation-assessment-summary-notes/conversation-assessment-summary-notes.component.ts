import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AfConversationData, AfConversationForm } from '../../../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-conversation-assessment-summary-notes',
  templateUrl: './conversation-assessment-summary-notes.component.html',
  styleUrls: ['./conversation-assessment-summary-notes.component.css']
})
export class ConversationAssessmentSummaryNotesComponent implements OnInit, OnDestroy {
  @Input() formData: AfConversationForm;
  @Input() id: string;

  note$: Subject<string> = new Subject();
  noteSub: Subscription;

  constructor() {}

  /**
   * Updates the conversations note
   * @param {string} note
   */
  changeNote(note: string) {
    // this.afDataService.toggleSave('saving');
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
            // this.afDataService.updateConversation(this.id, {
            //   note: data
            // })
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
