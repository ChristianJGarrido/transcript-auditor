import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationMessageTextNoteComponent } from './conversation-message-text-note.component';

describe('ConversationMessageTextNoteComponent', () => {
  let component: ConversationMessageTextNoteComponent;
  let fixture: ComponentFixture<ConversationMessageTextNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationMessageTextNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationMessageTextNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
