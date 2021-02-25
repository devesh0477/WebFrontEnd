import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiDocumentsComponent } from './profi-documents.component';

describe('ProfiDocumentsComponent', () => {
  let component: ProfiDocumentsComponent;
  let fixture: ComponentFixture<ProfiDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfiDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
