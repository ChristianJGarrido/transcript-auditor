import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationAssessmentComponent } from './conversation-assessment.component';

describe('ConversationAssessmentComponent', () => {
  let component: ConversationAssessmentComponent;
  let fixture: ComponentFixture<ConversationAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
