import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { Administrador } from '../models/pessoa.model';
import { AdministradorService } from '../services/administrador.service';

export const administradorResolver: ResolveFn<Administrador> = (route: ActivatedRouteSnapshot) => {
  const administradorService = inject(AdministradorService);
  const id = route.paramMap.get('id');

  if (id) {
    return administradorService.findById(Number(id));
  }

  return of({
    id: 0,
    nome: '',
    cpf: '',
    email: '',
    cargo: '',
    nivelAcesso: '',
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
  } as Administrador);
};
