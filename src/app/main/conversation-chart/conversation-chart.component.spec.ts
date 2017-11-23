import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationChartComponent } from './conversation-chart.component';

describe('ConversationChartComponent', () => {
  let component: ConversationChartComponent;
  let fixture: ComponentFixture<ConversationChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
