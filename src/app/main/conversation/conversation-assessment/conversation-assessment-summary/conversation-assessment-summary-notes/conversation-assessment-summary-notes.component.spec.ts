import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationAssessmentSummaryNotesComponent } from './conversation-assessment-summary-notes.component';

describe('ConversationAssessmentSummaryNotesComponent', () => {
  let component: ConversationAssessmentSummaryNotesComponent;
  let fixture: ComponentFixture<ConversationAssessmentSummaryNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationAssessmentSummaryNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationAssessmentSummaryNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
