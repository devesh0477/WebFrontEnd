import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannedCountryComponent } from './banned-country.component';

describe('BannedCountryComponent', () => {
  let component: BannedCountryComponent;
  let fixture: ComponentFixture<BannedCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannedCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannedCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
