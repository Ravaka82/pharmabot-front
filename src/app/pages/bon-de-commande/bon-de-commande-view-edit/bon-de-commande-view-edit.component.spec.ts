import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonDeCommandeViewEditComponent } from './bon-de-commande-view-edit.component';

describe('BonDeCommandeViewEditComponent', () => {
  let component: BonDeCommandeViewEditComponent;
  let fixture: ComponentFixture<BonDeCommandeViewEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonDeCommandeViewEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BonDeCommandeViewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
