# 🏗️ Arquitetura do Guia Cuidar

## 📐 Arquitetura Conceitual

```mermaid
graph TB
    subgraph Frontend["Frontend - React"]
        UI[Interface do Usuário]
    end
    
    subgraph Supabase["Supabase - Backend"]
        Auth[Autenticação]
        API[API REST]
        DB[(PostgreSQL)]
    end
    
    UI -->|Requisições| Auth
    UI -->|CRUD| API
    API --> DB
    Auth --> DB
    
    style Frontend fill:#61dafb20
    style Supabase fill:#3ecf8e20
```

### Componentes

- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (Auth + API + Database)
- **Banco de Dados**: PostgreSQL com Row Level Security

## 🔧 Stack Tecnológico

```mermaid
graph LR
    React[React 18 + TypeScript]
    Tailwind[Tailwind CSS]
    Supabase[Supabase Client]
    
    React --> Tailwind
    React --> Supabase
    
    style React fill:#61dafb20
```

**Frontend:**
- React 18 + TypeScript + Vite
- Tailwind CSS + Shadcn/ui
- React Router

**Backend:**
- Supabase (BaaS)
- PostgreSQL
- Row Level Security (RLS)

## 🔄 Fluxo de Dados

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant S as Supabase
    participant D as Database
    
    U->>F: Ação
    F->>F: Valida dados
    F->>S: Request + Token
    S->>S: Valida JWT
    S->>D: Query SQL
    D->>S: Dados
    S->>F: Response
    F->>U: Exibe resultado
```

## 🔐 Segurança

### Autenticação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant A as Supabase Auth
    
    U->>F: Email + Senha
    F->>A: Login
    A->>F: JWT Token
    F->>F: Armazena token
    
    Note over F,A: Requisições usam Bearer Token
```

### Row Level Security (RLS)

```sql
-- Usuários só veem seus próprios dados
CREATE POLICY "user_policy" ON Dependente
FOR ALL USING (auth.uid() = id_responsavel);
```

## 📊 Modelo de Dados

```mermaid
erDiagram
    Responsavel ||--o{ Dependente : possui
    Responsavel ||--o{ DepoimentoResponsavel : escreve
    
    Dependente }o--|| NivelSuporteTEA : "tem nível"
    Dependente ||--o{ MaterialFavorito : favorita
    
    MaterialDeApoio ||--o{ MaterialFavorito : "é favoritado"
    MaterialDeApoio }o--|| CategoriaMaterial : "pertence a"
    MaterialDeApoio }o--|| NivelSuporteTEA : "direcionado para"
    
    ServicoLocal }o--|| TipoServico : "é do tipo"
    
    DepoimentoResponsavel }o--|| CategoriaDepoimento : "pertence a"
    
    Responsavel {
        uuid id PK
        string nome
        string email UK
        string telefone
        timestamp criado_em
        timestamp atualizado_em
    }
    
    Dependente {
        uuid id PK
        string nome
        date data_nascimento
        uuid id_responsavel FK
        int id_nivel_suporte FK
        timestamp criado_em
        timestamp atualizado_em
    }
    
    NivelSuporteTEA {
        int id PK
        string nome
        text descricao
    }
    
    ArtigoInformativo {
        int id PK
        string titulo
        text conteudo
        string autor
        date data_publicacao
        timestamp criado_em
    }
    
    MaterialDeApoio {
        int id PK
        string titulo
        text descricao
        string url
        int id_categoria FK
        int id_nivel_suporte FK
        timestamp criado_em
    }
    
    CategoriaMaterial {
        int id PK
        string nome
        text descricao
    }
    
    MaterialFavorito {
        int id PK
        uuid id_dependente FK
        int id_material FK
        timestamp criado_em
    }
    
    ServicoLocal {
        int id PK
        string nome
        text descricao
        string endereco
        string cidade
        string estado
        string telefone
        string email
        string site
        int id_tipo_servico FK
        timestamp criado_em
    }
    
    TipoServico {
        int id PK
        string nome
        text descricao
    }
    
    DepoimentoResponsavel {
        int id PK
        uuid id_responsavel FK
        text conteudo
        int id_categoria FK
        boolean aprovado
        timestamp criado_em
    }
    
    CategoriaDepoimento {
        int id PK
        string nome
        text descricao
    }
    
    DadosEstatisticosTEA {
        int id PK
        string regiao
        int ano
        int total_casos
        float prevalencia
        text fonte
        timestamp criado_em
    }
```

## 🚀 Deployment

### Desenvolvimento

```mermaid
graph LR
    Dev[Vite Dev Server<br/>localhost:5173] -->|API| Cloud[Supabase Cloud]
    
    style Dev fill:#f0f0f0
    style Cloud fill:#3ecf8e20
```

### Produção

```mermaid
graph LR
    User[Usuários] -->|HTTPS| Vercel[Vercel<br/>Frontend]
    Vercel -->|API| Supabase[Supabase Cloud<br/>Backend + DB]
    
    style Vercel fill:#0070f320
    style Supabase fill:#3ecf8e20
```

## 📁 Estrutura do Projeto

```mermaid
graph TB
    Root[guia-cuidar/]
    
    Root --> Frontend[frontend/]
    Root --> Supabase[supabase-project/]
    Root --> Docs[Docs/]
    Root --> Scripts[scripts/]
    
    Frontend --> Src[src/]
    Frontend --> Public[public/]
    Frontend --> FConfig[Configurações<br/>vite.config.ts<br/>tailwind.config.js]
    
    Src --> Components[components/<br/>UI reutilizáveis]
    Src --> Pages[pages/<br/>auth/ dashboard/]
    Src --> Hooks[hooks/<br/>useAuth useSupabase]
    Src --> Lib[lib/<br/>utils supabase]
    Src --> Types[types/<br/>TypeScript types]
    Src --> SupaClient[supabase/<br/>Cliente config]
    
    Supabase --> Docker[docker-compose.yml]
    Supabase --> SConfig[Configurações<br/>env variables]
    
    Docs --> ER[DiagramaER.png]
    Docs --> SQL[GuiaCuidarBDinit.sql]
    
    Scripts --> ETL[Scripts Python<br/>Processamento dados]
    
    style Root fill:#f9f9f9
    style Frontend fill:#61dafb20
    style Supabase fill:#3ecf8e20
    style Docs fill:#fff4e1
    style Scripts fill:#e8f5e9
```

### Detalhamento

```
guia-cuidar/
├── frontend/                    # Aplicação React
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── ui/            # Shadcn/ui components
│   │   │   └── layout/        # Header, Footer, Sidebar
│   │   ├── pages/             # Páginas da aplicação
│   │   │   ├── auth/          # Login, Register
│   │   │   └── dashboard/     # Home, Services, Materials, etc
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilitários e helpers
│   │   ├── types/             # Definições TypeScript
│   │   └── supabase/          # Cliente e configuração
│   ├── public/                # Assets estáticos
│   └── supabase/              # Tipos gerados do Supabase
│
├── supabase-project/          # Supabase local (Docker)
│   ├── docker-compose.yml     # Configuração containers
│   └── .env                   # Variáveis de ambiente
│
├── Docs/                      # Documentação
│   ├── DiagramaER.png        # Diagrama do banco
│   └── GuiaCuidarBDinit.sql  # Script de inicialização
│
└── scripts/                   # Scripts auxiliares
    └── *.py                   # ETL de dados estatísticos
```

## 📚 Referências

- [React](https://react.dev/)
- [Supabase](https://supabase.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
