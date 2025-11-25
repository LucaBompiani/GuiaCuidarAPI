# ⚡ Configuração do Supabase Local (Self-Hosted)

Este guia explica como rodar o backend do Supabase **localmente** usando Docker, conectando-se ao banco de dados **compartilhado do grupo** (`db_grupo04` da faculdade).

> ⚠️ **IMPORTANTE:** O banco é **compartilhado entre todos do grupo**.

------
## 📋 Pré-requisitos

1. **Docker + Docker Compose** instalados.  

2. A pasta `supabase-project` baixada no seu computador (disponibilizada no repositório do projeto).
------

## 🚀 Passo a Passo

### 1. Criar seu arquivo `.env`

O arquivo `.env` **não está incluído no repositório** por conter chaves sensíveis. 

Crie um arquivo chamado `.env` dentro de `supabase-project`. Variáveis de conexão também serão necessárias, para todas essas senhas e variávies, contate os integrantes do grupo a fim de obtê-las. 

Preencha no arquivo:

- `JWT_SECRET`

- `ANON_KEY`

- `SERVICE_ROLE_KEY`


---

### 2. Subir o Supabase (Docker)

Abra o terminal dentro de `supabase-project` e execute:

```bash
docker compose up -d
```

Verifique se está tudo rodando:

```bash
docker compose ps
```

Todos os containers devem aparecer como `Up` ou `Healthy`.

### 3. Acessar o Painel (Supabase Studio)

Abra no seu navegador:

- **URL:** `http://localhost:8000`
- **Usuário:** `supabase`
- **Senha:** `labsoft`

---

## 🔗 Conectando o Frontend (React/Vite)

No projeto Frontend, edite o arquivo `.env` ou `.env.local`:

```ini
# Aponta para o gateway local do Docker
VITE_SUPABASE_URL="http://localhost:8000"

# Use a mesma ANON_KEY que você colocou no .env do backend
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR..."
```
---
