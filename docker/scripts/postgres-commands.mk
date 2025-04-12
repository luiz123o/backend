.PHONY: pg-backup pg-restore pg-list-backups pg-info

# Variáveis
DOCKER = docker
POSTGRES_CONTAINER = subscription-manager-postgres
BACKUP_CONTAINER = subscription-manager-postgres-backup

# Executa backup manual
pg-backup:
	$(DOCKER) start $(BACKUP_CONTAINER)

# Lista backups disponíveis
pg-list-backups:
	$(DOCKER) exec $(POSTGRES_CONTAINER) ls -la /backup

# Restaura backup
pg-restore:
	@echo "Backups disponíveis:"
	@$(DOCKER) exec $(POSTGRES_CONTAINER) ls -la /backup
	@echo ""
	@read -p "Digite o nome do arquivo de backup: " BACKUP_FILE && \
	$(DOCKER) exec -it $(POSTGRES_CONTAINER) /scripts/restore-postgres.sh /backup/$$BACKUP_FILE

# Exibe informações sobre o PostgreSQL
pg-info:
	$(DOCKER) exec $(POSTGRES_CONTAINER) psql -U postgres -c "SELECT version();"
	$(DOCKER) exec $(POSTGRES_CONTAINER) psql -U postgres -c "SELECT datname FROM pg_database;"
	$(DOCKER) exec $(POSTGRES_CONTAINER) psql -U postgres -c "SELECT extname FROM pg_extension;" 