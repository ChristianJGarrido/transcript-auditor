import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationSummaryComponent } from './conversation-summary.component';

describe('ConversationSummaryComponent', () => {
  let component: ConversationSummaryComponent;
  let fixture: ComponentFixture<ConversationSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
