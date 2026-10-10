#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."
until nc -z postgres 5432; do
  sleep 2
done

npx prisma migrate deploy
exec npm run start:prod
