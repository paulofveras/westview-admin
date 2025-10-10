import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Material } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private baseURL: string = 'http://localhost:8080/materiais';

  constructor(private http: HttpClient) {}

  // CORREÇÃO: Alterado de Observable<Material> para Observable<Material[]>
  findAll(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.baseURL}`);
  }

  findById(id: string): Observable<Material> {
    return this.http.get<Material>(`${this.baseURL}/${id}`);
  }
}