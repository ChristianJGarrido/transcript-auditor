import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationMessageTextComponent } from './conversation-message-text.component';

describe('ConversationMessageTextComponent', () => {
  let component: ConversationMessageTextComponent;
  let fixture: ComponentFixture<ConversationMessageTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationMessageTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationMessageTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
