# Design do Sistema - Gestor Fácil de Assinaturas

**Versão:** 1.0
**Data:** 12 de Abril de 2025

## 1. Visão Geral da Arquitetura

### 1.1 Arquitetura Geral
O sistema segue uma arquitetura distribuída com os seguintes componentes principais:
- **Frontend:** Aplicativo móvel (iOS/Android) e Web App
- **Backend:** API RESTful
- **Banco de Dados:** PostgreSQL
- **Serviços Externos:** Open Finance, Notificações, Autenticação

### 1.2 Padrões de Arquitetura
- **Backend:** Clean Architecture com DDD (Domain-Driven Design)
- **Frontend:** MVVM (Mobile) e Component-Based Architecture (Web)
- **Comunicação:** REST + WebSocket (para notificações em tempo real)
- **Autenticação:** JWT + OAuth2

## 2. Entidades Principais

### 2.1 Usuário (User)
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  address?: string;
  zipCode?: string;
  profilePicture?: string;
  subscriptionStatus: 'FREE' | 'PREMIUM';
  subscriptionExpirationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.2 Assinatura (Subscription)
```typescript
interface Subscription {
  id: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
  nextBillingDate: Date;
  categoryId: string;
  notes?: string;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.3 Categoria (Category)
```typescript
interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  userId?: string; // null para categorias padrão
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.4 Transação (Transaction)
```typescript
interface Transaction {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  date: Date;
  description: string;
  categoryId: string;
  source: 'MANUAL' | 'OPEN_FINANCE';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.5 Conta Bancária (BankAccount)
```typescript
interface BankAccount {
  id: string;
  userId: string;
  institutionId: string;
  accountNumber: string;
  accountType: string;
  lastSyncDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 3. Fluxos Principais

### 3.1 Gerenciamento de Usuário
1. **Cadastro**
   - Validação de e-mail
   - Criação de perfil
   - Configuração inicial

2. **Autenticação**
   - Login com e-mail/senha
   - Login social (Google/Apple)
   - Recuperação de senha
   - Renovação de token

3. **Gerenciamento de Assinatura Premium**
   - Ativação via App Store/Play Store
   - Renovação automática
   - Cancelamento
   - Restauração de compras

### 3.2 Gerenciamento de Assinaturas
1. **Cadastro Manual**
   - Validação de dados
   - Categorização
   - Configuração de alertas

2. **Importação via Open Finance**
   - Conexão com instituição
   - Consentimento
   - Detecção automática
   - Confirmação do usuário

3. **Monitoramento**
   - Cálculo de próximos vencimentos
   - Detecção de alterações de preço
   - Identificação de duplicidades

### 3.3 Notificações
1. **Sistema de Alertas**
   - Configuração de preferências
   - Agendamento de notificações
   - Envio multi-canal (Push/Email/Browser)
   - Tracking de entrega

2. **Eventos Notificáveis**
   - Próximo vencimento
   - Alteração de preço
   - Detecção de duplicidade
   - Atualização de status

### 3.4 Relatórios e Análises
1. **Geração de Relatórios**
   - Agregação de dados
   - Cálculo de métricas
   - Formatação para exportação

2. **Insights**
   - Análise de padrões
   - Sugestões de otimização
   - Identificação de oportunidades

## 4. Integrações Externas

### 4.1 Open Finance
- **Autenticação:** OAuth2
- **APIs:** Transações, Saldos, Contas
- **Segurança:** Criptografia de dados
- **Sincronização:** Agendada e sob demanda

### 4.2 Serviços de Notificação
- **Mobile:** Firebase Cloud Messaging (Android) e APNS (iOS)
- **Web:** Browser Notifications API
- **Email:** Serviço de Email Transacional

### 4.3 Autenticação Social
- **Google Sign-In**
- **Sign in with Apple**
- **Token Management**

## 5. Segurança

### 5.1 Proteção de Dados
- Criptografia em trânsito (TLS 1.2+)
- Criptografia em repouso
- Hash de senhas (bcrypt)
- Sanitização de inputs

### 5.2 Controle de Acesso
- RBAC (Role-Based Access Control)
- Validação de tokens JWT
- Rate limiting
- Proteção contra CSRF

### 5.3 Conformidade
- LGPD
- Open Finance Brasil
- PCI DSS (para dados financeiros)

## 6. Escalabilidade

### 6.1 Estratégias
- Cache distribuído (Redis)
- CDN para assets estáticos
- Load balancing
- Sharding de banco de dados

### 6.2 Monitoramento
- Logs centralizados
- Métricas de performance
- Alertas de sistema
- Health checks

## 7. Backup e Recuperação

### 7.1 Estratégia de Backup
- Backup diário completo
- Backup incremental a cada hora
- Retenção de 30 dias
- Backup geograficamente distribuído

### 7.2 Plano de Recuperação
- RTO (Recovery Time Objective): 4 horas
- RPO (Recovery Point Objective): 1 hora
- Testes regulares de recuperação

## 8. Considerações de Desenvolvimento

### 8.1 Ambiente de Desenvolvimento
- Docker para containerização
- CI/CD com GitHub Actions
- Ambientes: Dev, Staging, Production

### 8.2 Qualidade de Código
- Testes automatizados
- Code review obrigatório
- Linting e formatação
- Documentação de APIs

---

**Nota:** Este documento deve ser atualizado conforme o sistema evolui e novas necessidades são identificadas. 