import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RecetaComponent } from './pages/receta/receta.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PublicarComponent } from './pages/publicar/publicar.component';
/* Todas las rutas de las diferentes secciones de la pagina */
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'receta/:id', component: RecetaComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'publicar', component: PublicarComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
