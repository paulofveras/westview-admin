import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quadrinho } from '../models/quadrinho.model';

@Injectable({
  providedIn: 'root'
})
export class QuadrinhoService {
  private baseURL: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Quadrinho[]> {
    return this.http.get<Quadrinho[]>(`${this.baseURL}/quadrinhos`);
  }

  findById(id: string): Observable<Quadrinho> {
    return this.http.get<Quadrinho>(`${this.baseURL}/quadrinhos/${id}`);
  }

  save(quadrinho: any): Observable<Quadrinho> {
    return this.http.post<Quadrinho>(`${this.baseURL}/quadrinhos`, quadrinho);
  }

  update(quadrinho: any): Observable<Quadrinho> {
    return this.http.put<Quadrinho>(`${this.baseURL}/quadrinhos/${quadrinho.id}`, quadrinho);
  }

  delete(quadrinho: Quadrinho): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/quadrinhos/${quadrinho.id}`);
  }

  // --- INÍCIO DAS NOVAS FUNÇÕES ---

  // Função para fazer o upload da imagem
  uploadImagem(id: number, nomeImagem: string, imagem: File): Observable<any> {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('nomeImagem', nomeImagem);
    formData.append('imagem', imagem);

    // O endpoint deve corresponder ao seu QuadrinhoResource no backend
    return this.http.patch<any>(`${this.baseURL}/quadrinhos/image/upload`, formData);
  }

  // Função auxiliar para obter a URL completa da imagem
  getImageUrl(nomeImagem: string): string {
    // O endpoint deve corresponder ao seu FileService no backend
    return `${this.baseURL}/quadrinhos/image/download/${nomeImagem}`;
  }

  // --- FIM DAS NOVAS FUNÇÕES ---
}