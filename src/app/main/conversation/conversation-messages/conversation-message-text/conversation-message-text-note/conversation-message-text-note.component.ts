import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-conversation-message-text-note',
  templateUrl: './conversation-message-text-note.component.html',
  styleUrls: ['./conversation-message-text-note.component.css'],
})
export class ConversationMessageTextNoteComponent implements OnInit {
  @HostBinding('class') class = 'col';
  @Input() messageId: string;

  toggle = false;

  tooltip = `
  By: Daniel Kerwin
  I now have a note about something! This was a great example of the bot doing something lorem ipsum
  `;

  constructor() {}

  openDialog() {
    this.toggle = !this.toggle;
    console.log('open!');
  }

  ngOnInit() {}
}
