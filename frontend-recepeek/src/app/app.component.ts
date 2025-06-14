import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './services/usuario.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  constructor(public router: Router, private usuarioService: UsuarioService) { }
// Funcion para asegurarnos que estamos en el home 
  isMainPage(): boolean {
    return this.router.url === '/home' || this.router.url === '/';
  }
//Funcion que se ejecuta al inciar para guardar el token del usuario
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Si el token del usuario existe, se le llevara al perfil del token 
      this.usuarioService.getPerfil().subscribe({
        next: perfil => this.usuarioService.setUser(perfil), // Si va bien se guarda el perfil en el servicio
        error: () => localStorage.removeItem('token') // Por si el token expiró o el servicio falla, el token se borra
      });
    }
  }
}
