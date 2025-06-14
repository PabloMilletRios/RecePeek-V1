# 🍽️ RecePeek

**RecetasPeek** 
Es una plataforma web de recetas colaborativas donde los usuarios pueden publicar, comentar, 
votar y guardar sus recetas favoritas. El sitio está diseñado para ser intuitivo, 
limpio y rápido, adaptándose a cualquier dispositivo, desde escritorio hasta móvil.

---

## ✨ Funcionalidades principales

- 👤 Registro e inicio de sesión con autenticación usando Laravel Sanctum.
- 📄 Publicación de recetas con título, descripción, pasos y categoría.
- 📂 Filtrado por categorías, búsqueda por título.
- 👍 Votaciones con likes/dislikes (1 voto por usuario).
- ⭐ Sistema de favoritos.
- 💬 Sección de comentarios por receta.
- 👨‍🍳 Página de perfil de usuario:
  - Cambiar nombre y contraseña.
  - Subir avatar.
  - Ver recetas propias.
  - Eliminar cuenta.

---

## 🧰 Tecnologías utilizadas

- **Frontend**: Angular 17, Bootstrap 5 (responsive), RxJS.
- **Backend**: Laravel 10 (PHP 8), Sanctum, Eloquent ORM.
- **Base de datos**: MySQL.
- **API REST**: Con protección por middleware `auth:sanctum`.
- **Otras**: Storage público para imágenes (Avatares), CORS middleware, validaciones backend y frontend.

