import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentSaveComponent } from './assessment-save.component';

describe('AssessmentSaveComponent', () => {
  let component: AssessmentSaveComponent;
  let fixture: ComponentFixture<AssessmentSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
