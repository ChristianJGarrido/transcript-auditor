import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationSummarySelectComponent } from './conversation-summary-select.component';

describe('ConversationSummarySelectComponent', () => {
  let component: ConversationSummarySelectComponent;
  let fixture: ComponentFixture<ConversationSummarySelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationSummarySelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationSummarySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
