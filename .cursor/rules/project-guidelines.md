# Diretrizes do Projeto - Gestor Fácil de Assinaturas (Backend)

**Versão:** 1.0
**Data:** 12 de Abril de 2025

## 1. Regras de Desenvolvimento

### 1.1 Fluxo de Trabalho

- O desenvolvimento será baseado em fluxos completos de funcionalidade
- Após cada fluxo concluído, testes com 100% de cobertura devem ser implementados
- O arquivo `project-tasks.md` deve ser atualizado marcando as tarefas concluídas
- Uma nova tarefa só será iniciada mediante comando explícito
- Todas as informações sensíveis devem ser armazenadas em arquivos `.env` (nunca commitados)

### 1.2 Padrões de Código

- Seguir princípios SOLID:
  - **S**ingle Responsibility: Cada classe com responsabilidade única
  - **O**pen/Closed: Extensível sem modificação
  - **L**iskov Substitution: Subtipos usáveis em lugar dos tipos base
  - **I**nterface Segregation: Interfaces específicas são melhores que uma geral
  - **D**ependency Inversion: Depender de abstrações, não implementações

- Seguir Clean Architecture:
  - Separação clara de camadas (controllers, services, repositories)
  - Fluxo de dependência de fora para dentro
  - Regras de negócio isoladas de frameworks

- Padrões de nomenclatura:
  - camelCase para variáveis, métodos e propriedades
  - PascalCase para classes, interfaces e tipos
  - snake_case para arquivos de migração e tabelas no banco
  - SCREAMING_SNAKE_CASE para constantes

### 1.3 Controle de Versão

- Convenção de commits semânticos:
  - `feat`: nova funcionalidade
  - `fix`: correção de bug
  - `refactor`: refatoração sem alteração de funcionalidade
  - `test`: adição ou correção de testes
  - `docs`: atualização de documentação
  - `chore`: alterações de build, configs, etc.

- Branches:
  - `main`: código em produção
  - `develop`: código em desenvolvimento
  - `feature/[nome]`: para novas funcionalidades
  - `bugfix/[nome]`: para correções

### 1.4 Segurança

- Nenhuma credencial deve ser hardcoded (usar `.env`)
- Todas as entradas de usuário devem ser validadas e sanitizadas
- Autenticação JWT com refresh token
- HTTPS para todas as comunicações
- Seguir OWASP Top 10

## 2. Stack Tecnológica

### 2.1 Core

- **Linguagem:** TypeScript 5.0+
- **Runtime:** Node.js 18+ LTS
- **Framework:** NestJS 10+
- **ORM:** TypeORM 0.3+
- **Banco de Dados:** PostgreSQL 15+

### 2.2 Pacotes Principais

- **Autenticação:** Passport.js (JWT, OAuth)
- **Validação:** class-validator, class-transformer
- **Documentação:** Swagger/OpenAPI (@nestjs/swagger)
- **Logging:** Winston
- **Cache:** Redis + @nestjs/cache-manager
- **Filas:** Bull (@nestjs/bull)
- **WebSockets:** Socket.io (@nestjs/websockets)

### 2.3 Testes

- **Unit Testing:** Jest
- **E2E Testing:** Supertest
- **Mocking:** Jest mocks, ts-mockito
- **Coverage:** Jest coverage (100% requerido)

### 2.4 DevOps

- **Containerização:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Linting:** ESLint + Prettier
- **Secrets:** dotenv (.env)

## 3. Configuração do Ambiente

### 3.1 Variáveis de Ambiente (.env)

```
# Ambiente
NODE_ENV=development

# Servidor
PORT=3000
API_PREFIX=api
API_VERSION=v1

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_strong_password
DB_DATABASE=subscription_manager
DB_SSL=false

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASSWORD=your_email_password
SMTP_FROM=noreply@subscriptionmanager.com

# Notificações
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Open Finance
OPEN_FINANCE_BASE_URL=https://api.openfinance.example.com
OPEN_FINANCE_CLIENT_ID=your_client_id
OPEN_FINANCE_CLIENT_SECRET=your_client_secret
```

### 3.2 Docker Compose

Todos os serviços devem ser configurados via Docker Compose para facilitar o desenvolvimento:
- PostgreSQL
- Redis
- API NestJS
- Outros serviços conforme necessário

## 4. Documentação

### 4.1 Documentos de Especificação

- `analise.md`: Requisitos e análise de negócio
- `system-design.md`: Design do sistema/arquitetura
- `database-design.md`: Modelagem de dados
- `backend-architecture.md`: Arquitetura de backend
- `project-tasks.md`: Lista de tarefas e progresso
- `project-guidelines.md`: Este documento (regras e padrões)

### 4.2 Documentação de Código

- Todos os módulos, serviços e métodos públicos devem ser documentados
- Usar JSDoc para documentação inline
- Swagger/OpenAPI para documentação de API

### 4.3 Documentação de API

- Todos os endpoints devem ter:
  - Descrição clara
  - Parâmetros documentados
  - Exemplos de resposta
  - Códigos de erro possíveis

## 5. Qualidade de Código

### 5.1 Testes

- Testes unitários para todas as regras de negócio (services)
- Testes de integração para repositories
- Testes E2E para APIs
- Cobertura de 100% em:
  - Statements
  - Branches
  - Functions
  - Lines

### 5.2 Análise Estática

- ESLint com regras estritas
- Prettier para formatação consistente
- SonarQube ou ferramenta similar (opcional)

### 5.3 Code Review

- Pull Requests para todas as mudanças
- Pelo menos uma aprovação antes de merge
- Verificação de:
  - Testes passando
  - Cobertura de testes
  - Qualidade de código
  - Segurança

## 6. Implantação

### 6.1 Ambientes

- Desenvolvimento (local)
- Homologação/Staging
- Produção

### 6.2 Estratégia de Implantação

- Deploy automatizado via CI/CD
- Migrations automáticas (com rollback em caso de falha)
- Deploy sem downtime (quando possível)

---

Este documento deve ser considerado um contrato para o desenvolvimento. Quaisquer desvios das regras aqui estabelecidas devem ser discutidos e aprovados pela equipe. 