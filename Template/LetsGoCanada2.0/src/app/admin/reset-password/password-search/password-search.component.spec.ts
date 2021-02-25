import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordSearchComponent } from './password-search.component';

describe('PasswordSearchComponent', () => {
  let component: PasswordSearchComponent;
  let fixture: ComponentFixture<PasswordSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
