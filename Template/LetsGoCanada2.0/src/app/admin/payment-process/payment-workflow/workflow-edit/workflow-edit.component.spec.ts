import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowEditComponent } from './workflow-edit.component';

describe('WorkflowEditComponent', () => {
  let component: WorkflowEditComponent;
  let fixture: ComponentFixture<WorkflowEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
