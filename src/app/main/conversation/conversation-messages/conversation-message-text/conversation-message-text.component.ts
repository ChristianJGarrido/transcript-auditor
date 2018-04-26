import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AssessmentModel } from '../../../../shared/store/assessment/assessment.model';
import { ApiConversationMessageRecord } from '../../../../shared/interfaces/conversation';
import { ApiChatTranscript } from '../../../../shared/interfaces/chat';
import { NoteModalComponent } from '../../../../shared/components/note-modal/note-modal.component';
import { NoteModalData } from '../../../../shared/interfaces/interfaces';
import { MessagesService } from '../../../../shared/services/messages.service';

@Component({
  selector: 'app-conversation-message-text',
  templateUrl: './conversation-message-text.component.html',
  styleUrls: ['./conversation-message-text.component.css'],
})
export class ConversationMessageTextComponent implements OnInit {
  @Input() message: any;
  @Input() assessmentSelect: AssessmentModel;
  @Input() isChat: boolean;
  @Input() conversation: any;

  dialogRef: MatDialogRef<NoteModalComponent>;

  constructor(
    public dialog: MatDialog,
    private messagesService: MessagesService
  ) {}

  // opens message note dialog
  openDialog(event: any): void {
    const msgId = this.getMessageId();
    const left = (event && `${event.clientX}px`) || '40%';
    const top = (event && `${event.clientY - 150}px`) || '40%';
    const data: NoteModalData = {
      type: 'msg',
      msgId,
      assessmentSelect: this.assessmentSelect,
    };
    this.dialogRef = this.dialog.open(NoteModalComponent, {
      position: { left, top },
      width: '300px',
      data,
    });
  }

  // the message id
  getMessageId(): string {
    const msgIdProp = this.messagesService.getMessageIdProp(this.isChat);
    return this.message[msgIdProp];
  }

  // who sent the message
  getSource(): string {
    return this.messagesService.getSource(this.isChat, this.message);
  }

  getAgentIdProp(): string {
    return this.messagesService.getAgentIdProp(this.isChat);
  }

  // human, system or bot
  getUserType(): string {
    if (!this.isChat) {
      const agentId = this.message[this.getAgentIdProp()];
      return this.messagesService.getUserType(agentId, this.conversation);
    }
    return '';
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
    return this.messagesService.getMessageText(this.isChat, this.message);
  }

  // retrieve message note
  getMessageNote(id: string): string {
    return this.messagesService.getMessageNote(id, this.assessmentSelect);
  }

  // check for message note
  hasMessageNote(id: string): boolean {
    return this.messagesService.getMessageNote(id, this.assessmentSelect)
      ? true
      : false;
  }

  ngOnInit() {}
}
