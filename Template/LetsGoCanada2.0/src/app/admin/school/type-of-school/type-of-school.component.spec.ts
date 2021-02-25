import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfSchoolComponent } from './type-of-school.component';

describe('TypeOfSchoolComponent', () => {
  let component: TypeOfSchoolComponent;
  let fixture: ComponentFixture<TypeOfSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeOfSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeOfSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
