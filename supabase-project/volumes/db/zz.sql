-- ===================================================================
-- SUPER-SCRIPT DE INICIALIZAÇÃO DO SUPABASE (Versão Faculdade ADMIN)
-- Usuário: adm01, Senha: H7U{z!3
-- Execute isto DE UMA SÓ VEZ no banco 'db_grupo04'
-- ===================================================================

-- INÍCIO: roles.sql (Modificado para adm01)
CREATE SCHEMA IF NOT EXISTS auth AUTHORIZATION adm01;
CREATE SCHEMA IF NOT EXISTS storage AUTHORIZATION adm01;

CREATE TABLE IF NOT EXISTS auth.users (
    instance_id uuid NULL,
    id uuid NOT NULL UNIQUE,
    aud varchar(255) NULL,
    "role" varchar(255) NULL,
    email varchar(255) NULL UNIQUE,
    encrypted_password varchar(255) NULL,
    email_confirmed_at timestamptz NULL,
    invited_at timestamptz NULL,
    confirmation_token varchar(255) NULL,
    confirmation_sent_at timestamptz NULL,
    recovery_token varchar(255) NULL,
    recovery_sent_at timestamptz NULL,
    email_change_token_new varchar(255) NULL,
    email_change varchar(255) NULL,
    email_change_sent_at timestamptz NULL,
    last_sign_in_at timestamptz NULL,
    raw_app_meta_data jsonb NULL,
    raw_user_meta_data jsonb NULL,
    is_super_admin bool NULL,
    created_at timestamptz NULL,
    updated_at timestamptz NULL,
    phone varchar(15) DEFAULT NULL::character varying UNIQUE,
    phone_confirmed_at timestamptz NULL,
    phone_change varchar(15) DEFAULT ''::character varying NULL,
    phone_change_token varchar(255) DEFAULT ''::character varying NULL,
    phone_change_sent_at timestamptz NULL,
    confirmed_at timestamptz GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current varchar(255) DEFAULT ''::character varying NULL,
    email_change_confirm_status int2 DEFAULT 0 NULL,
    banned_until timestamptz NULL,
    reauthentication_token varchar(255) DEFAULT ''::character varying NULL,
    reauthentication_sent_at timestamptz NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);
COMMENT ON table auth.users IS 'Auth: Stores user login data within a secure schema.';
CREATE INDEX IF NOT EXISTS users_instance_id_email_idx ON auth.users USING btree (instance_id, email);
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users USING btree (instance_id);

-- Agora vai funcionar porque 'adm01' tem CREATEROLE
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'supabase_admin') THEN
    CREATE ROLE supabase_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticator') THEN
    CREATE ROLE authenticator NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'pgbouncer') THEN
    CREATE ROLE pgbouncer LOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'supabase_auth_admin') THEN
    CREATE ROLE supabase_auth_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'supabase_storage_admin') THEN
    CREATE ROLE supabase_storage_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'supabase_functions_admin') THEN
    CREATE ROLE supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
  END IF;
END
$$;

GRANT anon TO adm01;
GRANT authenticated TO adm01;
GRANT service_role TO adm01;
GRANT supabase_admin TO adm01;
GRANT authenticator TO adm01;
GRANT supabase_auth_admin TO adm01;
GRANT supabase_storage_admin TO adm01;
GRANT supabase_functions_admin TO adm01;

GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA storage TO supabase_storage_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA storage TO supabase_storage_admin;
ALTER USER supabase_admin SET search_path = "public";
ALTER USER supabase_auth_admin SET search_path = "auth";
ALTER USER supabase_storage_admin SET search_path = "storage";

-- Senhas definidas para 'H7U{z!3' (para corresponder ao seu .env)
ALTER USER authenticator WITH PASSWORD 'H7U{z!3';
ALTER USER pgbouncer WITH PASSWORD 'H7U{z!3';
ALTER USER supabase_auth_admin WITH PASSWORD 'H7U{z!3';
ALTER USER supabase_functions_admin WITH PASSWORD 'H7U{z!3';
ALTER USER supabase_storage_admin WITH PASSWORD 'H7U{z!3';
-- FIM: roles.sql

-- ===================================================================

-- INÍCIO: jwt.sql (Modificado)
-- O JWT_SECRET do seu .env (5486zsd...)
ALTER ROLE authenticator SET pgrst.jwt.claims.role = 'role';
ALTER ROLE authenticator SET pgrst.jwt.claims.exp = 'exp';
ALTER ROLE authenticator SET pgrst.db.jwt.secret = '5486zsd5as7casca6scqw645cAs54cq8';
ALTER ROLE authenticator SET pgrst.db.jwt.exp = 3600;
ALTER ROLE authenticator SET pgrst.app.settings.jwt_secret = '5486zsd5as7casca6scqw645cAs54cq8';
ALTER ROLE authenticator SET pgrst.app.settings.jwt.exp = 3600;
-- FIM: jwt.sql

-- ===================================================================

-- INÍCIO: realtime.sql (Essencial)
CREATE SCHEMA IF NOT EXISTS realtime AUTHORIZATION adm01;
GRANT USAGE ON SCHEMA realtime TO anon, authenticated, service_role;
-- FIM: realtime.sql

-- ===================================================================

-- INÍCIO: logs.sql + pooler.sql (Modificado)
CREATE SCHEMA IF NOT EXISTS _analytics;
ALTER SCHEMA _analytics OWNER TO adm01;

CREATE SCHEMA IF NOT EXISTS _supavisor;
ALTER SCHEMA _supavisor OWNER TO adm01;
-- FIM: logs.sql + pooler.sql

-- =================================O==================================

-- INÍCIO: Correções Finais de Permissão
-- Senha do supabase_admin definida para 'H7U{z!3'
ALTER USER supabase_admin WITH PASSWORD 'H7U{z!3';
-- Agora vai funcionar porque 'adm01' tem permissão de superusuário
ALTER USER supabase_admin WITH REPLICATION;
GRANT ALL PRIVILEGES ON SCHEMA _analytics TO supabase_admin;
-- FIM: Correções Finais

-- ===================================================================
-- SCRIPT CONCLUÍDO
-- ===================================================================