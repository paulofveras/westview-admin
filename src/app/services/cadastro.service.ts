import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/pessoa.model';

export interface CadastroBasicoDTO {
  nome: string;
  cpf: string;
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

// Interface para a resposta do ViaCEP
export interface EnderecoViaCep {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
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

  // --- NOVO MÉTODO: Consultar CEP ---
  consultarCep(cep: string): Observable<EnderecoViaCep> {
    // Remove caracteres não numéricos para garantir
    const cepLimpo = cep.replace(/\D/g, '');
    return this.http.get<EnderecoViaCep>(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  }
}