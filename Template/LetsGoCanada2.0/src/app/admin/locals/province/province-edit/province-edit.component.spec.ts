import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceEditComponent } from './province-edit.component';

describe('ProvinceEditComponent', () => {
  let component: ProvinceEditComponent;
  let fixture: ComponentFixture<ProvinceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvinceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvinceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
