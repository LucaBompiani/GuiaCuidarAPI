# Instruções para Popular Tabela TEA_nivel_por_estado

## Opção 1: Executar via Supabase Dashboard

1. Acesse o Supabase Dashboard do seu projeto
2. Vá em **SQL Editor**
3. Execute o conteúdo do arquivo `volumes/db/init/02_tea_nivel_por_estado.sql` (criar tabela)
4. Execute o conteúdo do arquivo `volumes/db/init/03_tea_dados.sql` (popular dados)

## Opção 2: Executar via Docker (se estiver usando Supabase local)

```bash
# Reiniciar o container do banco de dados para executar os scripts de init
cd supabase-project
docker-compose down
docker-compose up -d
```

Os scripts em `volumes/db/init/` serão executados automaticamente na inicialização.

## Opção 3: Executar via psql

```bash
# Conectar ao banco
psql -h localhost -U postgres -d postgres

# Executar os scripts
\i volumes/db/init/02_tea_nivel_por_estado.sql
\i volumes/db/init/03_tea_dados.sql
```

## Verificar se os dados foram inseridos

```sql
SELECT COUNT(*) FROM "TEA_nivel_por_estado";
-- Deve retornar 58 registros (27 estados + 5 regiões + 1 Brasil, cada um com 2 níveis de dificuldade)

SELECT * FROM "TEA_nivel_por_estado" WHERE local = 'Brasil';
-- Deve retornar 2 registros (1 dificuldade e 2+ dificuldades)
```

## Estrutura da Tabela

- **id**: UUID (chave primária)
- **local**: Nome do estado, região ou "Brasil"
- **dificuldades**: "1 dificuldade" ou "2 ou mais dificuldades"
- **absolute**: Número absoluto de pessoas
- **relative**: Porcentagem relativa
- **created_at**: Data de criação do registro

## Dados Incluídos

- 27 estados brasileiros
- 5 regiões (Norte, Nordeste, Centro-Oeste, Sudeste, Sul)
- Total do Brasil
- Cada local tem 2 registros (1 dificuldade e 2+ dificuldades)
- **Total: 58 registros**

Fonte: Censo Demográfico 2022 - IBGE
