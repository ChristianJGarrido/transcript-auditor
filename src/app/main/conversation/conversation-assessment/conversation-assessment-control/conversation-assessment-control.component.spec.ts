import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationAssessmentControlComponent } from './conversation-assessment-control.component';

describe('ConversationAssessmentControlComponent', () => {
  let component: ConversationAssessmentControlComponent;
  let fixture: ComponentFixture<ConversationAssessmentControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationAssessmentControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationAssessmentControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
