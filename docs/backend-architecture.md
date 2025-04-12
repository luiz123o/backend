# Arquitetura de Backend - Gestor Fácil de Assinaturas

**Versão:** 1.0
**Data:** 12 de Abril de 2025

## 1. Visão Geral

Após análise dos requisitos do sistema e considerando as necessidades de escalabilidade, segurança e manutenção, recomendo uma arquitetura baseada em NestJS com TypeORM para o backend do "Gestor Fácil de Assinaturas".

## 2. Stack Tecnológica Recomendada

### 2.1 Framework: NestJS

O NestJS é recomendado pelos seguintes motivos:

- **Arquitetura modular:** Facilita a implementação dos princípios DDD e Clean Architecture.
- **TypeScript nativo:** Forte tipagem e melhor segurança de código.
- **Injeção de dependência:** Facilita testes e desacoplamento.
- **Middleware robustos:** Para autenticação, validação, etc.
- **Escalabilidade:** Arquitetura que suporta crescimento do sistema.
- **Documentação automática:** Integração com Swagger/OpenAPI.
- **WebSockets integrados:** Para notificações em tempo real.
- **Suporte a microserviços:** Possibilidade de evolução arquitetural.
- **Comunidade ativa:** Ecossistema em crescimento e suporte.

### 2.2 ORM: TypeORM

O TypeORM é a melhor escolha pelos seguintes motivos:

- **Compatibilidade com TypeScript:** Integridade tipo-segura com entidades.
- **Suporte a PostgreSQL:** Aproveitamento das features avançadas do PostgreSQL.
- **Migrations robustas:** Gerenciamento de evolução do banco de dados.
- **Relações complexas:** Suporte a todas as relações necessárias no modelo.
- **Repository Pattern:** Alinhado com os princípios de Clean Architecture.
- **QueryBuilder flexível:** Para consultas complexas quando necessário.
- **Transações:** Gerenciamento de transações para operações compostas.
- **Listeners e Subscribers:** Para implementação de triggers equivalentes.

### 2.3 Outras Tecnologias Complementares

- **Autenticação:** Passport.js (JWT, OAuth)
- **Validação:** class-validator e class-transformer
- **Documentação:** Swagger/OpenAPI (NestJS integra nativamente)
- **Logging:** Winston
- **Monitoramento:** Prometheus + Grafana
- **Cache:** Redis
- **Filas:** Bull (baseado em Redis) para processamento assíncrono
- **Testes:** Jest (Unit), Supertest (E2E)
- **CI/CD:** GitHub Actions

## 3. Estrutura de Diretórios

```
src/
├── app.module.ts               # Módulo principal
├── main.ts                     # Ponto de entrada
├── config/                     # Configurações da aplicação
├── modules/                    # Módulos do domínio
│   ├── users/                  # Módulo de usuários
│   │   ├── dto/                # Objetos de transferência de dados
│   │   ├── entities/           # Entidades do módulo
│   │   ├── repositories/       # Repositories personalizados
│   │   ├── services/           # Serviços de domínio
│   │   ├── controllers/        # Controllers REST
│   │   └── users.module.ts     # Definição do módulo
│   ├── subscriptions/          # Módulo de assinaturas
│   ├── transactions/           # Módulo de transações
│   ├── open-finance/           # Módulo de integração Open Finance
│   └── notifications/          # Módulo de notificações
├── common/                     # Recursos compartilhados
│   ├── decorators/             # Decorators personalizados
│   ├── filters/                # Filtros de exceção
│   ├── guards/                 # Guards de autorização
│   ├── interceptors/           # Interceptores
│   ├── interfaces/             # Interfaces comuns
│   └── utils/                  # Utilitários
└── database/                   # Configuração de banco de dados
    ├── migrations/             # Migrations do TypeORM
    └── seeds/                  # Dados iniciais
```

## 4. Padrões e Práticas

### 4.1 Arquitetura de Camadas

Recomendo uma arquitetura em camadas seguindo princípios do Clean Architecture:

1. **Controllers (API Layer):** Responsáveis pela exposição dos endpoints REST
2. **Services (Application Layer):** Lógica de negócio e orquestração de repositories
3. **Repositories (Data Layer):** Interação com o banco de dados
4. **Entities (Domain Layer):** Modelos de domínio com regras de negócio

### 4.2 DTOs e Validação

- DTOs para entrada (RegisterUserDto, CreateSubscriptionDto)
- DTOs para saída (UserResponseDto, SubscriptionResponseDto)
- Validação via class-validator com decorators

