import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Quadrinho } from '../models/quadrinho.model';
import { QuadrinhoService } from '../services/quadrinho.service';

// Este é o resolver. Ele é uma função que o Angular executará antes de carregar o componente.
export const quadrinhoResolver: ResolveFn<Quadrinho> = 
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Quadrinho> => {
        
    // Injetamos o serviço de quadrinhos para poder usá-lo
    const quadrinhoService = inject(QuadrinhoService);
    
    // Verificamos se a rota tem um parâmetro 'id'. Se tiver, estamos no modo de edição.
    if (route.paramMap.has('id')) {
        // Buscamos o quadrinho no backend usando o ID da rota
        return quadrinhoService.findById(route.paramMap.get('id')!);
    }
    
    // Se não houver 'id', estamos criando um novo quadrinho. Retornamos um objeto vazio.
    return of({ id: 0, nome: '', descricao: '', preco: 0, estoque: 0, fornecedor: { id: 0, nome: '', nomeFantasia: '', cnpj: '', email: '', telefone: {codigoArea:'', numero:''}, endereco: {cep: 0, rua:'', numero:0} } });
};