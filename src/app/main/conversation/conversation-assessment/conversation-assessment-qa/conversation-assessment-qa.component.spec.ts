import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationAssessmentQaComponent } from './conversation-assessment-qa.component';

describe('ConversationAssessmentQaComponent', () => {
  let component: ConversationAssessmentQaComponent;
  let fixture: ComponentFixture<ConversationAssessmentQaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationAssessmentQaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationAssessmentQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
