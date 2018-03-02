import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveNotificationComponent } from './save-notification.component';

describe('SaveNotificationComponent', () => {
  let component: SaveNotificationComponent;
  let fixture: ComponentFixture<SaveNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
