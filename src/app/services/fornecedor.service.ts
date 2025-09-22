import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fornecedor } from '../models/pessoa.model'; // Atualize para importar o novo modelo

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private baseURL: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // A partir daqui, troque todos os tipos para a nova interface 'Fornecedor'
  findAll(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(`${this.baseURL}/fornecedores`);
  }

  findById(id: number): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${this.baseURL}/fornecedores/${id}`);
  }

  save(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(`${this.baseURL}/fornecedores`, fornecedor);
  }

  update(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${this.baseURL}/fornecedores/${fornecedor.id}`, fornecedor);
  }

  delete(fornecedor: Fornecedor): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/fornecedores/${fornecedor.id}`);
  }
}