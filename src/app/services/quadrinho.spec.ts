import { TestBed } from '@angular/core/testing';

import { Quadrinho } from './quadrinho';

describe('Quadrinho', () => {
  let service: Quadrinho;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Quadrinho);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
