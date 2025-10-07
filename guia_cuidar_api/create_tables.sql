-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.artigo (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  corpo text,
  url_imagem_destaque text,
  autor text,
  data_publicacao timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT artigo_pkey PRIMARY KEY (id)
);
CREATE TABLE public.categoria_conteudo (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT categoria_conteudo_pkey PRIMARY KEY (id)
);
CREATE TABLE public.conteudo (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  corpo text,
  url_imagem_destaque text,
  categoria_id uuid,
  nivel_suporte_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT conteudo_pkey PRIMARY KEY (id),
  CONSTRAINT conteudo_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categoria_conteudo(id),
  CONSTRAINT conteudo_nivel_suporte_id_fkey FOREIGN KEY (nivel_suporte_id) REFERENCES public.nivel_suporte(id)
);
CREATE TABLE public.conteudo_favorito (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL,
  conteudo_id uuid NOT NULL,
  data_favoritado timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT conteudo_favorito_pkey PRIMARY KEY (id),
  CONSTRAINT conteudo_favorito_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES auth.users(id),
  CONSTRAINT conteudo_favorito_conteudo_id_fkey FOREIGN KEY (conteudo_id) REFERENCES public.conteudo(id)
);
CREATE TABLE public.dependente (
  id uuid NOT NULL,
  nome text NOT NULL,
  data_nascimento date NOT NULL,
  nivel_suporte_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  id_responsável uuid DEFAULT gen_random_uuid(),
  CONSTRAINT dependente_nivel_suporte_id_fkey FOREIGN KEY (nivel_suporte_id) REFERENCES public.nivel_suporte(id),
  CONSTRAINT dependente_id_responsável_fkey FOREIGN KEY (id_responsável) REFERENCES auth.users(id)
);
CREATE TABLE public.depoimento (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  texto text NOT NULL,
  aprovado boolean NOT NULL DEFAULT false,
  usuario_id uuid NOT NULL,
  categoria_id uuid,
  data_criacao timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT depoimento_pkey PRIMARY KEY (id),
  CONSTRAINT depoimento_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES auth.users(id),
  CONSTRAINT depoimento_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categoria_conteudo(id)
);
CREATE TABLE public.nivel_suporte (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT nivel_suporte_pkey PRIMARY KEY (id)
);
CREATE TABLE public.servico_local (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  endereco text,
  cidade text,
  cep text,
  tipo_servico_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT servico_local_pkey PRIMARY KEY (id),
  CONSTRAINT servico_local_tipo_servico_id_fkey FOREIGN KEY (tipo_servico_id) REFERENCES public.tipo_servico(id)
);
CREATE TABLE public.tipo_servico (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT tipo_servico_pkey PRIMARY KEY (id)
);