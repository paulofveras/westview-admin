import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quadrinho } from '../models/quadrinho.model'; // Importe o novo modelo

@Injectable({
  providedIn: 'root'
})
export class QuadrinhoService {
  private baseURL: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // O método agora espera retornar um array de Quadrinhos
  findAll(): Observable<Quadrinho[]> {
    return this.http.get<Quadrinho[]>(`${this.baseURL}/quadrinhos`);
  }

  // O método agora espera retornar um único Quadrinho
  findById(id: string): Observable<Quadrinho> {
    return this.http.get<Quadrinho>(`${this.baseURL}/quadrinhos/${id}`);
  }

  // O método agora recebe um objeto que corresponde parcialmente a um Quadrinho para salvar.
  // Usamos 'any' aqui porque o formulário envia 'idFornecedor' em vez do objeto 'fornecedor' completo.
  save(quadrinho: any): Observable<Quadrinho> {
    return this.http.post<Quadrinho>(`${this.baseURL}/quadrinhos`, quadrinho);
  }

  // O método de update também recebe 'any' pelo mesmo motivo do save.
  update(quadrinho: any): Observable<Quadrinho> {
    return this.http.put<Quadrinho>(`${this.baseURL}/quadrinhos/${quadrinho.id}`, quadrinho);
  }

  delete(quadrinho: Quadrinho): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/quadrinhos/${quadrinho.id}`);
  }
}
