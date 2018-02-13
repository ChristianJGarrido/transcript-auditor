import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationSummarySaveComponent } from './conversation-summary-save.component';

describe('ConversationSummarySaveComponent', () => {
  let component: ConversationSummarySaveComponent;
  let fixture: ComponentFixture<ConversationSummarySaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationSummarySaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationSummarySaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
