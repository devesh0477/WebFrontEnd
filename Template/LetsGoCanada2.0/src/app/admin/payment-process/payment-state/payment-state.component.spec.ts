import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStateComponent } from './payment-state.component';

describe('PaymentStateComponent', () => {
  let component: PaymentStateComponent;
  let fixture: ComponentFixture<PaymentStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
