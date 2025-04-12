# Gestor Fácil de Assinaturas (Backend)

API backend para o sistema Gestor Fácil de Assinaturas, desenvolvido com NestJS, TypeORM e PostgreSQL.

## Requisitos

- Node.js 18+
- PostgreSQL 15+
- Redis (opcional, para cache e filas)
- Docker e Docker Compose (recomendado para desenvolvimento)

## Instalação

```bash
# Clonar o repositório
git clone [url-do-repositorio]
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

## Desenvolvimento

```bash
# Iniciar com Docker Compose (recomendado)
docker-compose up -d

# Ou iniciar apenas o banco de dados com Docker
docker-compose up -d postgres

# Iniciar servidor de desenvolvimento
npm run start:dev
```

## Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## Migrations e Banco de Dados

O projeto utiliza TypeORM para ORM e sistema de migrations.

```bash
# Criar uma nova migration
npm run migration:create -- src/database/migrations/NomeDaMigration

# Gerar migration a partir das alterações nas entidades
npm run migration:generate -- src/database/migrations/NomeDaMigration

# Executar migrations pendentes
npm run migration:run

# Reverter última migration
npm run migration:revert
```

.
├── src/
│   ├── main.ts                     # Ponto de entrada
│   ├── app.module.ts               # Módulo principal
│   ├── config/                     # Configurações da aplicação
│   ├── modules/                    # Módulos do domínio
│   │   ├── users/                  # Módulo de usuários
│   │   ├── subscriptions/          # Módulo de assinaturas
│   │   ├── transactions/           # Módulo de transações
│   │   ├── open-finance/           # Módulo de integração Open Finance
│   │   └── notifications/          # Módulo de notificações
│   ├── common/                     # Recursos compartilhados
│   └── database/                   # Configuração de banco de dados
├── test/                           # Testes e2e
├── docs/                           # Documentação
└── docker/                         # Configurações Docker
```

## Documentação

A documentação da API está disponível em `/api/docs` quando o servidor está em execução.

## Licença

[MIT](LICENSE) 