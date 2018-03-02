import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  AssessmentModel,
  AssessmentMessagesModel,
} from '../../../../../shared/store/assessment/assessment.model';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../../../app.store';
import * as assessmentActions from '../../../../../shared/store/assessment/assessment.actions';

@Component({
  selector: 'app-conversation-message-text-note',
  templateUrl: './conversation-message-text-note.component.html',
  styleUrls: ['./conversation-message-text-note.component.css'],
})
export class ConversationMessageTextNoteComponent implements OnInit {
  @Input() messageId: string;

  note = '';
  confirm = false;

  constructor(
    private store: Store<StoreModel>,
    public dialogRef: MatDialogRef<ConversationMessageTextNoteComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { msgId: string; assessmentSelect: AssessmentModel }
  ) {}

  // updates note
  updateNote(add: boolean): void {
    const { msgId } = this.data;
    const { id, messages } = this.data.assessmentSelect;
    if (add) {
      const createdAt = new Date();
      this.store.dispatch(
        new assessmentActions.Update(id, {
          messages: {
            ...messages,
            [msgId]: {
              note: this.note,
              createdAt,
              createdBy: 'User',
            },
          },
        })
      );
    } else {
      delete messages[msgId];
      this.store.dispatch(new assessmentActions.Update(id, { messages }));
    }
  }

  // deletes note
  clearNote(): void {
    this.note = '';
    this.updateNote(false);
    this.confirm = false;
  }

  ngOnInit(): void {
    const msgs = this.data.assessmentSelect.messages;
    const messageNote = msgs && msgs[this.data.msgId];
    if (messageNote) {
      this.note = messageNote.note || '';
    }
  }
}
