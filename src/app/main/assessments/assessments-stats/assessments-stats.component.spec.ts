import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentsStatsComponent } from './assessments-stats.component';

describe('AssessmentsStatsComponent', () => {
  let component: AssessmentsStatsComponent;
  let fixture: ComponentFixture<AssessmentsStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentsStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
