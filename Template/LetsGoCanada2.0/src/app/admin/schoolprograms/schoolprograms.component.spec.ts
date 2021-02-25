import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolprogramsComponent } from './schoolprograms.component';

describe('SchoolprogramsComponent', () => {
  let component: SchoolprogramsComponent;
  let fixture: ComponentFixture<SchoolprogramsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolprogramsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolprogramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
