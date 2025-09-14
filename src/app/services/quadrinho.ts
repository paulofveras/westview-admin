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

  uploadImagem(id: number, imagem: File): Observable<any> {
    const formData = new FormData();
    formData.append('nomeImagem', imagem.name);
    formData.append('imagem', imagem);

    // O HttpClient do Angular define o Content-Type como multipart/form-data automaticamente
    return this.http.patch(`${this.apiUrl}/${id}/image/upload`, formData);
  }

  // NOVO MÉTODO para obter a URL da imagem
  getImageUrl(nomeImagem: string): string {
    return `${this.apiUrl}/image/download/${nomeImagem}`;
  }
}
