import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericProgramListComponent } from './generic-program-list.component';

describe('GenericProgramListComponent', () => {
  let component: GenericProgramListComponent;
  let fixture: ComponentFixture<GenericProgramListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenericProgramListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericProgramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
