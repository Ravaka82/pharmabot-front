import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanierDetailComponent } from './panier-detail.component';

describe('PanierDetailComponent', () => {
  let component: PanierDetailComponent;
  let fixture: ComponentFixture<PanierDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanierDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanierDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
