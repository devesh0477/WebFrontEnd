import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalStatusComponent } from './internal-status.component';

describe('InternalStatusComponent', () => {
  let component: InternalStatusComponent;
  let fixture: ComponentFixture<InternalStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
