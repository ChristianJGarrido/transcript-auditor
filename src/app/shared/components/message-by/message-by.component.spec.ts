import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageByComponent } from './message-by.component';

describe('MessageByComponent', () => {
  let component: MessageByComponent;
  let fixture: ComponentFixture<MessageByComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageByComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
