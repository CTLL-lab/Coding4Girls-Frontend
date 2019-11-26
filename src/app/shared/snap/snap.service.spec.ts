import { TestBed } from '@angular/core/testing';

import { SnapService } from './snap.service';

describe('SnapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SnapService = TestBed.get(SnapService);
    expect(service).toBeTruthy();
  });
});
