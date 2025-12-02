# 🧩 Guia Cuidar

Plataforma web para apoio a responsáveis de pessoas com Transtorno do Espectro Autista (TEA), oferecendo recursos informativos, materiais de apoio, serviços locais e uma comunidade de depoimentos.

---

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração do Backend (Supabase)](#-configuração-do-backend-supabase)
- [Configuração do Frontend](#-configuração-do-frontend)
- [Configuração da API Django (Opcional)](#-configuração-da-api-django-opcional)
- [Executando a Aplicação](#-executando-a-aplicação)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Banco de Dados](#-estrutura-do-banco-de-dados)

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Docker** e **Docker Compose** - [Download](https://www.docker.com/)
- **Python** (versão 3.13 ou superior) - [Download](https://www.python.org/) *(opcional, apenas se for usar a API Django)*
- **Git** - [Download](https://git-scm.com/)

---

## 📁 Estrutura do Projeto

```
guia-cuidar/
├── frontend/              # Aplicação React + Vite + TypeScript
├── guia_cuidar_api/      # API Django (opcional)
├── supabase-project/     # Configuração do Supabase local
├── Docs/                 # Documentação e diagramas
└── scripts/              # Scripts de processamento de dados
```

---

## 🗄️ Configuração do Backend (Supabase)

O projeto utiliza **Supabase** como backend (autenticação, banco de dados PostgreSQL e APIs).

### Opção 1: Usar Supabase Cloud (Recomendado para desenvolvimento rápido)

O projeto já está configurado para usar uma instância cloud do Supabase. Nenhuma configuração adicional é necessária para o backend.

### Opção 2: Rodar Supabase Localmente (Self-Hosted)

Se preferir rodar o Supabase localmente:

#### 1. Obter as credenciais

Entre em contato com os integrantes do grupo para obter:
- `JWT_SECRET`
- `ANON_KEY`
- `SERVICE_ROLE_KEY`
- Credenciais do banco de dados compartilhado

#### 2. Criar arquivo `.env` no Supabase

Navegue até a pasta `supabase-project` e crie um arquivo `.env`:

```bash
cd supabase-project
```

Crie o arquivo `.env` com as credenciais obtidas:

```env
JWT_SECRET=sua_jwt_secret_aqui
ANON_KEY=sua_anon_key_aqui
SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

#### 3. Iniciar o Supabase com Docker

```bash
docker compose up -d
```

Verifique se todos os containers estão rodando:

```bash
docker compose ps
```

Todos devem aparecer como `Up` ou `Healthy`.

#### 4. Acessar o Painel do Supabase

Abra no navegador: `http://localhost:8000`

- **Usuário:** `supabase`
- **Senha:** `labsoft`

---

## 💻 Configuração do Frontend

### 1. Navegar até a pasta do frontend

```bash
cd frontend
```

### 2. Instalar dependências

```bash
npm install
```

ou se preferir usar yarn:

```bash
yarn install
```

### 3. Configurar variáveis de ambiente

O arquivo `.env` já existe na pasta `frontend` com as configurações para o Supabase Cloud:

```env
VITE_SUPABASE_URL=https://jksbjifwsxrmhzunozql.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Se estiver usando Supabase local**, edite o arquivo `.env`:

```env
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_PUBLISHABLE_KEY=sua_anon_key_aqui
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

---

## 🐍 Configuração da API Django (Opcional)

A API Django é **opcional** e serve como alternativa ao uso direto do Supabase.

### 1. Navegar até a pasta da API

```bash
cd guia_cuidar_api
```

### 2. Criar ambiente virtual Python

```bash
python -m venv .venv
```

### 3. Ativar o ambiente virtual

**Linux/Mac:**
```bash
source .venv/bin/activate
```

**Windows:**
```bash
.venv\Scripts\activate
```

### 4. Instalar dependências

```bash
pip install -e .
```

ou usando uv (mais rápido):

```bash
uv pip install -e .
```

### 5. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:

```env
SUPABASE_URL=https://jksbjifwsxrmhzunozql.supabase.co
SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
JWT_SECRET_KEY=sua_jwt_secret_aqui
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
```

### 6. Executar migrações

```bash
python manage.py migrate
```

### 7. Iniciar o servidor Django

```bash
python manage.py runserver
```

A API estará disponível em: `http://localhost:8000/api/v1/`

Documentação dos endpoints: Consulte `guia_cuidar_api/API_ENDPOINTS.md`

---

## 🚀 Executando a Aplicação

### Início Rápido (Usando Supabase Cloud)

1. **Instalar dependências do frontend:**
   ```bash
   cd frontend
   npm install
   ```

2. **Iniciar o frontend:**
   ```bash
   npm run dev
   ```

3. **Acessar a aplicação:**
   Abra `http://localhost:5173` no navegador

### Com Supabase Local

1. **Iniciar o Supabase:**
   ```bash
   cd supabase-project
   docker compose up -d
   ```

2. **Instalar e iniciar o frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

3. **Acessar a aplicação:**
   - Frontend: `http://localhost:5173`
   - Supabase Studio: `http://localhost:8000`

### Com API Django (Opcional)

1. **Iniciar o Supabase** (se estiver usando local)

2. **Iniciar a API Django:**
   ```bash
   cd guia_cuidar_api
   source .venv/bin/activate  # ou .venv\Scripts\activate no Windows
   python manage.py runserver
   ```

3. **Iniciar o frontend:**
   ```bash
   cd ../frontend
   npm run dev
   ```

---

## ✨ Funcionalidades

### Para Usuários (Responsáveis)

- **Autenticação:** Cadastro e login seguro
- **Gerenciamento de Dependentes:** Cadastrar pessoas com TEA sob sua responsabilidade
- **Artigos Informativos:** Acesso a conteúdo educativo sobre TEA
- **Materiais de Apoio:** Recursos categorizados por nível de suporte
- **Favoritos:** Salvar materiais relevantes para cada dependente
- **Serviços Locais:** Buscar serviços de apoio na sua região
- **Depoimentos:** Compartilhar experiências com a comunidade
- **Dados Estatísticos:** Visualizar informações sobre TEA no Brasil

### Recursos Técnicos

- **Row Level Security (RLS):** Segurança a nível de linha no banco de dados
- **Autenticação JWT:** Tokens seguros para sessões
- **Triggers Automáticos:** Atualização automática de timestamps
- **Validação de Dados:** Schemas Zod no frontend
- **UI Responsiva:** Interface adaptável para mobile e desktop

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **TanStack Query** - Gerenciamento de estado assíncrono
- **Shadcn/ui** - Componentes UI
- **Tailwind CSS** - Estilização
- **Zod** - Validação de schemas
- **React Hook Form** - Gerenciamento de formulários

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL - Banco de dados
  - Auth - Autenticação
  - Row Level Security - Segurança
  - Realtime - Atualizações em tempo real
- **Django** (opcional) - Framework Python
- **Django Ninja** - API REST

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

---

## 🗃️ Estrutura do Banco de Dados

O banco de dados possui as seguintes tabelas principais:

- **Responsavel** - Dados dos usuários responsáveis
- **Dependente** - Pessoas com TEA cadastradas
- **NivelSuporteTEA** - Níveis de suporte (1, 2, 3)
- **ArtigoInformativo** - Conteúdo educativo
- **MaterialDeApoio** - Recursos de apoio
- **CategoriaMaterial** - Categorias dos materiais
- **MaterialFavorito** - Materiais favoritados pelos usuários
- **ServicoLocal** - Serviços disponíveis
- **TipoServico** - Tipos de serviços
- **DepoimentoResponsavel** - Depoimentos da comunidade
- **CategoriaDepoimento** - Categorias de depoimentos
- **DadosEstatisticosTEA** - Estatísticas sobre TEA

Para visualizar o diagrama ER completo, consulte: `Docs/DiagramaER.png`

Para o script SQL de inicialização: `Docs/GuiaCuidarBDinit.sql`

---

## 📝 Scripts Úteis

### Frontend

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run build:dev    # Build em modo desenvolvimento
npm run preview      # Preview do build de produção
npm run lint         # Executa linter
```

### API Django

```bash
python manage.py runserver        # Inicia servidor
python manage.py migrate          # Executa migrações
python manage.py makemigrations   # Cria novas migrações
python manage.py createsuperuser  # Cria usuário admin
```

### Supabase Local

```bash
docker compose up -d      # Inicia containers
docker compose down       # Para containers
docker compose ps         # Lista status dos containers
docker compose logs       # Visualiza logs
```

---

## 🤝 Contribuindo

Este é um projeto acadêmico desenvolvido para a disciplina de Laboratório de Software.

---

## 📄 Licença

Este projeto é de uso acadêmico.

---

## 👥 Equipe

Projeto desenvolvido pelo Grupo 04 - Laboratório de Software

---

## 📞 Suporte

Para dúvidas sobre credenciais ou configurações, entre em contato com os integrantes do grupo.
