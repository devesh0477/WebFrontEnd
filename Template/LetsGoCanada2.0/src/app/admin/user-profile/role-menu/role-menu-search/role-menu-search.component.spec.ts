import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMenuSearchComponent } from './role-menu-search.component';

describe('RoleMenuSearchComponent', () => {
  let component: RoleMenuSearchComponent;
  let fixture: ComponentFixture<RoleMenuSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleMenuSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMenuSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
