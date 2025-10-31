import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quadrinho } from '../models/quadrinho.model';
import { PageResult } from '../models/page-result.model';

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
    return this.http.post<Quadrinho>(`${this.baseURL}/quadrinhos`, this.buildPayload(quadrinho));
  }

  update(quadrinho: any): Observable<void> {
    return this.http.put<void>(`${this.baseURL}/quadrinhos/${quadrinho.id}`, this.buildPayload(quadrinho));
  }

  delete(quadrinho: Quadrinho): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/quadrinhos/${quadrinho.id}`);
  }

  // --- INÍCIO DAS NOVAS FUNÇÕES ---

  // Função para fazer o upload da imagem
  uploadImagem(id: number, nomeImagem: string, imagem: File): Observable<void> {
    const formData = new FormData();
    formData.append('nomeImagem', nomeImagem);
    formData.append('imagem', imagem);

    // O endpoint deve corresponder ao seu QuadrinhoResource no backend
    return this.http.patch<void>(`${this.baseURL}/quadrinhos/${id}/image/upload`, formData);
  }

  downloadImagem(nomeImagem: string): Observable<Blob> {
    return this.http.get(`${this.baseURL}/quadrinhos/image/download/${nomeImagem}`, {
      responseType: 'blob'
    });
  }

  // --- FIM DAS NOVAS FUNÇÕES ---

    // --- NOVOS ---

  // Contador total ou filtrado (depende de q)
  count(q?: string): Observable<number> {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    return this.http.get<number>(`${this.baseURL}/quadrinhos/count`, { params });
  }

  // Lista paginada completa (JSON com page/pageSize/total/filtered/data)
  findPaged(page = 0, pageSize = 12, q = ''): Observable<PageResult<Quadrinho>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    if (q) params = params.set('q', q);
    return this.http.get<PageResult<Quadrinho>>(`${this.baseURL}/quadrinhos/paged`, { params });
  }

  private buildPayload(quadrinho: any): any {
    const payload: any = { ...quadrinho };
    payload.id_material = quadrinho.idMaterial ?? null;
    payload.id_fornecedor = quadrinho.idFornecedor ?? null;
    delete payload.idMaterial;
    delete payload.idFornecedor;
    return payload;
  }
}
