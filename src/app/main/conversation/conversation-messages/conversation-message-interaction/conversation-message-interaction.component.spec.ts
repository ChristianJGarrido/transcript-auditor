import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationMessageInteractionComponent } from './conversation-message-interaction.component';

describe('ConversationMessageInteractionComponent', () => {
  let component: ConversationMessageInteractionComponent;
  let fixture: ComponentFixture<ConversationMessageInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationMessageInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationMessageInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
