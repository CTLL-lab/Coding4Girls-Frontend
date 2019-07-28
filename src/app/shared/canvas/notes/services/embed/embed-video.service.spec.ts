import { TestBed, inject } from '@angular/core/testing';

import { EmbedVideoService } from './embed-video.service';

describe('EmbedVideoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmbedVideoService]
    });
  });

  it('should be created', inject([EmbedVideoService], (service: EmbedVideoService) => {
    expect(service).toBeTruthy();
  }));
});
