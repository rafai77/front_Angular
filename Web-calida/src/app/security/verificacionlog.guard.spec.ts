import { TestBed } from '@angular/core/testing';

import { VerificacionlogGuard } from './verificacionlog.guard';

describe('VerificacionlogGuard', () => {
  let guard: VerificacionlogGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VerificacionlogGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
