import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  //Metodo para interceptar todas las peticiones HTTP que hace Angular 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Obtenemos el token del almacenamiento local
    const token = localStorage.getItem('token'); // O usa un AuthService si prefieres

    if (token) {
      //Si hay toekn, clonamos la peticion original y le añadimos el encabezado
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Añadimos el token al header
        }
      });
      //Enviamos la peticion modificada 
      return next.handle(cloned);
    }
    // Si noy token, se envia la peticion original sin modificar
    return next.handle(req);
  }
}
