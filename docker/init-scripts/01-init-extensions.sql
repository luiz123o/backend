-- Script para criar extensões necessárias no PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Configurações adicionais para melhoria de performance
ALTER SYSTEM SET max_connections = '100';
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '16MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET default_statistics_target = 100;

-- Configurações de locale e timezone
ALTER SYSTEM SET timezone = 'America/Sao_Paulo';
ALTER SYSTEM SET lc_messages = 'en_US.UTF-8';
-- Usar locale que temos certeza que existe na imagem
ALTER SYSTEM SET lc_monetary = 'en_US.UTF-8';
ALTER SYSTEM SET lc_numeric = 'en_US.UTF-8';
ALTER SYSTEM SET lc_time = 'en_US.UTF-8'; 