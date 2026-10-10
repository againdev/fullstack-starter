#!/bin/sh
set -e

: "${PG_HOST:?}"
: "${PG_USER:?}"
: "${PG_PASSWORD:?}"
: "${PG_DATABASE:?}"
: "${BACKUP_DIR:?}"

export PGPASSWORD="$PG_PASSWORD"
stamp=$(date +%Y%m%d_%H%M%S)
file="$BACKUP_DIR/backup_${PG_DATABASE}_${stamp}.sql.gz"

pg_dump -h "$PG_HOST" -U "$PG_USER" -d "$PG_DATABASE" | gzip > "$file"
echo "Backup written: $file"

find "$BACKUP_DIR" -type f -name "backup_${PG_DATABASE}_*.sql.gz" -mtime +14 -delete
