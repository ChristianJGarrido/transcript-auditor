import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message-by',
  templateUrl: './message-by.component.html',
  styleUrls: ['./message-by.component.css']
})
export class MessageByComponent implements OnInit {
  @Input() by: string;
  @Input() time: string;

  constructor() { }

  ngOnInit() {
  }

}