```typescript
// Exemplo de DTO com validação
export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string = 'BRL';

  @IsNotEmpty()
  @IsEnum(['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL'])
  billingCycle: string;

  @IsNotEmpty()
  @IsDateString()
  nextBillingDate: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
```

### 4.3 Autenticação e Autorização

- JWT para tokens de acesso
- Refresh tokens para revalidação
- Guards para controle de acesso baseado em perfil
- Interceptores para auditoria de acesso

### 4.4 Tratamento de Exceções

- Filtros de exceção globais
- Mensagens de erro padronizadas
- Logging de erros centralizado

## 5. Mapeamento Entidade-Relação (TypeORM)

### 5.1 Exemplo: Entidade User

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ length: 255, nullable: false, unique: true })
  email: string;

  @Column({ name: 'password_hash', nullable: false })
  passwordHash: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'zip_code', length: 10, nullable: true })
  zipCode: string;

  @Column({ name: 'profile_picture_url', nullable: true })
  profilePictureUrl: string;

  @Column({
    name: 'subscription_status',
    type: 'enum',
    enum: ['FREE', 'PREMIUM'],
    default: 'FREE'
  })
  subscriptionStatus: string;

  @Column({ name: 'subscription_expiration_date', nullable: true })
  subscriptionExpirationDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Subscription, subscription => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => Category, category => category.user)
  categories: Category[];

  // Métodos de negócio
  isSubscriptionActive(): boolean {
    return (
      this.subscriptionStatus === 'PREMIUM' &&
      this.subscriptionExpirationDate > new Date()
    );
  }
}
```

### 5.2 Repositories Personalizados

```typescript
@EntityRepository(Subscription)
export class SubscriptionRepository extends Repository<Subscription> {
  async findUpcomingBillings(userId: string, days: number): Promise<Subscription[]> {
    const date = new Date();
    const futureDate = new Date();
    futureDate.setDate(date.getDate() + days);

    return this.createQueryBuilder('subscription')
      .where('subscription.user_id = :userId', { userId })
      .andWhere('subscription.next_billing_date BETWEEN :date AND :futureDate', { date, futureDate })
      .andWhere('subscription.is_active = true')
      .orderBy('subscription.next_billing_date', 'ASC')
      .getMany();
  }
}
```

## 6. Estratégias de Implementação

### 6.1 API RESTful

- Seguir princípios REST
- Versionamento de API (/api/v1)
- Paginação, ordenação e filtros padronizados

### 6.2 Processamento Assíncrono

- Filas com Bull para tarefas pesadas:
  - Envio de notificações
  - Processamento de dados Open Finance
  - Geração de relatórios

### 6.3 WebSockets para Notificações

```typescript
@WebSocketGateway({ namespace: 'notifications' })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Autenticação e registro do cliente
  }

  handleDisconnect(client: Socket) {
    // Limpeza de recursos
  }

  // Método para enviar notificação a um usuário específico
  sendNotificationToUser(userId: string, notification: Notification) {
    this.server.to(`user-${userId}`).emit('notification', notification);
  }
}
```

### 6.4 Integração com Open Finance

- Serviço dedicado para integração
- Middleware de autenticação OAuth2
- Estratégias de retry e circuit breaker

## 7. Escalabilidade e Performance

### 7.1 Estratégias de Cache

- Cache de queries frequentes com Redis
- Cache de sessão
- Cache de dados estáticos

### 7.2 Otimização de Consultas

- Uso adequado de índices
- Consultas N+1 evitadas via eager loading
- Query builder para consultas complexas

### 7.3 Escalabilidade Horizontal

- Containers stateless
- Configuração via variáveis de ambiente
- Load balancing

## 8. Monitoramento e Logging

- Integração com New Relic ou Datadog
- Logs estruturados (JSON)
- Métricas para principais operações
- Alertas para problemas críticos

## 9. Considerações de Segurança

- Sanitização de inputs
- Rate limiting
- CSRF e XSS Protection
- Security headers
- Auditoria de acessos sensíveis

## 10. Testes

### 10.1 Estratégia de Testes

- Testes unitários para serviços e lógica de negócio
- Testes de integração para repositories
- Testes e2e para APIs
- Mocks para serviços externos

### 10.2 Cobertura de Testes

- Mínimo de 80% de cobertura de código
- Testes automatizados em pipeline CI/CD

---

**Nota:** Esta arquitetura sugerida fornece um equilíbrio entre facilidade de desenvolvimento, manutenibilidade e escalabilidade. O NestJS com TypeORM oferece um caminho claro para implementar os requisitos do sistema e permite extensões futuras conforme o aplicativo cresce. 