-- Criar banco de dados para testes
CREATE DATABASE subscription_manager_test
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TEMPLATE = template0;

-- Conceder privilégios
GRANT ALL PRIVILEGES ON DATABASE subscription_manager_test TO postgres;

-- Conectar ao banco de testes para criar extensões
\c subscription_manager_test;

-- Criar extensões no banco de testes
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; 