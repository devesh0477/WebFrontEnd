import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfProgramComponent } from './type-of-program.component';

describe('TypeOfProgramComponent', () => {
  let component: TypeOfProgramComponent;
  let fixture: ComponentFixture<TypeOfProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeOfProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeOfProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
