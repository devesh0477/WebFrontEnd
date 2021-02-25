import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentWorkflowComponent } from './payment-workflow.component';

describe('PaymentWorkflowComponent', () => {
  let component: PaymentWorkflowComponent;
  let fixture: ComponentFixture<PaymentWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
