import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  // --- O MÉTODO QUE ESTAVA FALTANDO ---
  meusPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/search/meus-Pedidos`);
  }
}