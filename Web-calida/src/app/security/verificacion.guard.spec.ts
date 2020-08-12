import { TestBed } from '@angular/core/testing';

import { VerificacionGuard } from './verificacion.guard';

describe('VerificacionGuard', () => {
  let guard: VerificacionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VerificacionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
