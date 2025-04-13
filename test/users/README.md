# End-to-End Tests - Módulo de Usuários

Este diretório contém testes end-to-end (E2E) para o módulo de usuários da aplicação. Os testes E2E são essenciais para verificar se a API se comporta conforme esperado do ponto de vista do cliente, testando desde a requisição HTTP até a resposta, passando por todas as camadas da aplicação.

## Estrutura dos Testes

Os testes E2E estão divididos em dois arquivos principais:

1. **auth.e2e-spec.ts**: Testes para endpoints de autenticação
2. **users.e2e-spec.ts**: Testes para endpoints de gerenciamento de usuários

## Configuração dos Testes

Todos os testes seguem um padrão similar:

1. Antes de todos os testes (`beforeAll`):
   - Inicializa o módulo da aplicação NestJS
   - Configura o ambiente de teste
   - Cria usuários de teste no banco de dados
   - Obtém tokens de autenticação quando necessário

2. Após todos os testes (`afterAll`):
   - Limpa os dados de teste do banco de dados
   - Fecha a aplicação

## Testes de Autenticação (auth.e2e-spec.ts)

### Endpoints Testados

- `POST /auth/login`: Login com email e senha
- `POST /auth/refresh-token`: Renovação de tokens com refresh token
- `POST /auth/logout`: Logout (invalidação de token)

### Cenários Testados

- Login com credenciais válidas
- Falha de login com credenciais inválidas
- Renovação de tokens com refresh token válido
- Falha de renovação com refresh token inválido
- Logout com token de acesso válido
- Falha de logout com token inválido

## Testes de Usuários (users.e2e-spec.ts)

### Endpoints Testados

- `GET /users/profile/me`: Obter perfil do usuário autenticado
- `PATCH /users/profile/me`: Atualizar perfil do usuário autenticado
- `GET /users`: Listar todos os usuários (admin)
- `GET /users/:id`: Obter usuário específico (admin)
- `PATCH /users/:id`: Atualizar usuário (admin)
- `DELETE /users/:id`: Remover usuário (admin)

### Cenários Testados

- Acesso ao perfil do usuário autenticado
- Rejeição de requisições não autenticadas
- Atualização de perfil com dados válidos
- Rejeição de dados inválidos
- Acesso de administrador para listar usuários
- Rejeição de acesso para usuários não-admin
- Atualização de usuário por administrador
- Exclusão de usuário por administrador

## Execução dos Testes

Para executar os testes E2E do módulo de usuários:

```bash
npm run test:e2e -- test/users
```

Para executar um arquivo de teste específico:

```bash
npm run test:e2e -- test/users/auth.e2e-spec.ts
```

## Considerações

- Os testes E2E dependem de um banco de dados configurado
- Os testes criam e removem seus próprios dados de teste
- O ambiente de teste é isolado do ambiente de desenvolvimento/produção 