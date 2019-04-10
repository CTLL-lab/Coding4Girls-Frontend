import { TestBed, inject } from '@angular/core/testing';

import { NotificationsToasterService } from './notifications-toaster.service';

describe('NotificationsToasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationsToasterService]
    });
  });

  it('should be created', inject([NotificationsToasterService], (service: NotificationsToasterService) => {
    expect(service).toBeTruthy();
  }));
});
