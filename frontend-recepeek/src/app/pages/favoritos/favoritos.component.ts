import { Component, OnInit } from '@angular/core';
import { RecetaService } from '../../services/receta.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favoritos',
  imports: [RouterModule,CommonModule],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent implements OnInit {
  favoritos: any[] = [];

  constructor(private recetaService: RecetaService) {}

  ngOnInit() {
    this.recetaService.getFavoritos().subscribe({
      next: res => this.favoritos = res,
      error: err => console.error('Error al cargar favoritos', err)
    });
  }
}
