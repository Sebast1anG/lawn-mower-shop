import { TestBed } from '@angular/core/testing';

import { LawnMowerService } from './lawn-mower.service';

describe('LawnMowerService', () => {
  let service: LawnMowerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LawnMowerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
