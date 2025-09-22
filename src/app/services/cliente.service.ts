import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/pessoa.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseURL: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseURL}/clientes`);
  }

  findById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseURL}/clientes/${id}`);
  }

  save(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.baseURL}/clientes`, cliente);
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseURL}/clientes/${cliente.id}`, cliente);
  }

  delete(cliente: Cliente): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/clientes/${cliente.id}`);
  }
}