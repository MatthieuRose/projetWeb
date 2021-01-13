import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnesHomeComponent } from './personnes-home.component';

describe('PersonnesHomeComponent', () => {
  let component: PersonnesHomeComponent;
  let fixture: ComponentFixture<PersonnesHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonnesHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
