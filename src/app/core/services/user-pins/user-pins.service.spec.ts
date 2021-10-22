import { TestBed } from '@angular/core/testing';

import { UserPinsService } from './user-pins.service';

describe('UserPinsService', () => {
  let service: UserPinsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPinsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
