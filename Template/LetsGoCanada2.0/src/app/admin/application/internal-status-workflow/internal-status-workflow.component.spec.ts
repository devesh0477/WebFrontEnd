import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalStatusWorkflowComponent } from './internal-status-workflow.component';

describe('InternalStatusWorkflowComponent', () => {
  let component: InternalStatusWorkflowComponent;
  let fixture: ComponentFixture<InternalStatusWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalStatusWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalStatusWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
