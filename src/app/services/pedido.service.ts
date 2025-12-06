import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from '../models/page-result.model';

export interface ItemPedidoDTO {
  quantidade: number;
  desconto: number;
  idQuadrinho: number;
}

export interface PedidoDTO {
  idCliente: number;
  itens: ItemPedidoDTO[];
  idPagamento: number;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private readonly baseURL = 'http://localhost:8080/pedidos';

  constructor(private http: HttpClient) {}

  save(pedido: PedidoDTO): Observable<any> {
    return this.http.post<any>(this.baseURL, pedido);
  }

  meusPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/search/meus-Pedidos`);
  }

  findPaged(page: number, pageSize: number, q?: string, sort: string = 'desc'): Observable<PageResult<any>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sort', sort); // Envia a ordenação

    if (q) {
      params = params.set('q', q);
    }

    return this.http.get<PageResult<any>>(this.baseURL, { params });
  }
}