#!/bin/bash

# Verifica se foi fornecido um arquivo de backup
if [ $# -ne 1 ]; then
    echo "Uso: $0 <arquivo_backup.sql.gz>"
    echo "Backups disponíveis:"
    ls -la /backup/*.sql.gz 2>/dev/null || echo "Nenhum backup encontrado!"
    exit 1
fi

BACKUP_FILE=$1
POSTGRES_USER="postgres"
DB_NAME="subscription_manager"

# Verifica se o arquivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Arquivo de backup não encontrado: $BACKUP_FILE"
    exit 1
fi

# Extrair o backup
echo "Extraindo backup..."
gunzip -c "$BACKUP_FILE" > /tmp/restore.sql

# Restaurar o backup
echo "Restaurando backup para o banco $DB_NAME..."
echo "ATENÇÃO: Isso substituirá todos os dados existentes!"
read -p "Deseja continuar? (s/n): " CONFIRM

if [ "$CONFIRM" = "s" ] || [ "$CONFIRM" = "S" ]; then
    # Recria o banco de dados
    PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USER -c "DROP DATABASE IF EXISTS $DB_NAME;"
    PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USER -c "CREATE DATABASE $DB_NAME;"
    
    # Restaura o backup
    PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USER -d $DB_NAME -f /tmp/restore.sql
    
    # Remove arquivo temporário
    rm /tmp/restore.sql
    
    echo "Backup restaurado com sucesso!"
else
    echo "Operação cancelada."
    rm /tmp/restore.sql
fi 