import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { Cliente } from '../models/pessoa.model';
import { ClienteService } from '../services/cliente.service';

export const clienteResolver: ResolveFn<Cliente> = (route: ActivatedRouteSnapshot) => {
  const clienteService = inject(ClienteService);
  const id = route.paramMap.get('id');

  if (id) {
    return clienteService.findById(Number(id));
  }

  return of({
    id: 0,
    nome: '',
    cpf: '',
    email: '',
    username: '',
    senha: '',
    telefone: {
      codigoArea: '',
      numero: ''
    },
    endereco: {
      cep: 0,
      rua: '',
      numero: 0
    }
  } as Cliente);
};
