import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        // Guardamos el token
        this.authService.saveToken(res.token);

        // Cargamos perfil del usuario
        this.authService.getProfile().subscribe({
          next: (user) => {
            this.authService.setUser(user); //Esto activa el BehaviorSubject(compartir datos entre componentes o servicios)
            this.router.navigate(['/']);    // Redirigimos al home
          },
          error: () => {
            this.error = 'Error al obtener perfil';
          }
        });
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
      }
    });
  }
}
