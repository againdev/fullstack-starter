#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [[ ! -f backend/.env || ! -f frontend/.env ]]; then
  echo "Copy backend/.env.example and frontend/.env.example, then fill them in."
  exit 1
fi

docker compose --env-file backend/.env up -d postgres redis adminer postgres-backup
docker compose -f backend/docker-compose.yml --env-file backend/.env up -d --build
docker compose -f frontend/docker-compose.yml --env-file frontend/.env up -d --build
docker compose --env-file backend/.env --profile proxy up -d nginx

docker ps --filter name=app-
