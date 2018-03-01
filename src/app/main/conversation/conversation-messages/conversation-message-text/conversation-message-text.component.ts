import { Component, OnInit, Input } from '@angular/core';
import { ApiConversationMessageRecord } from '../../../../shared/interfaces/interfaces';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConversationMessageTextNoteComponent } from './conversation-message-text-note/conversation-message-text-note.component';
import { AssessmentModel } from '../../../../shared/store/assessment/assessment.model';

@Component({
  selector: 'app-conversation-message-text',
  templateUrl: './conversation-message-text.component.html',
  styleUrls: ['./conversation-message-text.component.css'],
})
export class ConversationMessageTextComponent implements OnInit {
  @Input() message: ApiConversationMessageRecord;
  @Input() assessmentSelect: AssessmentModel;

  dialogRef: MatDialogRef<ConversationMessageTextNoteComponent>;

  constructor(public dialog: MatDialog) {}

  // opens message note dialog
  openDialog(event: any): void {
    const left = (event && `${event.clientX}px`) || '40%';
    const top = (event && `${event.clientY - 150}px`) || '40%';
    this.dialogRef = this.dialog.open(ConversationMessageTextNoteComponent, {
      position: { left, top },
      width: '300px',
      data: { msgId: this.message.messageId, assessmentSelect: this.assessmentSelect }
    });
  }

  // retrieve message note
  getMessageNote(id: string): string {
    const msgs = this.assessmentSelect.messages;
    if (msgs && msgs[id] && msgs[id].note) {
      return msgs[id].note;
    }
    return;
  }

  // check for message note
  hasMessageNote(id: string): boolean {
    return this.getMessageNote(id) ? true : false;
  }

  ngOnInit() {

  }
}
