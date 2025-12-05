import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
export class EnderecoService {
  constructor(private http: HttpClient) {}

  consultarCep(cep: string): Observable<EnderecoViaCep> {
    const cepLimpo = cep.replace(/\D/g, ''); // Remove não-números
    if (cepLimpo.length !== 8) {
      // Retorna erro se tamanho inválido
      return new Observable(observer => observer.error('CEP inválido'));
    }
    return this.http.get<EnderecoViaCep>(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  }
}