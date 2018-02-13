import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationMessageLinkComponent } from './conversation-message-link.component';

describe('ConversationMessageLinkComponent', () => {
  let component: ConversationMessageLinkComponent;
  let fixture: ComponentFixture<ConversationMessageLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationMessageLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationMessageLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
