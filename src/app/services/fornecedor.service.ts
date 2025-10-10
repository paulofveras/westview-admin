import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fornecedor } from '../models/pessoa.model';
import { PageResult } from '../models/page-result.model';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private baseURL: string = 'http://localhost:8080/fornecedores';

  constructor(private http: HttpClient) {}
    // NOVO MÉTODO: Adicionado para o formulário poder carregar a lista de fornecedores
  findAll(): Observable<Fornecedor[]> {
    // Este endpoint precisa existir no seu backend e retornar todos os fornecedores
    return this.http.get<Fornecedor[]>(`${this.baseURL}/all`); 
  }

  findPaged(page: number, pageSize: number, q?: string): Observable<PageResult<Fornecedor>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (q) {
      params = params.set('q', q);
    }
    
    return this.http.get<PageResult<Fornecedor>>(`${this.baseURL}`, { params });
  }

  findById(id: number): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${this.baseURL}/${id}`);
  }

  save(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(`${this.baseURL}`, fornecedor);
  }

  update(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${this.baseURL}/${fornecedor.id}`, fornecedor);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/${id}`);
  }
}