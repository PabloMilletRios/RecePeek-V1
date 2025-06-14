import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecetaService } from '../../services/receta.service';
import { CommonModule } from '@angular/common';
import { ComentariosComponent } from './comentarios/comentarios.component';

@Component({
  selector: 'app-receta-detalle',
  standalone: true,
  imports: [CommonModule, ComentariosComponent],
  templateUrl: './receta.component.html',
})
export class RecetaComponent implements OnInit {
  receta: any = null;
  loading = true;
  esFavorito = false;

  constructor(
    private route: ActivatedRoute,
    private recetaService: RecetaService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recetaService.getRecetaPorId(id).subscribe({
        next: (res) => {
          this.receta = res;
          this.loading = false;

          // Verificar si es favorito
          this.recetaService.getFavoritos().subscribe((favoritos: any[]) => {
            this.esFavorito = favoritos.some(f => f.id === res.id);
          });
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  toggleFavorito() {
    if (!this.receta) return;
    this.recetaService.toggleFavorito(this.receta.id).subscribe(() => {
      this.esFavorito = !this.esFavorito;
    });
  }

  darLike() {
    if (!this.receta) return;
    this.recetaService.darLike(this.receta.id).subscribe(() => {
      this.receta.likes_count++;
      this.receta.liked_by_user = 1;
      this.recetaService.notificarActualizacion();
    });
  }

  darDislike() {
    if (!this.receta) return;
    this.recetaService.darDislike(this.receta.id).subscribe(() => {
      this.receta.likes_count = Math.max(0, this.receta.likes_count - 1);
      this.receta.liked_by_user = -1;
      this.recetaService.notificarActualizacion();
    });
  }
}
