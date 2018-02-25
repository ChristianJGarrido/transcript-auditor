import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationPlaylistComponent } from './conversation-playlist.component';

describe('ConversationPlaylistComponent', () => {
  let component: ConversationPlaylistComponent;
  let fixture: ComponentFixture<ConversationPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
