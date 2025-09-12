import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Material {
  id: number;
  nome: string;
}

export interface FornecedorResponseDTO {
  id: number;
  nome: string;
  endereco: EnderecoResponseDTO;
  telefone: TelefoneResponseDTO;
  email: string;
}

export interface EnderecoResponseDTO {
  id: number;
  cep: number;
  rua: string;
  numero: number;
}

export interface TelefoneResponseDTO {
  id: number;
  codigoArea: string;
  numero: string;
}

export interface Quadrinho {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantPaginas: number;
  material: Material;
  fornecedor: FornecedorResponseDTO;
  nomeImagem: string;
  estoque: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuadrinhoService {
  private readonly apiUrl = 'http://localhost:8080/quadrinhos';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Quadrinho[]> {
    return this.http.get<Quadrinho[]>(this.apiUrl);
  }

  findById(id: number): Observable<Quadrinho> {
    return this.http.get<Quadrinho>(`${this.apiUrl}/${id}`);
  }

  create(quadrinho: any): Observable<Quadrinho> {
    return this.http.post<Quadrinho>(this.apiUrl, quadrinho);
  }

  update(id: number, quadrinho: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, quadrinho);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Novo método para upload de imagem
  uploadImage(id: number, formData: FormData): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/image/upload`, formData);
  }
}
