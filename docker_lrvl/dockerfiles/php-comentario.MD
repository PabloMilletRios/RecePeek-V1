# Partimos de la imagen oficial de PHP 8.2 con FPM-alpine

FROM php:8.2-fpm-alpine

# Establecemos el directorio de trabajo dentro del contenedor, donde irá el código de la aplicación

WORKDIR /var/www/html

# Copiamos todos los archivos del proyecto src al directorio de trabajo dentro del contenedor

COPY src .

# Instalamos algunas herramientas y librerías necesarias para que funcionen ciertas extensiones de PHP,

# como la conexión a MySQL, el envío de correos, compresión, procesamiento de imágenes, etc.

# Esto es mayormente por la necesidad del proyecto, pero por anticipacion mejor declararlo antes para evitar futuros problemas, ya que el peso del proyecto apenas se vera aumentado

RUN apk add --no-cache mysql-client msmtp perl wget procps shadow libzip libpng libjpeg-turbo libwebp freetype icu

# Ahora instalamos herramientas necesarias para compilar extensiones de PHP desde código fuente.

# Esto incluye librerías de desarrollo como 'zlib-dev', 'icu-dev', 'libzip-dev', etc.

# También configuramos y activamos varias extensiones:

RUN apk add --no-cache --virtual build-essentials \
    icu-dev icu-libs zlib-dev g++ make automake autoconf libzip-dev \
    libpng-dev libwebp-dev libjpeg-turbo-dev freetype-dev && \
    
    # Configuramos y compilamos la extensión GD (para trabajar con imágenes).
    docker-php-ext-configure gd --enable-gd --with-freetype --with-jpeg --with-webp && \
    docker-php-ext-install gd && \
    
    # Instalamos otras extensiones útiles:
    docker-php-ext-install mysqli && \               # Para conectar con bases de datos MySQL
    docker-php-ext-install pdo_mysql && \            # PDO para trabajar con MySQL de forma más moderna
    docker-php-ext-install intl && \                 # Para manejar fechas, traducciones y otros formatos internacionales
    docker-php-ext-install bcmath && \               # Para operaciones matemáticas más precisas
    docker-php-ext-install opcache && \              # Para mejorar el rendimiento de PHP
    docker-php-ext-install exif && \                 # Para leer metadatos de imágenes (como las de una cámara)
    docker-php-ext-install zip && \                  # Para trabajar con archivos ZIP
    
    # Eliminamos las herramientas de compilación para aligerar la imagen final.
    apk del build-essentials && rm -rf /usr/src/php*

# Aquí instalamos Redis como extensión de PHP, usando PECL(PHP Extension Community Library).

# Redis se usa mucho para cachés o colas de tareas en Laravel y otras apps.

RUN apk add --no-cache pcre-dev $PHPIZE_DEPS && \
    pecl install redis && \
    docker-php-ext-enable redis.so

# Creamos un nuevo usuario laravel para no ejecutar el contenedor como root.

RUN addgroup -g 1000 laravel && adduser -G laravel -g laravel -s /bin/sh -D laravel

# Se le da al usuario laravel permiso sobre los archivos del proyecto.

RUN chown -R laravel /var/www/html

# Por último, cambiamos al usuario laravel para seguir con las prácticas de seguridad.

USER laravel
