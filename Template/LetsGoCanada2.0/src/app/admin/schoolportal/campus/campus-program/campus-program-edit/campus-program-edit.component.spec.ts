import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusProgramEditComponent } from './campus-program-edit.component';

describe('CampusProgramEditComponent', () => {
  let component: CampusProgramEditComponent;
  let fixture: ComponentFixture<CampusProgramEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampusProgramEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusProgramEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
