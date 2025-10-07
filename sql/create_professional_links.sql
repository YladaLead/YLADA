-- Criar tabela professional_links
CREATE TABLE IF NOT EXISTS professional_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  tool_name VARCHAR(100) NOT NULL,
  cta_text VARCHAR(200) NOT NULL DEFAULT 'Falar com Especialista',
  redirect_url TEXT NOT NULL,
  custom_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_professional_links_professional_id ON professional_links(professional_id);
CREATE INDEX IF NOT EXISTS idx_professional_links_tool_name ON professional_links(tool_name);

-- Habilitar RLS (Row Level Security)
ALTER TABLE professional_links ENABLE ROW LEVEL SECURITY;

-- Política para profissionais verem apenas seus próprios links
CREATE POLICY "Professionals can view their own links" ON professional_links
  FOR SELECT USING (auth.uid() = professional_id);

-- Política para profissionais criarem seus próprios links
CREATE POLICY "Professionals can create their own links" ON professional_links
  FOR INSERT WITH CHECK (auth.uid() = professional_id);

-- Política para profissionais atualizarem seus próprios links
CREATE POLICY "Professionals can update their own links" ON professional_links
  FOR UPDATE USING (auth.uid() = professional_id);

-- Política para profissionais deletarem seus próprios links
CREATE POLICY "Professionals can delete their own links" ON professional_links
  FOR DELETE USING (auth.uid() = professional_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_professional_links_updated_at 
  BEFORE UPDATE ON professional_links 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

