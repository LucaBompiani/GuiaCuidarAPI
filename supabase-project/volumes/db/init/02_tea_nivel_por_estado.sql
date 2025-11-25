-- Criar tabela TEA_nivel_por_estado
CREATE TABLE IF NOT EXISTS "public"."TEA_nivel_por_estado" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "local" TEXT NOT NULL,
    "dificuldades" TEXT NOT NULL,
    "absolute" TEXT NOT NULL,
    "relative" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE "public"."TEA_nivel_por_estado" ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura pública
CREATE POLICY "Permitir leitura pública de estatísticas TEA"
ON "public"."TEA_nivel_por_estado"
FOR SELECT
TO public
USING (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tea_local ON "public"."TEA_nivel_por_estado"("local");
CREATE INDEX IF NOT EXISTS idx_tea_dificuldades ON "public"."TEA_nivel_por_estado"("dificuldades");
