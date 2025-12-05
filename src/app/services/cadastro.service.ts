import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/pessoa.model';

// Interface que espelha o CadastroBasicoDTO.java
export interface CadastroBasicoDTO {
  nome: string;
  cpf: string; // <--- NOVO CAMPO
  email: string;
  username: string;
  senha: string;
  telefone: {
    codigoArea: string;
    numero: string;
  };
  endereco: {
    cep: number;
    rua: string;
    numero: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private readonly baseURL = 'http://localhost:8080/cadastroBasicoCliente';

  constructor(private http: HttpClient) {}

  cadastrar(dto: CadastroBasicoDTO): Observable<Cliente> {
    return this.http.post<Cliente>(this.baseURL, dto);
  }
}