import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTrackerComponent } from './map-tracker.component';

describe('MapTrackerComponent', () => {
  let component: MapTrackerComponent;
  let fixture: ComponentFixture<MapTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
