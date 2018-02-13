import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationMessageTransferComponent } from './conversation-message-transfer.component';

describe('ConversationMessageTransferComponent', () => {
  let component: ConversationMessageTransferComponent;
  let fixture: ComponentFixture<ConversationMessageTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationMessageTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationMessageTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
