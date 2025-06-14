import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre = '';
  email = '';
  password = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}
 /*Inicializamos la funcion */
  register() {
    this.authService.register({
      /*Guardamos las variables para enviarlas */
      name: this.nombre,
      email: this.email,
      password: this.password
    }).subscribe({
      next: res => {
        /* Redirije al login */
        this.router.navigate(['/login']);
      },
      error: () => {
        this.error = 'Error al registrarse. Revisa las credenciales';
      }
    });
  }
}
