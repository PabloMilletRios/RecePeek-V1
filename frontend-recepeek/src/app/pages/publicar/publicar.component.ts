import { Component } from '@angular/core';
import { RecetaService } from '../../services/receta.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ IMPORTA CommonModule

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule], // ✅ AÑADE CommonModule aquí
})
export class PublicarComponent {
  receta = {
    title: '',
    description: '',
    steps: '',
    category: ''
  };

  mensaje = '';

  constructor(private recetaService: RecetaService) { }

  publicarReceta() {
    const recetaPayload = {
      user_id: 1,
      title: this.receta.title,
      description: this.receta.description,
      steps: this.receta.steps,
      category: this.receta.category
    };

    this.recetaService.crearReceta(recetaPayload).subscribe({
      next: () => {
        this.mensaje = 'Receta publicada con éxito.';
        this.receta = { title: '', description: '', steps: '', category: '' };
      },
      error: (error) => {
        console.error(error);
        this.mensaje = 'Hubo un error al publicar la receta.';
      }
    });
  }
}
