import { Component, OnInit } from '@angular/core';
import { RecetaService } from '../../services/receta.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  recetas: any[] = [];
  mostrandoFavoritos = false;

  constructor(
    private recetaService: RecetaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const termino = params['buscar']?.toLowerCase() || '';

      this.recetaService.getRecetas().subscribe({
        next: (res) => {
          this.recetas = termino
            ? res.filter((r: any) => r.title.toLowerCase().includes(termino))
            : res;
        },
        error: (err) => console.error('Error cargando recetas', err),
      });
    });
  }

  //Este metodo me ayuda a tener que retocar el Back para simplemente restar

  actualizarRecetas() {
    //Primero se carga todas las recetas
    this.cargarTodasLasRecetas();
    this.recetaService.getRecetas().subscribe({
      next: (res) => {
        this.recetas = res.map((r) => {
          r.likes_count = r.likes_count || 0;
          if (r.liked_by_user === -1) {
            r.likes_count -= 1; // Descuenta dislike del contador
          }
          console.log(r.likes_count);
          return r;
        });
      },
      error: (err) => {
        console.error('Error al cargar recetas', err);
      },
    });
  }
  // Coge el id del usuario para dar like o dislike
  darLike(id: number) {
    this.recetaService.votar(id, 1).subscribe(() => this.actualizarRecetas());
  }
  // Coge el id del usuario para dar like o dislike
  darDislike(id: number) {
    this.recetaService.votar(id, -1).subscribe(() => this.actualizarRecetas());
  }
  // Metodo para cargar las recetas de la base de datos 
  cargarTodasLasRecetas() {
    this.mostrandoFavoritos = false;
    this.recetaService.getRecetas().subscribe({
      next: (data) => (this.recetas = data),
      error: (err) => console.error('Error cargando recetas:', err),
    });
  }

  // Si se entra clica en favoritos se carga este metodo que sustituye el home por las recetas favoritas que el usuario tiene grabadas en la BBDD
  mostrarFavoritos() {
    this.mostrandoFavoritos = true;
    this.recetaService.getFavoritos().subscribe({
      next: (data) => (this.recetas = data),
      error: (err) => console.error('Error cargando favoritos:', err),
    });
  }

  menuLateral = false;
  MostrarCategorias = false;
  filtrarPorCategoria(cat: string) {
    this.menuLateral = false;
    this.recetaService.getRecetasPorCategoria(cat).subscribe({
      next: (res) => (this.recetas = res),
      error: (err) => console.error(err),
    });
  }
}
