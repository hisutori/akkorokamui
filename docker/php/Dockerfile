FROM clearlinux/php-fpm
RUN swupd bundle-add php-extras
RUN mkdir -p /etc/php.d

COPY docker/php/apcu.ini /etc/php.d/apcu.ini
COPY src /var/www/html
