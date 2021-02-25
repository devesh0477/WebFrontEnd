import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusProgramComponent } from './campus-program.component';

describe('CampusProgramComponent', () => {
  let component: CampusProgramComponent;
  let fixture: ComponentFixture<CampusProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampusProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
