import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntStatusWorkflowListComponent } from './int-status-workflow-list.component';

describe('IntStatusWorkflowListComponent', () => {
  let component: IntStatusWorkflowListComponent;
  let fixture: ComponentFixture<IntStatusWorkflowListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntStatusWorkflowListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntStatusWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
