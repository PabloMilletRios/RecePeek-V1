# Se usa la imagen de Nginx de Alpine Linux porque pesa poco y es rapida
FROM nginx:stable-alpine

# Cambiamos el directorio donde vamos a trabajar al lugar donde se guardan las configuraciones de Nginx.

WORKDIR /etc/nginx/conf.d

# Copiamos un archivo de configuración personalizado desde el proyecto al contenedor que anteriormente configuramos.
COPY nginx/default.conf .

# Este comando solo se usa para evitar problemas de compatibilidad que en teoria no deberia de haber
RUN mv default.conf default.conf

# Ahora cambiamos el directorio de trabajo a la raíz del sitio web dentro del contenedor.
WORKDIR /var/www/html

# Copiamos todos los archivos de la carpeta "src" al directorio actual del contenedor.
COPY src .
