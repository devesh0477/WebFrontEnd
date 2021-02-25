import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiEducationComponent } from './profi-education.component';

describe('ProfiEducationComponent', () => {
  let component: ProfiEducationComponent;
  let fixture: ComponentFixture<ProfiEducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfiEducationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
