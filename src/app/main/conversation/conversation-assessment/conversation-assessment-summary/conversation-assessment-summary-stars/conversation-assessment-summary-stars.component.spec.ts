import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationAssessmentSummaryStarsComponent } from './conversation-assessment-summary-stars.component';

describe('ConversationAssessmentSummaryStarsComponent', () => {
  let component: ConversationAssessmentSummaryStarsComponent;
  let fixture: ComponentFixture<ConversationAssessmentSummaryStarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationAssessmentSummaryStarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationAssessmentSummaryStarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
