import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationStatsComponent } from './conversation-stats.component';

describe('ConversationStatsComponent', () => {
  let component: ConversationStatsComponent;
  let fixture: ComponentFixture<ConversationStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
