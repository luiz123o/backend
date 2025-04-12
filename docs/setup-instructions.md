# Instruções de Configuração do Ambiente

## Requisitos

- Node.js 18+ LTS
- Docker
- Docker Compose
- Git

## Instalação no Windows com WSL2

1. **Instalar o WSL2**:
   
   No PowerShell com permissões de administrador:
   ```powershell
   wsl --install
   ```

2. **Instalar o Docker Desktop para Windows**:
   - Baixe e instale o [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Nas configurações do Docker Desktop, habilite a integração com WSL2
   - Certifique-se de marcar a distribuição Linux que você está usando

3. **Configurar o ambiente de desenvolvimento**:
   ```bash
   # Clonar o repositório
   git clone [url-do-repositorio]
   cd backend
   
   # Iniciar os serviços com Docker Compose
   docker-compose up -d
   ```

## Instalação no Linux

1. **Instalar o Docker**:
   ```bash
   sudo apt update
   sudo apt install docker.io
   sudo systemctl enable --now docker
   sudo usermod -aG docker $USER
   # Fazer logout e login novamente para aplicar as permissões
   ```

2. **Instalar o Docker Compose**:
   ```bash
   sudo apt install docker-compose-plugin
   ```

3. **Instalar o Node.js 18 LTS**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Configurar o ambiente de desenvolvimento**:
   ```bash
   # Clonar o repositório
   git clone [url-do-repositorio]
   cd backend
   
   # Iniciar os serviços com Docker Compose
   docker compose up -d
   ```

## Comandos Úteis

### Docker
- `docker compose up -d`: Inicia todos os serviços em background
- `docker compose down`: Para todos os serviços
- `docker compose logs -f`: Mostra logs contínuos de todos os serviços

### NestJS
- `npm run start:dev`: Inicia o servidor em modo de desenvolvimento
- `npm run test`: Executa testes unitários
- `npm run test:e2e`: Executa testes end-to-end

### PostgreSQL
- `make pg-backup`: Executa backup manual
- `make pg-restore`: Restaura backup existente
- `make pg-list-backups`: Lista backups disponíveis
- `make pg-info`: Mostra informações sobre o PostgreSQL

### Makefile
O projeto contém um Makefile com diversos comandos úteis. Use `make help` para obter uma lista completa. 