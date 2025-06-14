import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private api = 'http://localhost:8080/api';

  private currentUser = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {}
// Funcion para devolver el perfil
  getPerfil(): Observable<any> {
    return this.http.get(`${this.api}/profile`);
  }
  // Funcion para devolver el nombre
  actualizarNombre(name: string): Observable<any> {
    return this.http.put(`${this.api}/perfil/nombre`, { name });
  }
  // Funcion para devolver la contraseña
  cambiarPassword(payload: any): Observable<any> {
    return this.http.post(`${this.api}/perfil/password`, payload);
  }
  // Funcion para el login del usuario guardando el login 
  loginUser(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>(
      'http://localhost:8080/api/auth/login',
      credentials
    );
  }

  /*Refrescar la pagina */
  setUser(user: any) {
    this.currentUser.next(user);
  }

  getUser(): any {
    return this.currentUser.value;
  }
// Funcion para borrar el perfil 
  eliminarCuenta(): Observable<any> {
    return this.http.delete(`${this.api}/perfil`);
  }
}
