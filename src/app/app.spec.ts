import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Importe a CLASSE do serviço, não a interface
import { QuadrinhoService } from './services/quadrinho.service';

describe('QuadrinhoService', () => { // Descreva o que está sendo testado: QuadrinhoService
  let service: QuadrinhoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] // Adicione isso para testar serviços que usam HttpClient
    });
    service = TestBed.inject(QuadrinhoService); // Injete o SERVIÇO
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});