import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-conversation-qa',
  templateUrl: './conversation-qa.component.html',
  styleUrls: ['./conversation-qa.component.css']
})
export class ConversationQaComponent implements OnInit {
  @HostBinding('class') class = 'col-12';

  constructor() { }

  ngOnInit() {
  }

}
