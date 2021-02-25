import { TestBed } from '@angular/core/testing';

import { ToastmsgService } from './toastmsg.service';

describe('ToastmsgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastmsgService = TestBed.get(ToastmsgService);
    expect(service).toBeTruthy();
  });
});
