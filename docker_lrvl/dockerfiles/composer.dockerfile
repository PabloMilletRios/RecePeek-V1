# Usamos la imagen oficial de composer en su ultima version , esta herramienta se usa en PHP para gestionar dependencias.
FROM composer:latest

# Creamos un nuevo grupo llamado "laravel" con el ID 1000 y también un nuevo usuario que pertenezca a ese grupo.
# Esto se usa para evitar usar el usuario root dentro del contenedor, lo cual es una buena práctica por temas de seguridad.
RUN addgroup -g 1000 laravel && adduser -G laravel -g laravel -s /bin/sh -D laravel

# Cambiamos al usuario laravel que acabamos de crear
USER laravel

# Establecemos el directorio de trabajo dentro del contenedor. Aquí es donde se va a ejecutar Composer.
WORKDIR /var/www/html

# Este entrypoint hace que cada vez que se inicie el contenedor, se ejecute composer automáticamente.
# El parámetro "--ignore-platform-reqs" sirve para que Composer no dé errores si faltan algunas extensiones o versiones específicas del sistema.
ENTRYPOINT [ "composer", "--ignore-platform-reqs" ]
