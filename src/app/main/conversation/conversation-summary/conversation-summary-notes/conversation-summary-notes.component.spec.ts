import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationSummaryNotesComponent } from './conversation-summary-notes.component';

describe('ConversationSummaryNotesComponent', () => {
  let component: ConversationSummaryNotesComponent;
  let fixture: ComponentFixture<ConversationSummaryNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationSummaryNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationSummaryNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
