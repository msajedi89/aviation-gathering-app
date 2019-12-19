import { TestBed } from '@angular/core/testing';

import { NetworkEngineServiceService } from './network-engine-service.service';

describe('NetworkEngineServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetworkEngineServiceService = TestBed.get(NetworkEngineServiceService);
    expect(service).toBeTruthy();
  });
});
