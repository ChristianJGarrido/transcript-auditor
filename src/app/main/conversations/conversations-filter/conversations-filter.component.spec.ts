import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationsFilterComponent } from './conversations-filter.component';

describe('ConversationsFilterComponent', () => {
  let component: ConversationsFilterComponent;
  let fixture: ComponentFixture<ConversationsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
