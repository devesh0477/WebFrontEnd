import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsResultComponent } from './applications-result.component';

describe('ApplicationsResultComponent', () => {
  let component: ApplicationsResultComponent;
  let fixture: ComponentFixture<ApplicationsResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationsResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
