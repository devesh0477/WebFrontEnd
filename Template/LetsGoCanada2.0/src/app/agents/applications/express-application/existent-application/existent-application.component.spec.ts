import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistentApplicationComponent } from './existent-application.component';

describe('ExistentApplicationComponent', () => {
  let component: ExistentApplicationComponent;
  let fixture: ComponentFixture<ExistentApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistentApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistentApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
