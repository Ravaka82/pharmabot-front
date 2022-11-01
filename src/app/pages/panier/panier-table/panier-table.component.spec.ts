import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanierTableComponent } from './panier-table.component';

describe('PanierTableComponent', () => {
  let component: PanierTableComponent;
  let fixture: ComponentFixture<PanierTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanierTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanierTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
