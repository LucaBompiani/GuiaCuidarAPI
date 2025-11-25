-- Script de Debug para Tabela TEA_nivel_por_estado
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Verificar se a tabela existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'TEA_nivel_por_estado'
) as tabela_existe;

-- 2. Contar registros na tabela
SELECT COUNT(*) as total_registros FROM "public"."TEA_nivel_por_estado";

-- 3. Ver amostra dos dados
SELECT * FROM "public"."TEA_nivel_por_estado" LIMIT 5;

-- 4. Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'TEA_nivel_por_estado';

-- 5. Verificar se RLS está habilitado
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'TEA_nivel_por_estado';

-- 6. SOLUÇÃO: Desabilitar RLS temporariamente (se necessário)
-- Descomente as linhas abaixo se quiser desabilitar RLS:
-- ALTER TABLE "public"."TEA_nivel_por_estado" DISABLE ROW LEVEL SECURITY;

-- 7. SOLUÇÃO: Criar política de leitura pública
-- Execute isso se a política não existir:
DROP POLICY IF EXISTS "Permitir leitura pública" ON "public"."TEA_nivel_por_estado";

CREATE POLICY "Permitir leitura pública"
ON "public"."TEA_nivel_por_estado"
FOR SELECT
TO public
USING (true);

-- 8. Verificar novamente as políticas
SELECT * FROM pg_policies WHERE tablename = 'TEA_nivel_por_estado';

-- 9. Testar query simples
SELECT local, dificuldades, absolute 
FROM "public"."TEA_nivel_por_estado" 
WHERE local = 'Brasil';
