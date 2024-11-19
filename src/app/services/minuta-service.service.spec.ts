import { TestBed } from '@angular/core/testing';

import { MinutaServiceService } from './minuta-service.service';

describe('MinutaServiceService', () => {
  let service: MinutaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinutaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
