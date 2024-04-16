# Use an official PHP runtime as a parent image, with FPM
FROM php:8.2-fpm as container-setup

ARG user=docker-user

RUN apt update -y
RUN apt install -y \
    zip \
    unzip \
    git

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt install -y nodejs

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

FROM container-setup

ARG user=docker-user

RUN docker-php-ext-install pdo pdo_mysql 
RUN docker-php-ext-enable pdo pdo_mysql

WORKDIR /var/www

# use different user to avoid permission problems and allow composer commands
RUN useradd -G www-data,root $user
RUN mkdir -p /home/$user/.composer
RUN chown -R $user:$user /home/$user

USER $user

CMD ["php-fpm"]