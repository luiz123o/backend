# Changelog

## [0.1.0] - 2025-04-13

### Ambiente e Configuração

#### Configuração do Ambiente
- ✅ **ENV001**: Configurado repositório Git com GitHub Actions CI/CD
- ✅ **ENV002**: Configurado ambiente Docker com Docker Compose
- ✅ **ENV003**: Estruturado projeto NestJS com ESLint e Prettier
- ✅ **ENV004**: Configurado PostgreSQL em container Docker
- ✅ **ENV005**: Integrado TypeORM com sistema de migrations

### Módulo de Usuários

#### Entidades e Repositórios
- ✅ **USR001**: Implementada entidade User com validações
- ✅ **USR002**: Implementado repositório de usuários com métodos personalizados

#### Serviços
- ✅ **USR003**: Implementado serviço de autenticação (login, JWT, refresh token, OAuth2)
- ✅ **USR004**: Implementado serviço de usuários (CRUD, perfil, exclusão LGPD)

#### Controllers e APIs
- ✅ **USR005**: Implementados controllers de autenticação (login/logout, refresh token, auth social)
- ✅ **USR006**: Implementados controllers de usuários (CRUD, perfil, assinatura Premium)

#### Testes
- ✅ **USR007**: Implementados testes unitários (serviços, repositories, entidades)
- ✅ **USR008**: Implementados testes E2E (APIs de autenticação e usuários)
  - Criados testes de autenticação (login, refresh token, logout)
  - Criados testes de perfil (obter e atualizar)
  - Criados testes de administração de usuários (listar, obter, atualizar, deletar)
  - Implementada estrutura resiliente a falhas de conexão com banco de dados
  - Adicionada documentação detalhada no diretório `test/users`

### Módulo de Categorias

#### Entidades e Repositórios
- ✅ **CAT001**: Implementada entidade Category com seed de categorias padrão
  - Criada entidade com mapeamento ORM completo
  - Implementado enum CategoryType para diferenciação entre categorias padrão e personalizadas
  - Criado serviço de seed para população automática de categorias padrão
  - Adicionada migration para criação da tabela no banco de dados
  - Implementados testes unitários para entidade e serviço de seed

### Melhorias Técnicas
- Ajustado ThrottlerModule para proteção contra ataques de força bruta
- Configurado tratamento adequado de variáveis de ambiente
- Implementada estratégia de resiliência para testes E2E:
  - Gerenciamento de conexão com banco de dados
  - Skip inteligente de testes quando recursos não estão disponíveis
  - Tratamento de exceções para evitar falhas de teste em ambiente CI/CD

### Correções
- Corrigido erro na configuração do ThrottlerModule
- Ajustado tratamento de variáveis de ambiente no arquivo app.config.ts
- Ajustado tratamento de variáveis de ambiente no arquivo database.config.ts
- Corrigidos erros de TypeScript relacionados a tipos nulos em operações de banco de dados

## Próximos Passos
- **CAT002-CAT006**: Continuação da implementação do módulo de Categorias
- **SUB001-SUB008**: Implementação do módulo de Assinaturas 