import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptControlComponent } from './transcript-control.component';

describe('TranscriptControlComponent', () => {
  let component: TranscriptControlComponent;
  let fixture: ComponentFixture<TranscriptControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscriptControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriptControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
