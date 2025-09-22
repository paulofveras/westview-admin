import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/pessoa.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private baseURL: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(`${this.baseURL}/funcionarios`);
  }

  findById(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.baseURL}/funcionarios/${id}`);
  }

  save(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(`${this.baseURL}/funcionarios`, funcionario);
  }

  update(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.baseURL}/funcionarios/${funcionario.id}`, funcionario);
  }

  delete(funcionario: Funcionario): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/funcionarios/${funcionario.id}`);
  }
}