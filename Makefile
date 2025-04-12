.PHONY: up down restart logs ps build clean test test-coverage

# Variáveis
DOCKER_COMPOSE = docker-compose
DOCKER_EXEC = docker exec -it subscription-manager-api
NPM = npm

# Comandos Docker
up:
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

restart:
	$(DOCKER_COMPOSE) restart

logs:
	$(DOCKER_COMPOSE) logs -f

ps:
	$(DOCKER_COMPOSE) ps

build:
	$(DOCKER_COMPOSE) build

clean:
	$(DOCKER_COMPOSE) down -v --remove-orphans

# Comandos do projeto
install:
	$(NPM) install

dev:
	$(NPM) run start:dev

test:
	$(NPM) run test

test-e2e:
	$(NPM) run test:e2e

test-coverage:
	$(NPM) run test:cov

# Comandos Docker + NestJS
exec:
	$(DOCKER_EXEC) sh

exec-test:
	$(DOCKER_EXEC) npm run test

exec-test-e2e:
	$(DOCKER_EXEC) npm run test:e2e

exec-test-coverage:
	$(DOCKER_EXEC) npm run test:cov

# Ajuda
help:
	@echo "Comandos disponíveis:"
	@echo "  up               - Inicia os containers"
	@echo "  down             - Para os containers"
	@echo "  restart          - Reinicia os containers"
	@echo "  logs             - Mostra logs dos containers"
	@echo "  ps               - Lista os containers"
	@echo "  build            - Rebuilda os containers"
	@echo "  clean            - Para e remove containers e volumes"
	@echo "  install          - Instala dependências localmente"
	@echo "  dev              - Inicia servidor de desenvolvimento local"
	@echo "  test             - Executa testes unitários localmente"
	@echo "  test-e2e         - Executa testes e2e localmente"
	@echo "  test-coverage    - Executa testes com cobertura localmente"
	@echo "  exec             - Acessa shell do container api"
	@echo "  exec-test        - Executa testes no container"
	@echo "  exec-test-e2e    - Executa testes e2e no container"
	@echo "  exec-test-coverage - Executa testes com cobertura no container"

# Valor padrão
.DEFAULT_GOAL := help 