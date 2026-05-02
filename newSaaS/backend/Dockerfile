FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    curl \
    git \
    postgresql-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install \
    pdo \
    pdo_pgsql \
    gd \
    opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Create necessary directories
RUN mkdir -p storage/app/private storage/app/public storage/framework/cache storage/framework/sessions storage/framework/testing storage/logs && \
    chmod -R 775 storage bootstrap/cache

# Generate app key and run migrations
RUN php artisan key:generate --force || true

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
