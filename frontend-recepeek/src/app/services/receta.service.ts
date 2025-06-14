import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecetaService {
  private apiUrl = 'http://localhost:8080/api';
  private actualizacion = new Subject<void>();
  actualizacion$ = this.actualizacion.asObservable();

  constructor(private http: HttpClient) {}

  // receta.service.ts
  getRecetas(id?: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recetas`);
  }

  crearReceta(data: {
    title: string;
    description: string;
    steps: string;
    category?: string;
  }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/recetas`, data, { headers });
  }
  getRecetaPorId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/recetas/${id}`);
  }
  getRecetasPorCategoria(categoria: string) {
    return this.http.get<any[]>(`${this.apiUrl}/recetas/categoria/${categoria}`);
  }
  darLike(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/recetas/${id}/like`, {});
  }

  darDislike(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/recetas/${id}/dislike`, {});
  }
  votar(id: number, tipo: number) {
    return this.http.post(`${this.apiUrl}/recetas/${id}/votar`, { tipo });
  }
  actualizarNombre(name: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil/nombre`, { name });
  }
  buscarPorTitulo(titulo: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/recetas/buscar?titulo=${encodeURIComponent(titulo)}`
    );
  }
  toggleFavorito(id: number) {
    return this.http.post(
      `http://localhost:8080/api/recetas/${id}/favoritos`,
      {}
    );
  }
  getFavoritos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/favoritos`);
  }

  /* Estudiar como funciona internamente */
  private refrescarRecetas$ = new BehaviorSubject<void>(undefined);
  refrescarRecetasObs$ = this.refrescarRecetas$.asObservable();

  notificarActualizacion() {
    this.actualizacion.next();
  }
  getRecetasPropias(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/mis-recetas');
  }
  eliminarReceta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/recetas/${id}`);
  }
}
