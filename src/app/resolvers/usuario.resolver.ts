import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { UsuarioListItem } from '../models/pessoa.model';
import { UsuarioService } from '../services/usuario.service';

export const usuarioResolver: ResolveFn<UsuarioListItem> = (route: ActivatedRouteSnapshot) => {
  const usuarioService = inject(UsuarioService);
  const id = route.paramMap.get('id');

  if (id) {
    return usuarioService.findById(Number(id));
  }

  return of({
    id: 0,
    username: ''
  });
};
