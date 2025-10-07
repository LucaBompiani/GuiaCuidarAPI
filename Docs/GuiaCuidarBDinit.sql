CREATE TABLE "Responsavel" (
  "id" int PRIMARY KEY,
  "nome" varchar,
  "email" varchar,
  "senha_hash" varchar,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TABLE "Dependente" (
  "id" int PRIMARY KEY,
  "nome" varchar,
  "responsavel_id" int,
  "nivel_suporte_tea_id" int,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TABLE "NivelSuporteTEA" (
  "id" int PRIMARY KEY,
  "nome" varchar,
  "descricao" text,
  "data_criacao" timestamp
);

CREATE TABLE "MaterialDeApoio" (
  "id" int PRIMARY KEY,
  "titulo" varchar,
  "corpo" text,
  "categoria_id" int,
  "nivel_suporte_tea_id" int,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TABLE "CategoriaMaterial" (
  "id" int PRIMARY KEY,
  "nome" varchar,
  "descricao" text,
  "data_criacao" timestamp
);

CREATE TABLE "MaterialFavorito" (
  "responsavel_id" int,
  "material_id" int,
  "dependente_id" int,
  "data_favoritado" timestamp,
  PRIMARY KEY ("responsavel_id", "material_id", "dependente_id")
);

CREATE TABLE "ServicoLocal" (
  "id" int PRIMARY KEY,
  "nome" varchar,
  "endereco" varchar,
  "tipo_servico_id" int,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TABLE "TipoServico" (
  "id" int PRIMARY KEY,
  "nome" varchar,
  "descricao" text,
  "data_criacao" timestamp
);

CREATE TABLE "ArtigoInformativo" (
  "id" int PRIMARY KEY,
  "titulo" varchar,
  "corpo" text,
  "autor" varchar,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TABLE "DepoimentoResponsavel" (
  "id" int PRIMARY KEY,
  "texto" text,
  "aprovado" boolean,
  "responsavel_id" int,
  "categoria_id" int,
  "data_criacao" timestamp
);

CREATE TABLE "DadosEstatisticosTEA" (
  "id" int PRIMARY KEY,
  "conteudo" text,
  "nome" varchar,
  "fonte" varchar,
  "descricao" text,
  "data_criacao" timestamp
);

COMMENT ON COLUMN "Responsavel"."id" IS 'ID do Responsável';

COMMENT ON COLUMN "Dependente"."id" IS 'ID do Dependente';

COMMENT ON COLUMN "Dependente"."responsavel_id" IS 'ID do Responsável (Usuário Principal)';

COMMENT ON COLUMN "Dependente"."nivel_suporte_tea_id" IS 'ID do Nível de Suporte TEA';

COMMENT ON COLUMN "NivelSuporteTEA"."id" IS 'ID do Nível de Suporte TEA';

COMMENT ON COLUMN "MaterialDeApoio"."id" IS 'ID do Material de Apoio';

COMMENT ON COLUMN "MaterialDeApoio"."categoria_id" IS 'ID da Categoria';

COMMENT ON COLUMN "MaterialDeApoio"."nivel_suporte_tea_id" IS 'ID do Nível de Suporte TEA';

COMMENT ON COLUMN "CategoriaMaterial"."id" IS 'ID da Categoria de Material';

COMMENT ON COLUMN "MaterialFavorito"."responsavel_id" IS 'ID do Responsável';

COMMENT ON COLUMN "MaterialFavorito"."material_id" IS 'ID do Material de Apoio';

COMMENT ON COLUMN "MaterialFavorito"."dependente_id" IS 'ID do Dependente';

COMMENT ON COLUMN "ServicoLocal"."id" IS 'ID do Serviço';

COMMENT ON COLUMN "ServicoLocal"."tipo_servico_id" IS 'ID do Tipo de Serviço';

COMMENT ON COLUMN "TipoServico"."id" IS 'ID do Tipo de Serviço';

COMMENT ON COLUMN "ArtigoInformativo"."id" IS 'ID do Artigo';

COMMENT ON COLUMN "DepoimentoResponsavel"."id" IS 'ID do Depoimento do Responsável';

COMMENT ON COLUMN "DepoimentoResponsavel"."texto" IS 'Conteúdo do depoimento';

COMMENT ON COLUMN "DepoimentoResponsavel"."aprovado" IS 'Default: false';

COMMENT ON COLUMN "DepoimentoResponsavel"."responsavel_id" IS 'Autor do depoimento';

COMMENT ON COLUMN "DepoimentoResponsavel"."categoria_id" IS 'Tópico relacionado (opcional)';

COMMENT ON COLUMN "DadosEstatisticosTEA"."id" IS 'ID do Conjunto de Dados';

ALTER TABLE "Dependente" ADD FOREIGN KEY ("responsavel_id") REFERENCES "Responsavel" ("id");

ALTER TABLE "Dependente" ADD FOREIGN KEY ("nivel_suporte_tea_id") REFERENCES "NivelSuporteTEA" ("id");

ALTER TABLE "MaterialDeApoio" ADD FOREIGN KEY ("categoria_id") REFERENCES "CategoriaMaterial" ("id");

ALTER TABLE "MaterialDeApoio" ADD FOREIGN KEY ("nivel_suporte_tea_id") REFERENCES "NivelSuporteTEA" ("id");

ALTER TABLE "MaterialFavorito" ADD FOREIGN KEY ("responsavel_id") REFERENCES "Responsavel" ("id");

ALTER TABLE "MaterialFavorito" ADD FOREIGN KEY ("material_id") REFERENCES "MaterialDeApoio" ("id");

ALTER TABLE "MaterialFavorito" ADD FOREIGN KEY ("dependente_id") REFERENCES "Dependente" ("id");

ALTER TABLE "ServicoLocal" ADD FOREIGN KEY ("tipo_servico_id") REFERENCES "TipoServico" ("id");

ALTER TABLE "DepoimentoResponsavel" ADD FOREIGN KEY ("responsavel_id") REFERENCES "Responsavel" ("id");

ALTER TABLE "DepoimentoResponsavel" ADD FOREIGN KEY ("categoria_id") REFERENCES "CategoriaMaterial" ("id");
