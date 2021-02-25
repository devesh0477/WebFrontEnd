import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiBasicComponent } from './profi-basic.component';

describe('ProfiBasicComponent', () => {
  let component: ProfiBasicComponent;
  let fixture: ComponentFixture<ProfiBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfiBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
