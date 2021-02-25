import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCsvComponent } from './payment-csv.component';

describe('PaymentCsvComponent', () => {
  let component: PaymentCsvComponent;
  let fixture: ComponentFixture<PaymentCsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
