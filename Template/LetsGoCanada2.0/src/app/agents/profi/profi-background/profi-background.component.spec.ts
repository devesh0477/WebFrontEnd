import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiBackgroundComponent } from './profi-background.component';

describe('ProfiBackgroundComponent', () => {
  let component: ProfiBackgroundComponent;
  let fixture: ComponentFixture<ProfiBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfiBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
