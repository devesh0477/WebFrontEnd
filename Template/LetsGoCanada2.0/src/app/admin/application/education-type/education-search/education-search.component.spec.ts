import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationSearchComponent } from './education-search.component';

describe('EducationSearchComponent', () => {
  let component: EducationSearchComponent;
  let fixture: ComponentFixture<EducationSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
