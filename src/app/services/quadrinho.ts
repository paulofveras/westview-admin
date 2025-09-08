import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Dica: Crie uma interface para tipar seus dados. Fica mais organizado!
export interface Quadrinho {
  id: number;
  nome: string;
  dataPublicacao: string; // O tipo Date do Java geralmente vira string no JSON
  edicao: string;
  preco: number;
  quantidadePaginas: number;
  categoriaId: number;
  escritorId: number;
  artistaCapaId: number;
  classificacaoId: number;
  generoId: number;
  origemId: number;
  nomeImagem: string;
  estoque: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuadrinhoService {
  // ATENÇÃO: Verifique se a URL da sua API está correta!
  private readonly apiUrl = 'http://localhost:8080/quadrinhos';

  constructor(private http: HttpClient) { }

  // Corresponde ao GET /quadrinhos
  findAll(): Observable<Quadrinho[]> {
    return this.http.get<Quadrinho[]>(this.apiUrl);
  }

  // Corresponde ao GET /quadrinhos/{id}
  findById(id: number): Observable<Quadrinho> {
    return this.http.get<Quadrinho>(`${this.apiUrl}/${id}`);
  }

  // Corresponde ao POST /quadrinhos
  create(quadrinho: any): Observable<Quadrinho> {
    return this.http.post<Quadrinho>(this.apiUrl, quadrinho);
  }

  // Corresponde ao PUT /quadrinhos/{id}
  update(id: number, quadrinho: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, quadrinho);
  }

  // Corresponde ao DELETE /quadrinhos/{id}
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
