-- ============================================
-- TABELA: chat_qa (Perguntas e Respostas do ChatIA)
-- ============================================
-- Armazena perguntas frequentes e suas respostas
-- Permite melhorar o ChatIA ao longo do tempo sem custos de IA externa

CREATE TABLE IF NOT EXISTS chat_qa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Pergunta (normalizada para busca)
  pergunta TEXT NOT NULL,
  pergunta_normalizada TEXT NOT NULL, -- versão lowercase, sem acentos, para busca
  
  -- Resposta
  resposta TEXT NOT NULL,
  
  -- Contexto
  area TEXT, -- 'coach', 'nutri', 'wellness', ou NULL (todas)
  tags TEXT[], -- array de tags para categorização
  
  -- Estatísticas
  vezes_usada INTEGER DEFAULT 0, -- quantas vezes foi usada
  vezes_ajudou INTEGER DEFAULT 0, -- quantas vezes ajudou (feedback positivo)
  vezes_nao_ajudou INTEGER DEFAULT 0, -- quantas vezes não ajudou (feedback negativo)
  
  -- Controle
  ativa BOOLEAN DEFAULT true, -- se está ativa ou desativada
  prioridade INTEGER DEFAULT 0, -- maior prioridade = aparece primeiro na busca
  
  -- Metadados
  criado_por UUID REFERENCES auth.users(id), -- quem criou
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_chat_qa_pergunta_normalizada ON chat_qa USING gin(to_tsvector('portuguese', pergunta_normalizada));
CREATE INDEX IF NOT EXISTS idx_chat_qa_area ON chat_qa(area) WHERE area IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chat_qa_ativa ON chat_qa(ativa) WHERE ativa = true;
CREATE INDEX IF NOT EXISTS idx_chat_qa_prioridade ON chat_qa(prioridade DESC) WHERE ativa = true;
CREATE INDEX IF NOT EXISTS idx_chat_qa_tags ON chat_qa USING gin(tags);

-- Função para normalizar texto (remove acentos, lowercase)
CREATE OR REPLACE FUNCTION normalizar_texto(texto TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    translate(
      texto,
      'áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ',
      'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger para atualizar pergunta_normalizada automaticamente
CREATE OR REPLACE FUNCTION atualizar_pergunta_normalizada()
RETURNS TRIGGER AS $$
BEGIN
  NEW.pergunta_normalizada := normalizar_texto(NEW.pergunta);
  NEW.atualizado_em := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_pergunta_normalizada
  BEFORE INSERT OR UPDATE OF pergunta ON chat_qa
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_pergunta_normalizada();

-- Função para buscar respostas (usa full-text search)
CREATE OR REPLACE FUNCTION buscar_resposta_chat(
  p_pergunta TEXT,
  p_area TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  pergunta TEXT,
  resposta TEXT,
  area TEXT,
  tags TEXT[],
  relevancia REAL
) AS $$
DECLARE
  v_pergunta_normalizada TEXT;
BEGIN
  v_pergunta_normalizada := normalizar_texto(p_pergunta);
  
  RETURN QUERY
  SELECT 
    qa.id,
    qa.pergunta,
    qa.resposta,
    qa.area,
    qa.tags,
    -- Calcula relevância baseada em:
    -- 1. Similaridade de texto (ts_rank)
    -- 2. Prioridade
    -- 3. Estatísticas de uso
    (
      ts_rank(
        to_tsvector('portuguese', qa.pergunta_normalizada),
        plainto_tsquery('portuguese', v_pergunta_normalizada)
      ) * 0.5 +
      (qa.prioridade::REAL / 100.0) * 0.3 +
      (LEAST(qa.vezes_ajudou::REAL / NULLIF(qa.vezes_usada, 0), 1.0)) * 0.2
    ) AS relevancia
  FROM chat_qa qa
  WHERE 
    qa.ativa = true
    AND (
      p_area IS NULL 
      OR qa.area IS NULL 
      OR qa.area = p_area
    )
    AND (
      qa.pergunta_normalizada LIKE '%' || v_pergunta_normalizada || '%'
      OR to_tsvector('portuguese', qa.pergunta_normalizada) @@ plainto_tsquery('portuguese', v_pergunta_normalizada)
    )
  ORDER BY relevancia DESC, qa.prioridade DESC, qa.vezes_ajudou DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- Função para incrementar estatísticas
CREATE OR REPLACE FUNCTION incrementar_uso_chat_qa(
  p_id UUID,
  p_ajudou BOOLEAN DEFAULT true
)
RETURNS VOID AS $$
BEGIN
  UPDATE chat_qa
  SET 
    vezes_usada = vezes_usada + 1,
    vezes_ajudou = CASE WHEN p_ajudou THEN vezes_ajudou + 1 ELSE vezes_ajudou END,
    vezes_nao_ajudou = CASE WHEN NOT p_ajudou THEN vezes_nao_ajudou + 1 ELSE vezes_nao_ajudou END,
    atualizado_em = NOW()
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

-- RLS (Row Level Security)
ALTER TABLE chat_qa ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler respostas ativas
CREATE POLICY "chat_qa_select_ativa"
  ON chat_qa
  FOR SELECT
  USING (ativa = true);

-- Política: Apenas admins podem inserir/atualizar
CREATE POLICY "chat_qa_admin_all"
  ON chat_qa
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND perfil = 'admin'
    )
  );

