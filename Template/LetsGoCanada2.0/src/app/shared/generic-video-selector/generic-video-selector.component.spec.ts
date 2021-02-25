import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericVideoSelectorComponent } from './generic-video-selector.component';

describe('GenericVideoSelectorComponent', () => {
  let component: GenericVideoSelectorComponent;
  let fixture: ComponentFixture<GenericVideoSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericVideoSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericVideoSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
