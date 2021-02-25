import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewApplicationWizardComponent } from './new-application-wizard.component';

describe('NewApplicationWizardComponent', () => {
  let component: NewApplicationWizardComponent;
  let fixture: ComponentFixture<NewApplicationWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewApplicationWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewApplicationWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
