import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationAssessmentSummarySelectComponent } from './conversation-assessment-summary-select.component';

describe('ConversationAssessmentSummarySelectComponent', () => {
  let component: ConversationAssessmentSummarySelectComponent;
  let fixture: ComponentFixture<ConversationAssessmentSummarySelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationAssessmentSummarySelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationAssessmentSummarySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
