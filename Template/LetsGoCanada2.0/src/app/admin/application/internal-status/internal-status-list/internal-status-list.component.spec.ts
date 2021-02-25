import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalStatusListComponent } from './internal-status-list.component';

describe('InternalStatusListComponent', () => {
  let component: InternalStatusListComponent;
  let fixture: ComponentFixture<InternalStatusListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalStatusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
