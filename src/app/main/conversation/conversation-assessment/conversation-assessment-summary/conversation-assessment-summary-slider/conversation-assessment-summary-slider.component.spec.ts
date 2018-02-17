import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationAssessmentSummarySliderComponent } from './conversation-assessment-summary-slider.component';

describe('ConversationAssessmentSummarySliderComponent', () => {
  let component: ConversationAssessmentSummarySliderComponent;
  let fixture: ComponentFixture<ConversationAssessmentSummarySliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationAssessmentSummarySliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationAssessmentSummarySliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
