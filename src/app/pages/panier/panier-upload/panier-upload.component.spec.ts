import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanierUploadComponent } from './panier-upload.component';

describe('PanierUploadComponent', () => {
  let component: PanierUploadComponent;
  let fixture: ComponentFixture<PanierUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanierUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanierUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
