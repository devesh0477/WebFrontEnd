import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMenuListComponent } from './role-menu-list.component';

describe('RoleMenuListComponent', () => {
  let component: RoleMenuListComponent;
  let fixture: ComponentFixture<RoleMenuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleMenuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
