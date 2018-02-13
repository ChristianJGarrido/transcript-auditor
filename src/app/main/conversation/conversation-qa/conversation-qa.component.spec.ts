import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationQaComponent } from './conversation-qa.component';

describe('ConversationQaComponent', () => {
  let component: ConversationQaComponent;
  let fixture: ComponentFixture<ConversationQaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationQaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
