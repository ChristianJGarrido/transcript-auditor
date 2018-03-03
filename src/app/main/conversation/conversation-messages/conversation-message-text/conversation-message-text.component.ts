import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConversationMessageTextNoteComponent } from './conversation-message-text-note/conversation-message-text-note.component';
import { AssessmentModel } from '../../../../shared/store/assessment/assessment.model';
import { ApiConversationMessageRecord } from '../../../../shared/interfaces/conversation';
import { ApiChatTranscript } from '../../../../shared/interfaces/chat';

@Component({
  selector: 'app-conversation-message-text',
  templateUrl: './conversation-message-text.component.html',
  styleUrls: ['./conversation-message-text.component.css'],
})
export class ConversationMessageTextComponent implements OnInit {
  @Input() message: any;
  @Input() assessmentSelect: AssessmentModel;
  @Input() isChat: boolean;

  dialogRef: MatDialogRef<ConversationMessageTextNoteComponent>;

  constructor(public dialog: MatDialog) {}

  // opens message note dialog
  openDialog(event: any): void {
    const msgId = this.getMessageId();
    const left = (event && `${event.clientX}px`) || '40%';
    const top = (event && `${event.clientY - 150}px`) || '40%';
    this.dialogRef = this.dialog.open(ConversationMessageTextNoteComponent, {
      position: { left, top },
      width: '300px',
      data: { msgId, assessmentSelect: this.assessmentSelect },
    });
  }

  // the message id
  getMessageId(): string|number {
    return this.isChat ? this.message.lineSeq : this.message.messageId;
  }

  // who sent the message
  getSource(): string {
    const param = this.isChat ? 'source' : 'sentBy';
    const sentBy = this.message[param].toLowerCase();
    switch (sentBy) {
      case 'visitor':
      case 'consumer':
        return 'consumer';
      default:
        return sentBy;
    }
  }

  // is source agent?
  isAgent(): boolean {
    return this.getSource() === 'agent';
  }

  // return the class of card
  getClass(card: boolean): string {
    const type = card ? 'message-card-' : 'font-';
    return `${type}${this.getSource()}`;
  }

  // retrieve message text
  getMessageText(): string {
    return this.isChat
      ? this.message.text
      : this.message.messageData &&
          this.message.messageData.msg &&
          this.message.messageData.msg.text;
  }

  // retrieve message note
  getMessageNote(id: string|number): string {
    const msgs = this.assessmentSelect.messages;
    if (msgs && msgs[id] && msgs[id].note) {
      return msgs[id].note;
    }
    return;
  }

  // check for message note
  hasMessageNote(id: string|number): boolean {
    return this.getMessageNote(id) ? true : false;
  }

  ngOnInit() {}
}
