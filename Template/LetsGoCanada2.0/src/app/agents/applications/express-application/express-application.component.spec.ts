import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressApplicationComponent } from './express-application.component';

describe('ExpressApplicationComponent', () => {
  let component: ExpressApplicationComponent;
  let fixture: ComponentFixture<ExpressApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpressApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
