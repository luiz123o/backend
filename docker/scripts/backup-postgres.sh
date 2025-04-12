#!/bin/bash

# Configurações
BACKUP_DIR="/backup"
POSTGRES_USER="postgres"
DB_NAME="subscription_manager"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${DATE}.sql"

# Criar diretório de backup se não existir
mkdir -p ${BACKUP_DIR}

# Executar backup
echo "Iniciando backup do banco ${DB_NAME}..."
pg_dump -U ${POSTGRES_USER} -d ${DB_NAME} -f ${BACKUP_FILE}

# Compactar backup
echo "Compactando backup..."
gzip ${BACKUP_FILE}

# Manter apenas os 7 backups mais recentes
echo "Removendo backups antigos..."
ls -t ${BACKUP_DIR}/${DB_NAME}_*.sql.gz | tail -n +8 | xargs -r rm

echo "Backup concluído: ${BACKUP_FILE}.gz" 