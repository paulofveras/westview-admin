import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FornecedorResponseDTO } from './quadrinho'; // Reutilizando a interface

const API_URL = 'http://localhost:8080/fornecedores';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<FornecedorResponseDTO[]> {
    return this.http.get<FornecedorResponseDTO[]>(API_URL);
  }

  // Futuramente, você pode adicionar create, update, delete aqui
}