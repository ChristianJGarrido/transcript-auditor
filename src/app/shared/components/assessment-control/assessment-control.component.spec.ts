import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentControlComponent } from './assessment-control.component';

describe('AssessmentControlComponent', () => {
  let component: AssessmentControlComponent;
  let fixture: ComponentFixture<AssessmentControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
