import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGroupeAddComponent } from './chat-groupe-add.component';

describe('ChatGroupeAddComponent', () => {
  let component: ChatGroupeAddComponent;
  let fixture: ComponentFixture<ChatGroupeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatGroupeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatGroupeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
