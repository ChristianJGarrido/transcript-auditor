import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationAssessmentSummaryComponent } from './conversation-assessment-summary.component';

describe('ConversationAssessmentSummaryComponent', () => {
  let component: ConversationAssessmentSummaryComponent;
  let fixture: ComponentFixture<ConversationAssessmentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationAssessmentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationAssessmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
