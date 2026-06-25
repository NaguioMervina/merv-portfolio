#!/bin/sh
set -e

mkdir -p storage/framework/{cache,sessions,testing,views} storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache

exec "$@"
