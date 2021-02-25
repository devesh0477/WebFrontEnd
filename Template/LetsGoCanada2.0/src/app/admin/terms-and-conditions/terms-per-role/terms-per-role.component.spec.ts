import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsPerRoleComponent } from './terms-per-role.component';

describe('TermsPerRoleComponent', () => {
  let component: TermsPerRoleComponent;
  let fixture: ComponentFixture<TermsPerRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsPerRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsPerRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
