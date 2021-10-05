import { TestBed } from '@angular/core/testing';

import { UserMapService } from './user-map.service';

describe('UserMapService', () => {
  let service: UserMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
