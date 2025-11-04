-- ============================================
-- SUPABASE DATABASE SCHEMA FOR TEA SYSTEM
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: TipoServico
-- ============================================
CREATE TABLE "TipoServico" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: ServicoLocal
-- ============================================
CREATE TABLE "ServicoLocal" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    endereco VARCHAR(255),
    tipo_servico_id INTEGER REFERENCES "TipoServico"(id) ON DELETE SET NULL,
    data_criacao TIMESTAMPTZ DEFAULT NOW(),
    data_atualizacao TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: Responsavel (linked to auth.users)
-- ============================================
CREATE TABLE "Responsavel" (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255),
    data_criacao TIMESTAMPTZ DEFAULT NOW(),
    data_atualizacao TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: NivelSuporteTEA
-- ============================================
CREATE TABLE "NivelSuporteTEA" (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: CategoriaMaterial
-- ============================================
CREATE TABLE "CategoriaMaterial" (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: Dependente
-- ============================================
CREATE TABLE "Dependente" (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    responsavel_id UUID NOT NULL REFERENCES "Responsavel"(id) ON DELETE CASCADE,
    nivel_suporte_tea_id INTEGER REFERENCES "NivelSuporteTEA"(id) ON DELETE SET NULL,
    data_criacao TIMESTAMPTZ DEFAULT NOW(),
    data_atualizacao TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: DepoimentoResponsavel
-- ============================================
CREATE TABLE "DepoimentoResponsavel" (
    id SERIAL PRIMARY KEY,
    texto TEXT NOT NULL,
    aprovado BOOLEAN DEFAULT FALSE,
    responsavel_id UUID NOT NULL REFERENCES "Responsavel"(id) ON DELETE CASCADE,
    categoria_id INTEGER REFERENCES "CategoriaMaterial"(id) ON DELETE SET NULL,
    data_criacao TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: MaterialDeApoio
-- ============================================
CREATE TABLE "MaterialDeApoio" (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    corpo TEXT,
    categoria_id INTEGER REFERENCES "CategoriaMaterial"(id) ON DELETE SET NULL,
    nivel_suporte_tea_id INTEGER REFERENCES "NivelSuporteTEA"(id) ON DELETE SET NULL,
    data_criacao TIMESTAMPTZ DEFAULT NOW(),
    data_atualizacao TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: MaterialFavorito
-- ============================================
CREATE TABLE "MaterialFavorito" (
    responsavel_id UUID NOT NULL REFERENCES "Responsavel"(id) ON DELETE CASCADE,
    material_id INTEGER NOT NULL REFERENCES "MaterialDeApoio"(id) ON DELETE CASCADE,
    dependente_id INTEGER NOT NULL REFERENCES "Dependente"(id) ON DELETE CASCADE,
    data_favoritado TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (responsavel_id, material_id, dependente_id)
);

-- ============================================
-- TABLE: DadosEstatisticosTEA
-- ============================================
CREATE TABLE "DadosEstatisticosTEA" (
    id SERIAL PRIMARY KEY,
    conteudo TEXT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    fonte VARCHAR(255),
    descricao TEXT,
    data_criacao TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: ArtigoInformativo
-- ============================================
CREATE TABLE "ArtigoInformativo" (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    corpo TEXT NOT NULL,
    autor VARCHAR(255),
    data_criacao TIMESTAMPTZ DEFAULT NOW(),
    data_atualizacao TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_servico_local_tipo ON "ServicoLocal"(tipo_servico_id);
CREATE INDEX idx_dependente_responsavel ON "Dependente"(responsavel_id);
CREATE INDEX idx_dependente_nivel_suporte ON "Dependente"(nivel_suporte_tea_id);
CREATE INDEX idx_depoimento_responsavel ON "DepoimentoResponsavel"(responsavel_id);
CREATE INDEX idx_depoimento_aprovado ON "DepoimentoResponsavel"(aprovado);
CREATE INDEX idx_material_categoria ON "MaterialDeApoio"(categoria_id);
CREATE INDEX idx_material_nivel_suporte ON "MaterialDeApoio"(nivel_suporte_tea_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_servico_local_timestamp
    BEFORE UPDATE ON "ServicoLocal"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responsavel_timestamp
    BEFORE UPDATE ON "Responsavel"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dependente_timestamp
    BEFORE UPDATE ON "Dependente"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_material_timestamp
    BEFORE UPDATE ON "MaterialDeApoio"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artigo_timestamp
    BEFORE UPDATE ON "ArtigoInformativo"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE "Responsavel" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Dependente" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DepoimentoResponsavel" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MaterialFavorito" ENABLE ROW LEVEL SECURITY;

-- Responsavel policies
CREATE POLICY "Users can view their own profile"
    ON "Responsavel" FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON "Responsavel" FOR UPDATE
    USING (auth.uid() = id);

-- Dependente policies
CREATE POLICY "Users can view their own dependents"
    ON "Dependente" FOR SELECT
    USING (auth.uid() = responsavel_id);

CREATE POLICY "Users can insert their own dependents"
    ON "Dependente" FOR INSERT
    WITH CHECK (auth.uid() = responsavel_id);

CREATE POLICY "Users can update their own dependents"
    ON "Dependente" FOR UPDATE
    USING (auth.uid() = responsavel_id);

CREATE POLICY "Users can delete their own dependents"
    ON "Dependente" FOR DELETE
    USING (auth.uid() = responsavel_id);

-- DepoimentoResponsavel policies
CREATE POLICY "Users can view approved testimonials or their own"
    ON "DepoimentoResponsavel" FOR SELECT
    USING (aprovado = TRUE OR auth.uid() = responsavel_id);

CREATE POLICY "Users can insert their own testimonials"
    ON "DepoimentoResponsavel" FOR INSERT
    WITH CHECK (auth.uid() = responsavel_id);

CREATE POLICY "Users can update their own testimonials"
    ON "DepoimentoResponsavel" FOR UPDATE
    USING (auth.uid() = responsavel_id);

CREATE POLICY "Users can delete their own testimonials"
    ON "DepoimentoResponsavel" FOR DELETE
    USING (auth.uid() = responsavel_id);

-- MaterialFavorito policies
CREATE POLICY "Users can view their own favorites"
    ON "MaterialFavorito" FOR SELECT
    USING (auth.uid() = responsavel_id);

CREATE POLICY "Users can insert their own favorites"
    ON "MaterialFavorito" FOR INSERT
    WITH CHECK (auth.uid() = responsavel_id);

CREATE POLICY "Users can delete their own favorites"
    ON "MaterialFavorito" FOR DELETE
    USING (auth.uid() = responsavel_id);

-- Public read access for reference tables
ALTER TABLE "TipoServico" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ServicoLocal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NivelSuporteTEA" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CategoriaMaterial" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MaterialDeApoio" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DadosEstatisticosTEA" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ArtigoInformativo" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view tipo servico"
    ON "TipoServico" FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Public can view servico local"
    ON "ServicoLocal" FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Public can view nivel suporte"
    ON "NivelSuporteTEA" FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Public can view categoria material"
    ON "CategoriaMaterial" FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Public can view material de apoio"
    ON "MaterialDeApoio" FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Public can view dados estatisticos"
    ON "DadosEstatisticosTEA" FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Public can view artigos"
    ON "ArtigoInformativo" FOR SELECT
    TO authenticated
    USING (true);

-- ============================================
-- FUNCTION: Auto-create Responsavel on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public."Responsavel" (id, nome, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create Responsavel when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================

-- Insert sample NivelSuporteTEA
INSERT INTO "NivelSuporteTEA" (nome, descricao) VALUES
    ('Nível 1 - Requer Apoio', 'Requer apoio para iniciar interações sociais e pode apresentar dificuldade em transições.'),
    ('Nível 2 - Requer Apoio Substancial', 'Requer apoio substancial com comunicação verbal e não verbal limitada.'),
    ('Nível 3 - Requer Apoio Muito Substancial', 'Requer apoio muito substancial com graves déficits na comunicação.');

-- Insert sample CategoriaMaterial
INSERT INTO "CategoriaMaterial" (nome, descricao) VALUES
    ('Educação', 'Materiais relacionados à educação e aprendizagem'),
    ('Comunicação', 'Recursos para desenvolvimento de comunicação'),
    ('Rotina', 'Materiais para estabelecimento de rotinas'),
    ('Sensorial', 'Recursos para regulação sensorial');

-- Insert sample TipoServico
INSERT INTO "TipoServico" (name, descricao) VALUES
    ('Terapia ABA', 'Análise do Comportamento Aplicada'),
    ('Fonoaudiologia', 'Terapia da fala e linguagem'),
    ('Terapia Ocupacional', 'Desenvolvimento de habilidades funcionais'),
    ('Psicologia', 'Suporte psicológico e comportamental');