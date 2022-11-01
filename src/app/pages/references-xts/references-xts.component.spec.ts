import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencesXtsComponent } from './references-xts.component';

describe('ReferencesXtsComponent', () => {
  let component: ReferencesXtsComponent;
  let fixture: ComponentFixture<ReferencesXtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferencesXtsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencesXtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
