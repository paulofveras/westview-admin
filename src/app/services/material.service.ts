import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Material } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private baseURL: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Material[]> {
    // Este endpoint deve corresponder ao seu MaterialResource no backend
    return this.http.get<Material[]>(`${this.baseURL}/materiais`);
  }
}