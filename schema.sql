-- YLADA Database Schema
-- Tabelas para o sistema de geração de links via IA

-- Tabela de usuários (usando auth.users do Supabase)
-- CREATE TABLE users (
--   id UUID REFERENCES auth.users(id) PRIMARY KEY,
--   email TEXT UNIQUE NOT NULL,
--   full_name TEXT,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- Tabela de templates base
CREATE TABLE templates_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'quiz', 'tabela', 'landing', 'simulador'
  category TEXT NOT NULL, -- 'energia', 'beleza', 'fitness', 'negocios'
  content JSONB NOT NULL, -- Template content
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de links gerados
CREATE TABLE generated_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  template_id UUID REFERENCES templates_base(id),
  title TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL, -- Conteúdo personalizado
  url TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'expired'
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de leads capturados
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES generated_links(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  additional_data JSONB, -- Dados extras do formulário
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de templates gerados pela IA
CREATE TABLE templates_ia (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  template_generated JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  success_rate DECIMAL(3,2) DEFAULT 0.00,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de aprendizado da IA
CREATE TABLE ia_learning (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_pattern TEXT NOT NULL,
  template_suggested UUID REFERENCES templates_base(id),
  success_rate DECIMAL(3,2) DEFAULT 0.00,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_generated_links_slug ON generated_links(slug);
CREATE INDEX idx_generated_links_user_id ON generated_links(user_id);
CREATE INDEX idx_generated_links_status ON generated_links(status);
CREATE INDEX idx_leads_link_id ON leads(link_id);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_templates_base_type_category ON templates_base(type, category);
CREATE INDEX idx_templates_ia_prompt ON templates_ia(prompt);

-- RLS (Row Level Security) Policies
ALTER TABLE templates_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates_ia ENABLE ROW LEVEL SECURITY;
ALTER TABLE ia_learning ENABLE ROW LEVEL SECURITY;

-- Políticas para templates_base (público para leitura)
CREATE POLICY "Templates are viewable by everyone" ON templates_base
  FOR SELECT USING (true);

-- Políticas para generated_links
CREATE POLICY "Users can view their own links" ON generated_links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own links" ON generated_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links" ON generated_links
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para leads
CREATE POLICY "Users can view leads from their links" ON leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM generated_links 
      WHERE generated_links.id = leads.link_id 
      AND generated_links.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Políticas para templates_ia
CREATE POLICY "Users can view their own IA templates" ON templates_ia
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create IA templates" ON templates_ia
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_templates_base_updated_at BEFORE UPDATE ON templates_base
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_links_updated_at BEFORE UPDATE ON generated_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ia_learning_updated_at BEFORE UPDATE ON ia_learning
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir templates base iniciais
INSERT INTO templates_base (name, type, category, content) VALUES
('Quiz de Energia e Foco', 'quiz', 'energia', '{
  "title": "Quiz de Energia e Foco",
  "description": "Descubra como aumentar sua energia e foco diário",
  "questions": [
    {
      "question": "Como você se sente ao acordar?",
      "options": [
        "Muito energético e pronto para o dia",
        "Cansado e precisando de mais energia",
        "Neutro, depende do dia"
      ]
    },
    {
      "question": "Qual sua maior dificuldade para manter o foco?",
      "options": [
        "Distrações externas (redes sociais, notificações)",
        "Falta de energia física",
        "Falta de motivação"
      ]
    },
    {
      "question": "Que tipo de atividades te dão mais energia?",
      "options": [
        "Exercícios físicos",
        "Alimentação saudável",
        "Descanso e relaxamento"
      ]
    }
  ]
}'),
('Quiz de Rotina de Beleza', 'quiz', 'beleza', '{
  "title": "Quiz de Rotina de Beleza",
  "description": "Descubra sua rotina ideal de cuidados com a pele",
  "questions": [
    {
      "question": "Qual seu tipo de pele?",
      "options": ["Oleosa", "Seca", "Mista", "Sensível"]
    },
    {
      "question": "Qual sua maior preocupação com a pele?",
      "options": [
        "Acnes e espinhas",
        "Linhas de expressão",
        "Manchas e pigmentação",
        "Ressecamento"
      ]
    }
  ]
}'),
('Tabela de Metas Semanais', 'tabela', 'fitness', '{
  "title": "Tabela de Metas Semanais",
  "description": "Organize suas metas e acompanhe seu progresso",
  "categories": ["Saúde", "Trabalho", "Pessoal", "Fitness"]
}');

