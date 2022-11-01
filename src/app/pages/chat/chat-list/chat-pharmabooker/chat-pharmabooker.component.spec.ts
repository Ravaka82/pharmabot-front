import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPharmabookerComponent } from './chat-pharmabooker.component';

describe('ChatPharmabookerComponent', () => {
  let component: ChatPharmabookerComponent;
  let fixture: ComponentFixture<ChatPharmabookerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatPharmabookerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPharmabookerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
