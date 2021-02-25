import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiComponent } from './profi.component';

describe('ProfiComponent', () => {
  let component: ProfiComponent;
  let fixture: ComponentFixture<ProfiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
