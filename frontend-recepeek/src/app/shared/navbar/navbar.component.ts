import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  user: any = null;
  menuAbierto = false;
  terminoBusqueda: string = '';
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
// Funcion para buscar palabras claves y recoger recetas que las contengan 
  buscar() {
    if (!this.terminoBusqueda.trim()) return;

    // Redirigimos al home y pasamos la búsqueda como query param
    this.router.navigate(['/'], {
      queryParams: { buscar: this.terminoBusqueda },
    });
  }
//Funcion para el funcionamiento del modo oscuro
  toggleTheme(): void {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');

    if (isDark) {
      body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
  }
// Al iniciarse guardaremos la datos del usuario 
  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });

    // Aplicar el tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    }

    if (!this.user && this.authService.getToken()) {
      this.authService.getProfile().subscribe({
        next: (user) => this.authService.setUser(user),
        error: () => this.authService.logout(),
      });
    }
  }
// Funcion para deslogearse
  logout() {
    this.authService.logout();
  }
 // Funcion para redirigir al home 
  irAlHome() {
    this.router.navigate(['/'], { queryParams: {} });
  }
}
