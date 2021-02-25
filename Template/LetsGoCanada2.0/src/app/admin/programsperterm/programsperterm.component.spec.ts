import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramspertermComponent } from './programsperterm.component';

describe('ProgramspertermComponent', () => {
  let component: ProgramspertermComponent;
  let fixture: ComponentFixture<ProgramspertermComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramspertermComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramspertermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
