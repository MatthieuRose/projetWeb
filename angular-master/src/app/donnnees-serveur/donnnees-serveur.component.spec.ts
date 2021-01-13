import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonnneesServeurComponent } from './donnnees-serveur.component';

describe('DonnneesServeurComponent', () => {
  let component: DonnneesServeurComponent;
  let fixture: ComponentFixture<DonnneesServeurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonnneesServeurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonnneesServeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
