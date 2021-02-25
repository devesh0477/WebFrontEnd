import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiLanguageComponent } from './profi-language.component';

describe('ProfiLanguageComponent', () => {
  let component: ProfiLanguageComponent;
  let fixture: ComponentFixture<ProfiLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfiLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
