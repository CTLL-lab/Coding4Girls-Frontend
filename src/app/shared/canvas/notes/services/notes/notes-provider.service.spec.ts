import { TestBed, inject } from '@angular/core/testing';

import { NotesProviderService } from './notes-provider.service';

describe('NotesProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotesProviderService]
    });
  });

  it('should be created', inject([NotesProviderService], (service: NotesProviderService) => {
    expect(service).toBeTruthy();
  }));
});
