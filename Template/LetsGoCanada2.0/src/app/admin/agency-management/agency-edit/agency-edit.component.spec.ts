import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyEditComponent } from './agency-edit.component';

describe('AgencyEditComponent', () => {
  let component: AgencyEditComponent;
  let fixture: ComponentFixture<AgencyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
