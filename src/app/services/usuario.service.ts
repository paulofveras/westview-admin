import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from '../models/page-result.model';
import { UsuarioListItem } from '../models/pessoa.model';

interface UsuarioCreateDto {
  username: string;
  senha: string;
}

interface UsuarioUpdateDto {
  username: string;
  senha?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly baseURL = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) {}

  findPaged(page: number, pageSize: number, q?: string): Observable<PageResult<UsuarioListItem>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (q) {
      params = params.set('q', q);
    }

    return this.http.get<PageResult<UsuarioListItem>>(this.baseURL, { params });
  }

  findAll(): Observable<UsuarioListItem[]> {
    return this.http.get<UsuarioListItem[]>(`${this.baseURL}/all`);
  }

  findById(id: number): Observable<UsuarioListItem> {
    return this.http.get<UsuarioListItem>(`${this.baseURL}/${id}`);
  }

  create(usuario: UsuarioCreateDto): Observable<UsuarioListItem> {
    return this.http.post<UsuarioListItem>(this.baseURL, usuario);
  }

  update(id: number, usuario: UsuarioUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.baseURL}/${id}`, usuario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }
}
