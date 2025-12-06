import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cliente } from '../models/pessoa.model';
import { PageResult } from '../models/page-result.model';
import { Quadrinho } from '../models/quadrinho.model'; 

interface ClienteDto {
  nome: string;
  cpf: string;
  email: string;
  username: string;
  senha: string;
  telefone: Cliente['telefone'];
  endereco: Cliente['endereco'];
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly baseURL = 'http://localhost:8080/clientes';

  constructor(private http: HttpClient) {}

  findPaged(page: number, pageSize: number, q?: string): Observable<PageResult<Cliente>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (q) {
      params = params.set('q', q);
    }

    return this.http.get<PageResult<Cliente>>(this.baseURL, { params }).pipe(
      map(result => ({
        ...result,
        data: result.data.map(cliente => this.normalizeCliente(cliente))
      }))
    );
  }

  findAll(): Observable<Cliente[]> {
    return this.http
      .get<Cliente[]>(`${this.baseURL}/all`)
      .pipe(map(clientes => clientes.map(cliente => this.normalizeCliente(cliente))));
  }

  findById(id: number): Observable<Cliente> {
    return this.http
      .get<Cliente>(`${this.baseURL}/${id}`)
      .pipe(map(cliente => this.normalizeCliente(cliente)));
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post<Cliente>(this.baseURL, this.toDto(cliente))
      .pipe(map(created => this.normalizeCliente(created)));
  }

  update(id: number, cliente: Cliente): Observable<void> {
    return this.http.put<void>(`${this.baseURL}/${id}`, this.toDto(cliente));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }

  updatePassword(id: number, oldPassword: string, newPassword: string): Observable<void> {
    return this.http.patch<void>(`${this.baseURL}/update-password/${id}`, {
      oldPassword,
      newPassword
    });
  }

  updateUsername(id: number, newUsername: string): Observable<void> {
    return this.http.patch<void>(`${this.baseURL}/update-username/${id}`, {
      newUsername
    });
  }

  // --- NOVOS MÉTODOS DE FAVORITOS ---

  adicionarFavorito(idCliente: number, idQuadrinho: number): Observable<void> {
    return this.http.post<void>(`${this.baseURL}/${idCliente}/favoritos/${idQuadrinho}`, {});
  }

  removerFavorito(idCliente: number, idQuadrinho: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${idCliente}/favoritos/${idQuadrinho}`);
  }

  getFavoritos(idCliente: number): Observable<Quadrinho[]> {
    return this.http.get<Quadrinho[]>(`${this.baseURL}/${idCliente}/favoritos`);
  }

  private normalizeCliente(cliente: Cliente): Cliente {
    const usernameFromUser = cliente.usuario?.username;
    if (!cliente.username && usernameFromUser) {
      return { ...cliente, username: usernameFromUser };
    }
    return cliente;
  }

  private toDto(cliente: Cliente): ClienteDto {
    const username = cliente.username ?? cliente.usuario?.username;
    if (!username) {
      throw new Error('Username eh obrigatorio para cliente.');
    }

    if (!cliente.senha) {
      throw new Error('Senha eh obrigatoria para cliente.');
    }

    return {
      nome: cliente.nome,
      cpf: cliente.cpf,
      email: cliente.email,
      username,
      senha: cliente.senha,
      telefone: cliente.telefone,
      endereco: cliente.endereco
    };
  }
}
