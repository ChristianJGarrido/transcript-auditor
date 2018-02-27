import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationsListPlaylistComponent } from './conversations-list-playlist.component';

describe('ConversationsListPlaylistComponent', () => {
  let component: ConversationsListPlaylistComponent;
  let fixture: ComponentFixture<ConversationsListPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationsListPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationsListPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
