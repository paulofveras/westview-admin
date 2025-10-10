import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Fornecedor } from '../models/pessoa.model';
import { FornecedorService } from '../services/fornecedor.service';

export const fornecedorResolver: ResolveFn<Fornecedor> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const fornecedorId = Number(route.paramMap.get('id'));
        return inject(FornecedorService).findById(fornecedorId);
    };