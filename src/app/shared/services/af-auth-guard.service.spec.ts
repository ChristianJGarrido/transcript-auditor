import { TestBed, inject } from '@angular/core/testing';

import { AfAuthGuardService } from './af-auth-guard.service';

describe('AfAuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AfAuthGuardService]
    });
  });

  it('should be created', inject([AfAuthGuardService], (service: AfAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
