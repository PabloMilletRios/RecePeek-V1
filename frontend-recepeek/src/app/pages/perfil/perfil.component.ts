import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { RecetaService } from '../../services/receta.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
})
export class PerfilComponent implements OnInit {
  perfil: any = null;
  recetasPropias: any[] = [];
  seccion: 'recetas' | 'ajustes' = 'recetas';

  password = {
    actual: '',
    nueva: '',
    confirmacion: '',
  };

  constructor(
    private usuarioService: UsuarioService,
    private recetaService: RecetaService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
    this.cargarRecetasPropias();
  }

  cargarPerfil() {
    this.usuarioService.getPerfil().subscribe((perfil) => {
      this.perfil = perfil;
      this.perfil.avatarUrl = perfil.avatar
        ? `http://localhost:8080/storage/${perfil.avatar}`
        : null;
    });
  }

  cargarRecetasPropias() {
    this.recetaService.getRecetasPropias().subscribe({
      next: (res) => (this.recetasPropias = res),
      error: (err) => console.error('Error al cargar recetas propias', err),
    });
  }

  guardarNombre() {
    this.usuarioService.actualizarNombre(this.perfil.name).subscribe({
      next: () => {
        alert('Nombre actualizado con éxito');

        // Volvemos a pedir el perfil actualizado
        this.usuarioService.getPerfil().subscribe((perfilActualizado) => {
          this.perfil = perfilActualizado;
          this.perfil.avatarUrl = perfilActualizado.avatar
            ? `http://localhost:8080/storage/${perfilActualizado.avatar}`
            : null;

          // 🔁 Actualizar el usuario global (nav bar)
          this.authService.setUser(perfilActualizado);
        });
      },
      error: () => alert('Error al actualizar el nombre'),
    });
  }

  cambiarPassword() {
    this.usuarioService
      .cambiarPassword({
        current_password: this.password.actual,
        new_password: this.password.nueva,
        new_password_confirmation: this.password.confirmacion,
      })
      .subscribe({
        next: () => alert('Contraseña actualizada'),
        error: (err) =>
          alert(err.error?.error || 'Error al cambiar contraseña'),
      });
  }

  eliminarCuenta() {
    if (
      !confirm(
        '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
      )
    )
      return;

    this.usuarioService.eliminarCuenta().subscribe({
      next: () => {
        alert('Cuenta eliminada correctamente');
        // Cerrar sesión y redirigir
        location.href = '/';
      },
      error: () => alert('Error al eliminar la cuenta'),
    });
  }

  cambiarSeccion(nombre: 'recetas' | 'ajustes') {
    this.seccion = nombre;
  }
  eliminar(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      this.recetaService.eliminarReceta(id).subscribe(() => {
        this.recetasPropias = this.recetasPropias.filter((r) => r.id !== id);
      });
    }
  }
}
