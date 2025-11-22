-- =====================================================
-- ADICIONAR TABELA DE CONFIGURAÇÃO DO KANBAN
-- =====================================================
-- Permite que usuários personalizem colunas, campos do card e ações rápidas
-- =====================================================

CREATE TABLE IF NOT EXISTS kanban_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area VARCHAR(50) NOT NULL DEFAULT 'nutri', -- 'nutri', 'coach', 'wellness'
  
  -- Configuração de colunas
  columns JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Estrutura: [
  --   {
  --     "id": "uuid",
  --     "value": "ativa",
  --     "label": "Ativa",
  --     "description": "Em atendimento",
  --     "color": "border-green-200 bg-green-50",
  --     "order": 1
  --   }
  -- ]
  
  -- Configuração de campos do card
  card_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Estrutura: [
  --   { "field": "telefone", "visible": true },
  --   { "field": "email", "visible": false },
  --   { "field": "objetivo", "visible": true },
  --   { "field": "proxima_consulta", "visible": true },
  --   { "field": "ultima_consulta", "visible": true },
  --   { "field": "tags", "visible": false },
  --   { "field": "status_badge", "visible": true }
  -- ]
  
  -- Configuração de ações rápidas
  quick_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Estrutura: [
  --   { "action": "whatsapp", "visible": true },
  --   { "action": "ver_perfil", "visible": true }
  -- ]
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, area)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_kanban_config_user_area 
  ON kanban_config(user_id, area);

-- RLS
ALTER TABLE kanban_config ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários só veem/editam sua própria configuração
DROP POLICY IF EXISTS "Users can manage own kanban config" ON kanban_config;
CREATE POLICY "Users can manage own kanban config"
  ON kanban_config FOR ALL
  USING (auth.uid() = user_id);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_kanban_config_updated_at ON kanban_config;
CREATE TRIGGER update_kanban_config_updated_at
  BEFORE UPDATE ON kanban_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CRIAR CONFIGURAÇÃO PADRÃO PARA USUÁRIOS EXISTENTES
-- =====================================================
INSERT INTO kanban_config (user_id, area, columns, card_fields, quick_actions)
SELECT 
  DISTINCT user_id,
  'nutri' as area,
  '[
    {"id": "lead", "value": "lead", "label": "Contato", "description": "Entrou agora, precisa de acolhimento", "color": "border-blue-200 bg-blue-50", "order": 1},
    {"id": "pre_consulta", "value": "pre_consulta", "label": "Pré-Consulta", "description": "Já falou com você, falta agendar", "color": "border-yellow-200 bg-yellow-50", "order": 2},
    {"id": "ativa", "value": "ativa", "label": "Ativa", "description": "Em atendimento e com plano ativo", "color": "border-green-200 bg-green-50", "order": 3},
    {"id": "pausa", "value": "pausa", "label": "Pausa", "description": "Deu um tempo, precisa nutrir relação", "color": "border-orange-200 bg-orange-50", "order": 4},
    {"id": "finalizada", "value": "finalizada", "label": "Finalizada", "description": "Concluiu o ciclo com você", "color": "border-gray-200 bg-gray-50", "order": 5}
  ]'::jsonb as columns,
  '[
    {"field": "telefone", "visible": true},
    {"field": "email", "visible": false},
    {"field": "objetivo", "visible": true},
    {"field": "proxima_consulta", "visible": true},
    {"field": "ultima_consulta", "visible": true},
    {"field": "tags", "visible": false},
    {"field": "status_badge", "visible": true}
  ]'::jsonb as card_fields,
  '[
    {"action": "whatsapp", "visible": true},
    {"action": "ver_perfil", "visible": true}
  ]'::jsonb as quick_actions
FROM clients
WHERE user_id IS NOT NULL
ON CONFLICT (user_id, area) DO NOTHING;

-- Inserir configuração padrão para usuários Coach que já têm clientes
INSERT INTO kanban_config (user_id, area, columns, card_fields, quick_actions)
SELECT 
  DISTINCT user_id,
  'coach' as area,
  '[
    {"id": "lead", "value": "lead", "label": "Contato", "description": "Entrou agora, precisa de acolhimento", "color": "border-purple-200 bg-purple-50", "order": 1},
    {"id": "pre_consulta", "value": "pre_consulta", "label": "Pré-Consulta", "description": "Já falou com você, falta agendar", "color": "border-yellow-200 bg-yellow-50", "order": 2},
    {"id": "ativa", "value": "ativa", "label": "Ativa", "description": "Em atendimento e com plano ativo", "color": "border-green-200 bg-green-50", "order": 3},
    {"id": "pausa", "value": "pausa", "label": "Pausa", "description": "Deu um tempo, precisa nutrir relação", "color": "border-orange-200 bg-orange-50", "order": 4},
    {"id": "finalizada", "value": "finalizada", "label": "Finalizada", "description": "Concluiu o ciclo com você", "color": "border-gray-200 bg-gray-50", "order": 5}
  ]'::jsonb as columns,
  '[
    {"field": "telefone", "visible": true},
    {"field": "email", "visible": false},
    {"field": "objetivo", "visible": true},
    {"field": "proxima_consulta", "visible": true},
    {"field": "ultima_consulta", "visible": true},
    {"field": "tags", "visible": false},
    {"field": "status_badge", "visible": true}
  ]'::jsonb as card_fields,
  '[
    {"action": "whatsapp", "visible": true},
    {"action": "ver_perfil", "visible": true}
  ]'::jsonb as quick_actions
FROM coach_clients
WHERE user_id IS NOT NULL
ON CONFLICT (user_id, area) DO NOTHING;

-- =====================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================
COMMENT ON TABLE kanban_config IS 'Configurações personalizadas do Kanban por usuário e área';
COMMENT ON COLUMN kanban_config.columns IS 'Array JSONB de colunas customizadas do Kanban';
COMMENT ON COLUMN kanban_config.card_fields IS 'Array JSONB de campos do card (visíveis ou não)';
COMMENT ON COLUMN kanban_config.quick_actions IS 'Array JSONB de ações rápidas (visíveis ou não)';

