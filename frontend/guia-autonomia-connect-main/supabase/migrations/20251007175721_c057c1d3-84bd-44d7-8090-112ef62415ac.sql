-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for support levels
CREATE TYPE support_level AS ENUM ('nivel_1', 'nivel_2', 'nivel_3');

-- Create enum for tip categories
CREATE TYPE tip_category AS ENUM ('higiene', 'educacao', 'atividades', 'alimentacao', 'comunicacao');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create dependents table
CREATE TABLE public.dependents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  support_level support_level NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.dependents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dependents"
  ON public.dependents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own dependents"
  ON public.dependents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dependents"
  ON public.dependents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dependents"
  ON public.dependents FOR DELETE
  USING (auth.uid() = user_id);

-- Create tips table
CREATE TABLE public.tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category tip_category NOT NULL,
  support_level support_level NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public tips"
  ON public.tips FOR SELECT
  USING (is_public = true);

-- Create favorite_tips table
CREATE TABLE public.favorite_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tip_id UUID NOT NULL REFERENCES public.tips(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tip_id)
);

ALTER TABLE public.favorite_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON public.favorite_tips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites"
  ON public.favorite_tips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.favorite_tips FOR DELETE
  USING (auth.uid() = user_id);

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  cep TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services"
  ON public.services FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample tips data
INSERT INTO public.tips (title, content, category, support_level) VALUES
('Rotina de Higiene Básica', 'Estabeleça uma rotina visual com imagens para cada etapa: escovar dentes, lavar mãos, tomar banho. Use timer para indicar o tempo de cada atividade.', 'higiene', 'nivel_1'),
('Higiene Pessoal Avançada', 'Incentive a autonomia gradual em atividades de higiene. Use reforço positivo e deixe a pessoa escolher produtos de higiene pessoal com texturas e aromas agradáveis.', 'higiene', 'nivel_2'),
('Cuidados de Higiene Específicos', 'Para pessoas com sensibilidade sensorial, adapte a temperatura da água, use escovas macias e introduza novos produtos gradualmente. Mantenha o ambiente calmo.', 'higiene', 'nivel_3'),

('Atividades Educacionais Visuais', 'Use recursos visuais como flashcards, aplicativos educativos com imagens claras e vídeos curtos. Foque em aprendizado através de repetição e reforço positivo.', 'educacao', 'nivel_1'),
('Educação com Suporte Moderado', 'Combine aprendizado verbal com visual. Use histórias sociais para ensinar conceitos abstratos. Divida tarefas complexas em passos menores.', 'educacao', 'nivel_2'),
('Educação Personalizada', 'Adapte o currículo às necessidades específicas. Use tecnologias assistivas, comunicação alternativa se necessário. Trabalhe em pequenos grupos ou individualment.', 'educacao', 'nivel_3'),

('Atividades Sensoriais Básicas', 'Ofereça atividades com diferentes texturas: massinha, areia, água. Observe as preferências e respeite os limites sensoriais da pessoa.', 'atividades', 'nivel_1'),
('Jogos e Interação Social', 'Promova jogos que estimulem interação social de forma estruturada. Use jogos de tabuleiro simples, atividades em grupo pequeno com regras claras.', 'atividades', 'nivel_2'),
('Atividades Terapêuticas Especializadas', 'Integre terapias ocupacionais e de integração sensorial. Atividades devem ser altamente personalizadas com acompanhamento profissional.', 'atividades', 'nivel_3'),

('Alimentação Estruturada', 'Crie uma rotina de alimentação com horários fixos. Use pratos coloridos e apresente alimentos de forma visual. Introduza novos alimentos gradualmente.', 'alimentacao', 'nivel_1'),
('Nutrição Equilibrada', 'Trabalhe com nutricionista para criar cardápio adaptado. Considere seletividade alimentar e texturas preferidas. Use reforço positivo para experimentar novos alimentos.', 'alimentacao', 'nivel_2'),
('Dieta Especializada', 'Para casos de restrições alimentares severas, trabalhe com equipe multidisciplinar. Considere suplementação se necessário. Mantenha diário alimentar detalhado.', 'alimentacao', 'nivel_3'),

('Comunicação Visual', 'Use PECS (Sistema de Comunicação por Troca de Figuras), gestos e apontamentos. Valide sempre a comunicação não-verbal da pessoa.', 'comunicacao', 'nivel_1'),
('Desenvolvimento da Fala', 'Estimule comunicação verbal com frases curtas e claras. Use apoio visual quando necessário. Pratique turnos de conversação em situações estruturadas.', 'comunicacao', 'nivel_2'),
('Comunicação Alternativa', 'Implemente sistemas de CAA (Comunicação Alternativa e Aumentativa) se necessário. Use tablets com aplicativos específicos. Trabalhe com fonoaudiólogo.', 'comunicacao', 'nivel_3');

-- Insert sample services data
INSERT INTO public.services (name, type, description, address, city, state, cep, phone) VALUES
('Centro de Apoio Especializado TEA', 'Centro de Apoio', 'Centro especializado em atendimento a pessoas com TEA, oferecendo terapias ocupacionais, fonoaudiologia e psicologia.', 'Rua das Flores, 123', 'São Paulo', 'SP', '01000-000', '(11) 3333-4444'),
('Escola Inclusiva Esperança', 'Escola', 'Escola com programa de educação inclusiva e profissionais capacitados para atendimento a crianças no espectro autista.', 'Av. Principal, 456', 'Rio de Janeiro', 'RJ', '20000-000', '(21) 2222-3333'),
('Clínica Multidisciplinar Vida Nova', 'Clínica', 'Clínica com equipe multidisciplinar especializada em TEA: neurologistas, psicólogos, terapeutas ocupacionais e fonoaudiólogos.', 'Rua da Saúde, 789', 'Belo Horizonte', 'MG', '30000-000', '(31) 9999-8888'),
('AMA - Associação dos Amigos do Autista', 'Centro de Apoio', 'Organização sem fins lucrativos que oferece suporte, orientação e atividades para pessoas com TEA e suas famílias.', 'Rua Solidária, 321', 'São Paulo', 'SP', '02000-000', '(11) 4444-5555');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dependents_updated_at BEFORE UPDATE ON public.dependents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();