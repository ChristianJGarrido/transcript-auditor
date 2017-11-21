import { TestBed, inject } from '@angular/core/testing';

import { AfDataService } from './af-data.service';

describe('AfDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AfDataService]
    });
  });

  it('should be created', inject([AfDataService], (service: AfDataService) => {
    expect(service).toBeTruthy();
  }));
});
