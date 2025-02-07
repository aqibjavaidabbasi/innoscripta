# Use the official PHP image with Apache
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

ENV DB_HOST=mysql

# Install dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    netcat-openbsd \ 
    && docker-php-ext-install pdo_mysql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Laravel application files
COPY . .

# Copy and set up the environment file
RUN cp .env.example .env

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# Generate application key
RUN php artisan key:generate

# Set permissions for Laravel storage and bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache

# Expose port 80
EXPOSE 8000

# Run migrations, generate API docs, and start Apache
CMD sh -c "php artisan migrate --force && php artisan scribe:generate && apache2-foreground && php artisan serve --host 0.0.0.0 --port 8000 && php artisan config:clear && php artisan fetch:news"
