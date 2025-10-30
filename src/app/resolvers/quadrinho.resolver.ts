import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Quadrinho } from '../models/quadrinho.model';
import { QuadrinhoService } from '../services/quadrinho.service';

export const quadrinhoResolver: ResolveFn<Quadrinho> = 
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Quadrinho> => {
        
    const quadrinhoService = inject(QuadrinhoService);
    
    if (route.paramMap.has('id')) {
        return quadrinhoService.findById(route.paramMap.get('id')!);
    }
    
    // --- INÍCIO DA CORREÇÃO ---

    // Adicionamos a propriedade 'nomeImagem' ao objeto padrão
    // para corresponder à interface Quadrinho.
    return of({ 
      id: 0, 
      nome: '', 
      descricao: '', 
      preco: 0, 
      estoque: 0, 
      fornecedor: { 
        id: 0, 
        nome: '', 
        nomeFantasia: '', 
        cnpj: '', 
        email: '', 
        telefone: {codigoArea:'', numero:''}, 
        endereco: {cep: 0, rua:'', numero:0},
         
      },
      nomeImagem: '', // Propriedade que estava faltando
      material: null
    });

    // --- FIM DA CORREÇÃO ---
};