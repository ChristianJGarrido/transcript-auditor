import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleItemsComponent } from './cycle-items.component';

describe('CycleItemsComponent', () => {
  let component: CycleItemsComponent;
  let fixture: ComponentFixture<CycleItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CycleItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
