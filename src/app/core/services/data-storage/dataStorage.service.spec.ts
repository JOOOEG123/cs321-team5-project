/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataStorageService } from './dataStorage.service';

describe('Service: DataStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataStorageService]
    });
  });

  it('should ...', inject([DataStorageService], (service: DataStorageService) => {
    expect(service).toBeTruthy();
  }));
});
