import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageInteractionComponent } from './message-interaction.component';

describe('MessageInteractionComponent', () => {
  let component: MessageInteractionComponent;
  let fixture: ComponentFixture<MessageInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
