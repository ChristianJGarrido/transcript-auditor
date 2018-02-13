import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationsListFilterComponent } from './conversations-list-filter.component';

describe('ConversationsListFilterComponent', () => {
  let component: ConversationsListFilterComponent;
  let fixture: ComponentFixture<ConversationsListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationsListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationsListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