-- Comentários
COMMENT ON TABLE chat_qa IS 'Armazena perguntas e respostas do ChatIA para aprendizado contínuo';
COMMENT ON COLUMN chat_qa.pergunta_normalizada IS 'Versão normalizada da pergunta para busca eficiente';
COMMENT ON COLUMN chat_qa.vezes_usada IS 'Contador de quantas vezes esta resposta foi usada';
COMMENT ON COLUMN chat_qa.prioridade IS 'Prioridade da resposta (maior = aparece primeiro)';

-- Inserir algumas respostas iniciais (exemplos)
INSERT INTO chat_qa (pergunta, resposta, area, tags, prioridade) VALUES
  ('Como cadastrar um cliente?', 'Para cadastrar um novo cliente, você tem duas opções:

1️⃣ **Pelo menu:** Vá em "Gestão" → "Meus Clientes" → Botão "Novo Cliente"
2️⃣ **Pela agenda:** Ao agendar uma consulta, clique em "Novo Cliente" no modal

No cadastro, preencha nome, email, telefone (com bandeira do país), data de nascimento, objetivo e status inicial. Você pode cadastrar rapidamente pela agenda e completar depois!', NULL, ARRAY['clientes', 'cadastro'], 10),
  
  ('Como usar o Kanban?', 'O Kanban mostra seus clientes organizados por status em colunas:

• **Contato** - Entrou agora, precisa de acolhimento
• **Pré-Consulta** - Já falou, falta agendar
• **Ativa** - Em atendimento
• **Pausa** - Deu um tempo
• **Finalizada** - Concluiu o ciclo

**Como mudar:** Arraste o card do cliente para a coluna desejada. O sistema salva automaticamente!

Acesse: Menu "Gestão" → "Kanban de Clientes"', NULL, ARRAY['kanban', 'clientes', 'gestão'], 10),
  
  ('Como agendar uma consulta?', 'Para agendar uma consulta:

**Opção 1:** Botão "Nova Consulta" no topo da agenda
**Opção 2:** Clique diretamente na data/horário desejado no calendário (mais rápido!)

No modal, selecione o cliente (ou crie um novo), defina título, data, horário, tipo e descrição.

**Dica:** Se clicar no calendário, a data e horário já vêm preenchidos!', NULL, ARRAY['agenda', 'consulta'], 10),
  
  ('Como autorizar um email?', 'Para autorizar um email para acesso gratuito:

1. Acesse o painel administrativo: `/admin/email-authorizations`
2. Preencha o email, selecione a área (Coach) e a validade em dias (ex: 365 para 1 ano).
3. Clique em "Criar Autorização".

Quando a pessoa se cadastrar com esse email, a assinatura será ativada automaticamente!', 'coach', ARRAY['autorização', 'email', 'admin'], 10)
ON CONFLICT DO NOTHING;

