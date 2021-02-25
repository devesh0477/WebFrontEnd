import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressProgramsComponent } from './express-programs.component';

describe('ExpressProgramsComponent', () => {
  let component: ExpressProgramsComponent;
  let fixture: ComponentFixture<ExpressProgramsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpressProgramsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
