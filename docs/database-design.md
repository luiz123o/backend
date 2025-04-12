# Modelagem de Dados - Gestor Fácil de Assinaturas

**Versão:** 1.0
**Data:** 12 de Abril de 2025

## 1. Visão Geral do Banco de Dados

### 1.1 Tecnologia
- **SGBD:** PostgreSQL 15+
- **Extensões:**
  - `uuid-ossp` (para UUIDs)
  - `pgcrypto` (para criptografia)
  - `pg_trgm` (para busca por similaridade)

### 1.2 Convenções
- Todas as tabelas possuem `id` (UUID), `created_at` e `updated_at`
- Nomes de tabelas no plural, em snake_case
- Chaves estrangeiras: `{tabela}_id`
- Índices: `idx_{tabela}_{colunas}`

## 2. Modelo de Dados

### 2.1 Tabela: users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    zip_code VARCHAR(10),
    profile_picture_url TEXT,
    subscription_status VARCHAR(10) NOT NULL DEFAULT 'FREE' CHECK (subscription_status IN ('FREE', 'PREMIUM')),
    subscription_expiration_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
```

### 2.2 Tabela: categories
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_default_category UNIQUE (name, is_default) WHERE is_default = true
);

CREATE INDEX idx_categories_user_id ON categories(user_id);
```

### 2.3 Tabela: subscriptions
```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL')),
    next_billing_date TIMESTAMP WITH TIME ZONE NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id),
    notes TEXT,
    icon_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_category_id ON subscriptions(category_id);
CREATE INDEX idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);
```

### 2.4 Tabela: transactions
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id),
    source VARCHAR(20) NOT NULL CHECK (source IN ('MANUAL', 'OPEN_FINANCE')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_subscription_id ON transactions(subscription_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_transaction_date ON transactions(transaction_date);
```

### 2.5 Tabela: bank_accounts
```sql
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institution_id VARCHAR(50) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    last_sync_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_bank_account UNIQUE (user_id, institution_id, account_number)
);

CREATE INDEX idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX idx_bank_accounts_institution_id ON bank_accounts(institution_id);
```

### 2.6 Tabela: notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('BILLING_REMINDER', 'PRICE_CHANGE', 'DUPLICATE_DETECTED', 'STATUS_UPDATE')),
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_subscription_id ON notifications(subscription_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

### 2.7 Tabela: notification_preferences
```sql
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('EMAIL', 'PUSH', 'BROWSER')),
    type VARCHAR(50) NOT NULL CHECK (type IN ('BILLING_REMINDER', 'PRICE_CHANGE', 'DUPLICATE_DETECTED', 'STATUS_UPDATE')),
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    days_before INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_notification_preference UNIQUE (user_id, channel, type)
);

CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);
```

## 3. Triggers e Funções

### 3.1 Atualização Automática de updated_at
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Repetir para outras tabelas...
```

### 3.2 Cálculo de Próxima Data de Cobrança
```sql
CREATE OR REPLACE FUNCTION calculate_next_billing_date(
    current_date TIMESTAMP WITH TIME ZONE,
    billing_cycle VARCHAR(20)
)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
    RETURN CASE billing_cycle
        WHEN 'MONTHLY' THEN current_date + INTERVAL '1 month'
        WHEN 'QUARTERLY' THEN current_date + INTERVAL '3 months'
        WHEN 'SEMI_ANNUAL' THEN current_date + INTERVAL '6 months'
        WHEN 'ANNUAL' THEN current_date + INTERVAL '1 year'
    END;
END;
$$ LANGUAGE plpgsql;
```

## 4. Índices e Otimizações

### 4.1 Índices de Texto
```sql
-- Para busca por similaridade em nomes de assinaturas
CREATE INDEX idx_subscriptions_name_trgm ON subscriptions USING gin (name gin_trgm_ops);

-- Para busca por similaridade em descrições de transações
CREATE INDEX idx_transactions_description_trgm ON transactions USING gin (description gin_trgm_ops);
```

### 4.2 Particionamento
```sql
-- Particionamento de transações por mês (para grandes volumes)
CREATE TABLE transactions_y2025m01 PARTITION OF transactions
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Adicionar novas partições conforme necessário
```

## 5. Políticas de Segurança

### 5.1 Row Level Security (RLS)
```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso
CREATE POLICY users_policy ON users
    USING (id = current_user_id());

-- Repetir para outras tabelas...
```

## 6. Migrações e Versionamento

### 6.1 Estrutura de Migrações
```
migrations/
├── 001_initial_schema.sql
├── 002_add_notification_preferences.sql
├── 003_add_transaction_partitioning.sql
└── ...
```

### 6.2 Exemplo de Migração
```sql
-- migrations/001_initial_schema.sql
BEGIN;

-- Criar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Criar tabelas (como definido acima)
-- ...

COMMIT;
```

---

**Nota:** Este documento deve ser atualizado conforme o sistema evolui e novas necessidades são identificadas. 