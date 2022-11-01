import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGroupeComponent } from './chat-groupe.component';

describe('ChatGroupeComponent', () => {
  let component: ChatGroupeComponent;
  let fixture: ComponentFixture<ChatGroupeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatGroupeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatGroupeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
