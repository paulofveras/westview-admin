import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Administrador } from '../models/pessoa.model';
import { PageResult } from '../models/page-result.model';

interface AdministradorDto {
  nome: string;
  cpf: string;
  cargo: string;
  nivelAcesso: string;
  email: string;
  username: string;
  senha: string;
  telefone: Administrador['telefone'];
  endereco: Administrador['endereco'];
}

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  private readonly baseURL = 'http://localhost:8080/administradores';

  constructor(private http: HttpClient) {}

  findPaged(page: number, pageSize: number, q?: string): Observable<PageResult<Administrador>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (q) {
      params = params.set('q', q);
    }

    return this.http.get<PageResult<Administrador>>(this.baseURL, { params }).pipe(
      map(result => ({
        ...result,
        data: result.data.map(admin => this.normalize(admin))
      }))
    );
  }

  findAll(): Observable<Administrador[]> {
    return this.http
      .get<Administrador[]>(`${this.baseURL}/all`)
      .pipe(map(data => data.map(admin => this.normalize(admin))));
  }

  findById(id: number): Observable<Administrador> {
    return this.http
      .get<Administrador>(`${this.baseURL}/${id}`)
      .pipe(map(admin => this.normalize(admin)));
  }

  create(administrador: Administrador): Observable<Administrador> {
    return this.http
      .post<Administrador>(this.baseURL, this.toDto(administrador))
      .pipe(map(created => this.normalize(created)));
  }

  update(id: number, administrador: Administrador): Observable<void> {
    return this.http.put<void>(`${this.baseURL}/${id}`, this.toDto(administrador));
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

  private normalize(administrador: Administrador): Administrador {
    const username = administrador.usuario?.username ?? administrador.username;
    if (username) {
      return { ...administrador, username };
    }
    return administrador;
  }

  private toDto(administrador: Administrador): AdministradorDto {
    const username = administrador.username ?? administrador.usuario?.username;
    if (!username) {
      throw new Error('Username eh obrigatorio para administrador.');
    }

    if (!administrador.senha) {
      throw new Error('Senha eh obrigatoria para administrador.');
    }

    return {
      nome: administrador.nome,
      cpf: administrador.cpf,
      cargo: administrador.cargo,
      nivelAcesso: administrador.nivelAcesso,
      email: administrador.email,
      username,
      senha: administrador.senha,
      telefone: administrador.telefone,
      endereco: administrador.endereco
    };
  }
}
