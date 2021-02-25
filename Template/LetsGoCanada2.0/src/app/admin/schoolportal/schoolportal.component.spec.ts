import { async, ComponentFixture, TestBed} from '@angular/core/testing';

import { SchoolportalComponent } from './schoolportal.component';


describe('SchoolportalComponent', () => {
  let component: SchoolportalComponent;
  let fixture: ComponentFixture<SchoolportalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolportalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
