import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentsGridComponent } from './assessments-grid.component';

describe('AssessmentsGridComponent', () => {
  let component: AssessmentsGridComponent;
  let fixture: ComponentFixture<AssessmentsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
