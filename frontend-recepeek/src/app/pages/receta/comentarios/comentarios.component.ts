import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comentarios.component.html'
})
export class ComentariosComponent implements OnInit {
  @Input() recetaId!: number;

  comentarios: any[] = [];
  nuevoComentario = '';

  constructor(private http: HttpClient) { }

  currentUserId: number | null = null;

  ngOnInit() {
    const user = localStorage.getItem('token'); // Se usa para obtener el usuario logueado
    if (user) {
      this.http.get('http://localhost:8080/api/profile').subscribe({
        next: (res: any) => this.currentUserId = res.id
      });
    }
    this.cargarComentarios();
  }

  cargarComentarios() {
    this.http.get<any[]>(`http://localhost:8080/api/recetas/${this.recetaId}/comentarios`)
      .subscribe({
        next: (res) => this.comentarios = res,
        error: (err) => console.error('Error al cargar comentarios', err)
      });
  }

  enviarComentario() {
    if (!this.nuevoComentario.trim()) return;

    this.http.post(`http://localhost:8080/api/comentarios`, {
      contenido: this.nuevoComentario,
      receta_id: this.recetaId
    }).subscribe({
      next: () => {
        this.nuevoComentario = '';
        this.cargarComentarios();
      },
      error: (err) => console.error('Error al enviar comentario', err)
    });
  }
  eliminarComentario(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este comentario?')) return;

    this.http.delete(`http://localhost:8080/api/comentarios/${id}`).subscribe({
      next: () => this.cargarComentarios(),
      error: (err) => console.error('Error al eliminar comentario', err)
    });
  }

}
