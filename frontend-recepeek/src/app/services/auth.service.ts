import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiURL = 'http://localhost:8080/api';

  private currentUser = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiURL}/auth/login`, credentials);
  }

  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiURL}/auth/register`, data);
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiURL}/user`, { headers });
  }

  // Guardar el usuario para que otros componentes lo usen
  setUser(user: any) {
    this.currentUser.next(user);
  }
  // Funcion para guardar el valor del user 
  getUser(): any {
    return this.currentUser.value;
  }
  // Funcion para guardar el token 
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  // Funcion para borrar el token y desloguearse 
  logout() {
    localStorage.removeItem('token');
    this.currentUser.next(null);
  }

}
