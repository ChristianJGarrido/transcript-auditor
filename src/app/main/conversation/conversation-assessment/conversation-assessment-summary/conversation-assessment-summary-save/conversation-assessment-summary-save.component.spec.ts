import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationAssessmentSummarySaveComponent } from './conversation-assessment-summary-save.component';

describe('ConversationAssessmentSummarySaveComponent', () => {
  let component: ConversationAssessmentSummarySaveComponent;
  let fixture: ComponentFixture<ConversationAssessmentSummarySaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationAssessmentSummarySaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationAssessmentSummarySaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
