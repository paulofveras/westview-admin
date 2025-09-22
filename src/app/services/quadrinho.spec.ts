import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importe o módulo de teste HTTP
import { QuadrinhoService } from './quadrinho.service'; // CORRIGIDO: Importe o SERVIÇO

describe('QuadrinhoService', () => { // CORRIGIDO: Descreva o SERVIÇO
  let service: QuadrinhoService; // CORRIGIDO: A variável deve ser do tipo do SERVIÇO

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] // Adicione o módulo de teste HTTP
    });
    service = TestBed.inject(QuadrinhoService); // CORRIGIDO: Injete o SERVIÇO
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
