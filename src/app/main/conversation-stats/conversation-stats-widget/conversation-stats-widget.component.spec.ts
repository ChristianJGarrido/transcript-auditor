import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationStatsWidgetComponent } from './conversation-stats-widget.component';

describe('ConversationStatsWidgetComponent', () => {
  let component: ConversationStatsWidgetComponent;
  let fixture: ComponentFixture<ConversationStatsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationStatsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationStatsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
