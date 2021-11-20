import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';

import { UserMapService } from './user-map.service';

describe('UserMapService', () => {
  let service: UserMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule,  AngularFireModule.initializeApp(environment.firebase)],
      providers: [
        AngularFireModule,
        HttpClientModule
      ],
    });
    service = TestBed.inject(UserMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
