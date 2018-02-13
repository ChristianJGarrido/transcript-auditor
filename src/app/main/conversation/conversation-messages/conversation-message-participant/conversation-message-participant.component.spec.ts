import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationMessageParticipantComponent } from './conversation-message-participant.component';

describe('ConversationMessageParticipantComponent', () => {
  let component: ConversationMessageParticipantComponent;
  let fixture: ComponentFixture<ConversationMessageParticipantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationMessageParticipantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationMessageParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
