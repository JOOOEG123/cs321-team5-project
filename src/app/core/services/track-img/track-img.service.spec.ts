import { TestBed } from '@angular/core/testing';

import { TrackImgService } from './track-img.service';

describe('TrackImgService', () => {
  let service: TrackImgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackImgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
