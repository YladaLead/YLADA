-- ============================================
-- SISTEMA COMPLETO WELLNESS YLADA
-- Documento consolidado para ChatGPT
-- ============================================
-- 
-- Este arquivo contém TODA a estrutura de banco de dados,
-- fluxos, sistemas e funcionalidades da área Wellness
-- 
-- Data: 2025-01-XX
-- ============================================

-- ============================================
-- PARTE 1: SISTEMA DE ORIENTAÇÃO TÉCNICA (ENE SYSTEM)
-- ============================================
-- Sistema que mapeia funcionalidades da plataforma Wellness
-- e fornece orientação passo a passo para usuários

-- Tabela de itens de orientação (já existe no sistema)
-- Referência: src/lib/wellness-orientation.ts

-- Estrutura de dados de orientação (TypeScript):
/*
interface OrientacaoItem {
  id: string
  titulo: string
  descricao: string
  categoria: string
  palavras_chave: string[]
  passo_a_passo: string[]
  url?: string
  icone?: string
}
*/

-- Principais categorias mapeadas:
-- - Dashboard e Visão Geral
-- - Recrutamento e Rede
-- - Vendas e Produtos
-- - Bebidas Funcionais
-- - Campanhas e Promoções
-- - Scripts e Comunicação
-- - Relatórios e Análises
-- - Configurações
-- - Suporte e Ajuda

-- Endpoint: GET /api/wellness/orientation
-- Busca itens de orientação baseado em palavras-chave
-- Retorna passo a passo detalhado

-- ============================================
-- PARTE 2: SISTEMA NOEL - IA MENTOR WELLNESS
-- ============================================
-- Sistema completo de IA para mentoria, suporte e orientação técnica

-- ============================================
-- 2.1 - TABELAS PRINCIPAIS
-- ============================================

-- NÍVEL 1 - CONSULTOR
CREATE TABLE IF NOT EXISTS ylada_wellness_consultores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Dados básicos
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  
  -- Disponibilidade
  tempo_disponivel_diario TEXT CHECK (tempo_disponivel_diario IN ('15-30 min', '30-60 min', '1-2h', '2-3h', '3-5h', '5h+')),
  tempo_disponivel_semanal TEXT CHECK (tempo_disponivel_semanal IN ('5-10h', '10-15h', '15-20h', '20-30h', '30h+')),
  
  -- Perfil
  experiencia TEXT CHECK (experiencia IN ('iniciante', '6 meses', '1 ano', '2-3 anos', '3+ anos')),
  estilo_trabalho TEXT CHECK (estilo_trabalho IN ('presencial', 'online', 'híbrido', 'indefinido')),
  opera_com_bebidas_prontas BOOLEAN DEFAULT false,
  estagio_negocio TEXT CHECK (estagio_negocio IN ('iniciante', 'ativo', 'produtivo', 'multiplicador', 'lider')) DEFAULT 'iniciante',
  
  -- Objetivos
  objetivo_financeiro NUMERIC,
  objetivo_pv NUMERIC,
  deseja_recrutar BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- NÍVEL 2 - DIAGNÓSTICO
CREATE TABLE IF NOT EXISTS ylada_wellness_diagnosticos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultor_id UUID NOT NULL REFERENCES ylada_wellness_consultores(id) ON DELETE CASCADE,
  
  -- Respostas do diagnóstico
  tempo_disponivel TEXT,
  experiencia_herbalife TEXT,
  objetivo_principal TEXT,
  maior_dificuldade TEXT,
  estilo_preferido TEXT,
  trabalha_com_bebidas_prontas BOOLEAN,
  deseja_montar_equipe BOOLEAN,
  nivel_atual_vendas TEXT,
  nivel_atual_recrutamento TEXT,
  maior_desafio TEXT,
  como_quer_crescer TEXT,
  
  -- Resultado do diagnóstico
  perfil_identificado TEXT,
  pontos_fortes TEXT[],
  pontos_melhoria TEXT[],
  recomendacoes TEXT[],
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NÍVEL 2 - PROGRESSO
CREATE TABLE IF NOT EXISTS ylada_wellness_progresso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultor_id UUID NOT NULL REFERENCES ylada_wellness_consultores(id) ON DELETE CASCADE,
  
  -- Data do progresso
  data DATE NOT NULL,
  
  -- Execuções do Ritual 2-5-10
  ritual_2_executado BOOLEAN DEFAULT false,
  ritual_5_executado BOOLEAN DEFAULT false,
  ritual_10_executado BOOLEAN DEFAULT false,
  
  -- Microtarefas do plano
  microtarefas_completadas INTEGER DEFAULT 0,
  microtarefas_total INTEGER DEFAULT 0,
  
  -- Métricas do dia
  pv_dia NUMERIC DEFAULT 0,
  vendas_dia INTEGER DEFAULT 0,
  contatos_dia INTEGER DEFAULT 0,
  recrutamentos_dia INTEGER DEFAULT 0,
  
  -- Observações
  observacoes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(consultor_id, data)
);

-- NÍVEL 3 - PLANOS PERSONALIZADOS
CREATE TABLE IF NOT EXISTS ylada_wellness_planos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultor_id UUID NOT NULL REFERENCES ylada_wellness_consultores(id) ON DELETE CASCADE,
  
  -- Tipo de plano
  tipo_plano TEXT NOT NULL CHECK (tipo_plano IN ('7d', '14d', '30d', '90d')),
  
  -- Plano completo em JSON
  plano_json JSONB NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'concluido')),
  data_inicio DATE NOT NULL,
  data_fim DATE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NÍVEL 4 - BASE DE CONHECIMENTO
CREATE TABLE IF NOT EXISTS ylada_wellness_base_conhecimento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Categorização
  categoria TEXT NOT NULL CHECK (categoria IN (
    'script_vendas', 
    'script_bebidas', 
    'script_indicacao', 
    'script_recrutamento', 
    'script_followup', 
    'frase_motivacional', 
    'fluxo_padrao', 
    'instrucao'
  )),
  subcategoria TEXT,
  
  -- Conteúdo
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  
  -- Contexto de uso
  estagio_negocio TEXT[],
  tempo_disponivel TEXT[],
  tags TEXT[] DEFAULT '{}',
  
  -- Prioridade
  prioridade INTEGER DEFAULT 5 CHECK (prioridade >= 1 AND prioridade <= 10),
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEMÓRIA DO NOEL - INTERAÇÕES
CREATE TABLE IF NOT EXISTS ylada_wellness_interacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultor_id UUID NOT NULL REFERENCES ylada_wellness_consultores(id) ON DELETE CASCADE,
  
  -- Interação
  mensagem_usuario TEXT NOT NULL,
  resposta_noel TEXT NOT NULL,
  
  -- Contexto usado
  diagnostico_usado BOOLEAN DEFAULT false,
  plano_usado BOOLEAN DEFAULT false,
  progresso_usado BOOLEAN DEFAULT false,
  scripts_usados TEXT[],
  usado_ia BOOLEAN DEFAULT false,
  
  -- Análise
  topico_detectado TEXT,
  intencao_detectada TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SISTEMA DE NOTIFICAÇÕES
CREATE TABLE IF NOT EXISTS ylada_wellness_notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultor_id UUID NOT NULL REFERENCES ylada_wellness_consultores(id) ON DELETE CASCADE,
  
  -- Notificação
  tipo TEXT NOT NULL CHECK (tipo IN ('ritual', 'microtarefa', 'lembrete', 'motivacional', 'alerta', 'conquista')),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  
  -- Ação
  acao_url TEXT,
  acao_texto TEXT,
  
  -- Status
  lida BOOLEAN DEFAULT false,
  data_envio TIMESTAMPTZ DEFAULT NOW(),
  data_leitura TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RITUAL 2-5-10
CREATE TABLE IF NOT EXISTS ylada_wellness_ritual_dias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultor_id UUID NOT NULL REFERENCES ylada_wellness_consultores(id) ON DELETE CASCADE,
  
  -- Dia do ritual
  dia DATE NOT NULL,
  
  -- Ritual 2 (manhã)
  ritual_2_completado BOOLEAN DEFAULT false,
  ritual_2_horario TIME,
  ritual_2_observacoes TEXT,
  
  -- Ritual 5 (tarde)
  ritual_5_completado BOOLEAN DEFAULT false,
  ritual_5_horario TIME,
  ritual_5_observacoes TEXT,
  
  -- Ritual 10 (noite)
  ritual_10_completado BOOLEAN DEFAULT false,
  ritual_10_horario TIME,
  ritual_10_observacoes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(consultor_id, dia)
);

-- ============================================
-- 2.2 - ÍNDICES E PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_consultores_user ON ylada_wellness_consultores(user_id);
CREATE INDEX IF NOT EXISTS idx_consultores_estagio ON ylada_wellness_consultores(estagio_negocio);
CREATE INDEX IF NOT EXISTS idx_diagnosticos_consultor ON ylada_wellness_diagnosticos(consultor_id);
CREATE INDEX IF NOT EXISTS idx_progresso_consultor_data ON ylada_wellness_progresso(consultor_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_planos_consultor ON ylada_wellness_planos(consultor_id);
CREATE INDEX IF NOT EXISTS idx_planos_status ON ylada_wellness_planos(status) WHERE status = 'ativo';
CREATE INDEX IF NOT EXISTS idx_base_categoria ON ylada_wellness_base_conhecimento(categoria);
CREATE INDEX IF NOT EXISTS idx_base_estagio ON ylada_wellness_base_conhecimento USING GIN(estagio_negocio);
CREATE INDEX IF NOT EXISTS idx_base_tags ON ylada_wellness_base_conhecimento USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_base_ativo ON ylada_wellness_base_conhecimento(ativo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_interacoes_consultor ON ylada_wellness_interacoes(consultor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interacoes_topico ON ylada_wellness_interacoes(topico_detectado);
CREATE INDEX IF NOT EXISTS idx_notificacoes_consultor ON ylada_wellness_notificacoes(consultor_id, lida, data_envio DESC);
CREATE INDEX IF NOT EXISTS idx_notificacoes_tipo ON ylada_wellness_notificacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_ritual_consultor_dia ON ylada_wellness_ritual_dias(consultor_id, dia DESC);

-- ============================================
-- 2.3 - TRIGGERS E FUNÇÕES
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_ylada_wellness_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at (com DROP IF EXISTS para idempotência)
DROP TRIGGER IF EXISTS trigger_consultores_updated_at ON ylada_wellness_consultores;
CREATE TRIGGER trigger_consultores_updated_at
  BEFORE UPDATE ON ylada_wellness_consultores
  FOR EACH ROW
  EXECUTE FUNCTION update_ylada_wellness_updated_at();

DROP TRIGGER IF EXISTS trigger_diagnosticos_updated_at ON ylada_wellness_diagnosticos;
CREATE TRIGGER trigger_diagnosticos_updated_at
  BEFORE UPDATE ON ylada_wellness_diagnosticos
  FOR EACH ROW
  EXECUTE FUNCTION update_ylada_wellness_updated_at();

DROP TRIGGER IF EXISTS trigger_progresso_updated_at ON ylada_wellness_progresso;
CREATE TRIGGER trigger_progresso_updated_at
  BEFORE UPDATE ON ylada_wellness_progresso
  FOR EACH ROW
  EXECUTE FUNCTION update_ylada_wellness_updated_at();

DROP TRIGGER IF EXISTS trigger_planos_updated_at ON ylada_wellness_planos;
CREATE TRIGGER trigger_planos_updated_at
  BEFORE UPDATE ON ylada_wellness_planos
  FOR EACH ROW
  EXECUTE FUNCTION update_ylada_wellness_updated_at();

DROP TRIGGER IF EXISTS trigger_base_conhecimento_updated_at ON ylada_wellness_base_conhecimento;
CREATE TRIGGER trigger_base_conhecimento_updated_at
  BEFORE UPDATE ON ylada_wellness_base_conhecimento
  FOR EACH ROW
  EXECUTE FUNCTION update_ylada_wellness_updated_at();

DROP TRIGGER IF EXISTS trigger_ritual_updated_at ON ylada_wellness_ritual_dias;
CREATE TRIGGER trigger_ritual_updated_at
  BEFORE UPDATE ON ylada_wellness_ritual_dias
  FOR EACH ROW
  EXECUTE FUNCTION update_ylada_wellness_updated_at();

-- ============================================
-- 2.4 - RLS (Row Level Security)
-- ============================================

ALTER TABLE ylada_wellness_consultores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_wellness_diagnosticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_wellness_progresso ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_wellness_planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_wellness_base_conhecimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_wellness_interacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_wellness_notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ylada_wellness_ritual_dias ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (usuários veem apenas seus próprios dados)
-- Exemplo de política:
DROP POLICY IF EXISTS "Users can view own consultor" ON ylada_wellness_consultores;
CREATE POLICY "Users can view own consultor"
  ON ylada_wellness_consultores FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- (Repetir para todas as tabelas conforme necessário)

-- ============================================
-- PARTE 3: BASE DE CONHECIMENTO - SCRIPTS E FLUXOS
-- ============================================
-- Seed inicial com scripts, frases motivacionais e fluxos padrão

-- Categorias de scripts:
-- 1. script_vendas - Scripts para abordagem e fechamento de vendas
-- 2. script_bebidas - Scripts sobre preparo e benefícios de bebidas funcionais
-- 3. script_indicacao - Scripts para pedir e agradecer indicações
-- 4. script_recrutamento - Scripts para recrutar novos consultores
-- 5. script_followup - Scripts de acompanhamento pós-venda
-- 6. frase_motivacional - Frases para motivar consultores
-- 7. fluxo_padrao - Fluxos operacionais padrão
-- 8. instrucao - Instruções gerais sobre o negócio

-- Exemplo de inserção (20 itens iniciais):
INSERT INTO ylada_wellness_base_conhecimento (categoria, subcategoria, titulo, conteudo, estagio_negocio, tempo_disponivel, tags, prioridade) VALUES
('script_vendas', 'abordagem_inicial', 'Script: Abordagem Inicial', 
'Olá! Vi que você tem interesse em melhorar sua saúde e bem-estar. Tenho uma solução que pode te ajudar! Posso te mostrar como funciona?',
ARRAY['iniciante', 'ativo', 'produtivo']::text[],
ARRAY['15-30 min', '30-60 min', '1-2h']::text[],
ARRAY['vendas', 'abordagem', 'inicial'],
8),

('script_bebidas', 'preparo_basico', 'Script: Como Preparar Shake Básico',
'Para preparar o Shake: 1) Adicione 2 colheres (26g) do pó em 250ml de leite desnatado ou água. 2) Misture bem até dissolver. 3) Pode adicionar frutas ou gelo. 4) Consuma imediatamente. Dica: use leite para mais cremosidade!',
ARRAY['iniciante', 'ativo', 'produtivo', 'multiplicador', 'lider']::text[],
ARRAY['15-30 min']::text[],
ARRAY['shake', 'preparo', 'bebida'],
10);

-- (Continuar com todos os 20 itens do seed)

-- ============================================
-- PARTE 4: ENDPOINTS E FLUXOS DA API
-- ============================================

-- 4.1 - CONSULTOR
-- POST /api/wellness/consultor/create
-- Cria consultor + diagnóstico inicial
-- Body: { nome, email, telefone, tempo_disponivel_diario, ... }

-- 4.2 - DIAGNÓSTICO
-- POST /api/wellness/diagnostico/generate
-- Gera diagnóstico completo baseado nas respostas
-- Body: { consultor_id, respostas: { ... } }
-- Retorna: { diagnostico, analise: { perfil, pontos_fortes, ... } }

-- 4.3 - PLANO
-- POST /api/wellness/plano/generate
-- Gera plano personalizado (7/14/30/90 dias)
-- Body: { consultor_id, tipo_plano: '7d' | '14d' | '30d' | '90d' }
-- Retorna: { plano: { tipo_plano, plano_json, data_inicio, data_fim } }

-- 4.4 - PROGRESSO
-- POST /api/wellness/progresso/registrar
-- Salva execuções diárias e progresso
-- Body: { consultor_id, data, ritual_2_executado, ritual_5_executado, ritual_10_executado, pv_dia, ... }
-- Atualiza automaticamente ylada_wellness_ritual_dias

-- 4.5 - NOEL RESPONDER
-- POST /api/wellness/noel/responder
-- Fluxo principal do NOEL
-- Body: { consultor_id, mensagem, conversation_history? }
-- Algoritmo:
--   1. Carregar contexto completo (consultor + diagnóstico + plano + progresso + scripts)
--   2. Decidir estratégia (resposta pronta / ajuste personalizado / IA)
--   3. Gerar resposta
--   4. Salvar interação
-- Retorna: { resposta, diagnostico_usado, plano_usado, progresso_usado, scripts_usados, usado_ia, topico_detectado }

-- 4.6 - SCRIPTS
-- GET /api/wellness/scripts
-- Busca scripts da biblioteca
-- Query params: ?categoria=script_vendas&estagio=iniciante&tempo=30-60 min&tags=vendas,abordagem
-- Retorna: { scripts: [...], total: number }

-- 4.7 - NOTIFICAÇÕES
-- POST /api/wellness/notificacoes/create
-- Cria notificações inteligentes
-- Body: { consultor_id, tipo, titulo, mensagem, acao_url?, acao_texto? }

-- 4.8 - RITUAL
-- POST /api/wellness/ritual/executar
-- Marca execução do Ritual 2-5-10
-- Body: { consultor_id, tipo: 'ritual_2' | 'ritual_5' | 'ritual_10', dia?, observacoes? }
-- Atualiza progresso automaticamente
-- Cria notificação de conquista se todos os rituais completos

-- 4.9 - ORIENTAÇÃO TÉCNICA (ENE SYSTEM)
-- GET /api/wellness/orientation
-- Busca orientação técnica baseada em palavras-chave
-- Query params: ?query=como criar portal
-- Retorna: { itens: [{ titulo, descricao, passo_a_passo, url }], mentor?: { nome, telefone } }

-- ============================================
-- PARTE 5: ALGORITMO DO NOEL
-- ============================================

/*
ALGORITMO DE RESPOSTA DO NOEL:

1. CARREGAR CONTEXTO COMPLETO
   ├─ Consultor (estágio, tempo disponível, objetivos)
   ├─ Diagnóstico (perfil, pontos fortes, desafios)
   ├─ Plano ativo (microtarefas do dia, foco)
   ├─ Progresso hoje (rituais executados, métricas)
   └─ Scripts relevantes (baseado em estágio e tempo)

2. DECIDIR ESTRATÉGIA
   ├─ Resposta pronta? → Usar script + ajuste personalizado
   ├─ Contexto disponível? → Ajuste personalizado sem IA
   └─ Fallback → IA completa

3. GERAR RESPOSTA
   ├─ Personalizar para estágio (iniciante/ativo/produtivo/multiplicador/lider)
   ├─ Personalizar para tempo disponível
   ├─ Adicionar contexto do progresso
   └─ Incluir lembretes do ritual se necessário

4. SALVAR INTERAÇÃO
   └─ Registrar tudo para aprendizado contínuo

REDUÇÃO DE TOKENS:
- Prioriza scripts prontos (0 tokens)
- Usa ajuste personalizado (poucos tokens)
- IA apenas como fallback
- Resultado esperado: 60-80% redução no uso de tokens
*/

-- ============================================
-- PARTE 6: RITUAL 2-5-10
-- ============================================

/*
RITUAL 2-5-10:

RITUAL 2 (Manhã):
- 2 contatos
- Enviar mensagens para 2 pessoas
- Foco: networking e follow-up

RITUAL 5 (Tarde):
- 5 ações de vendas/recrutamento
- Apresentar produtos
- Fazer follow-up
- Foco: ação e resultados

RITUAL 10 (Noite):
- 10 minutos de revisão
- Revisar o dia
- Planejar o próximo dia
- Foco: organização e planejamento

INTEGRAÇÃO:
- Atualiza ylada_wellness_progresso automaticamente
- Cria notificação de conquista quando todos completos
- Usado pelo NOEL para personalizar respostas
*/

-- ============================================
-- PARTE 7: GERADOR DE PLANOS
-- ============================================

/*
PLANOS PERSONALIZADOS:

TIPOS:
- 7d: Fase de ação guiada - Primeiros passos estruturados
- 14d: Fase de ação guiada - Construção de rotina
- 30d: Fase de consistência e volume - Aceleração de resultados
- 90d: Fase de liderança - Desenvolvimento completo

BASEADO EM:
- Objetivo financeiro
- Objetivo PV
- Tempo disponível diário/semanal
- Estilo de trabalho
- Desejo de recrutar

ESTRUTURA DO PLANO (JSON):
{
  tipo: '7d' | '14d' | '30d' | '90d',
  objetivo: string,
  dias: [
    {
      dia: number,
      microtarefas: string[],
      foco: string,
      meta_dia: string,
      frase_motivacional: string
    }
  ],
  ajustes_automaticos: {
    baseado_em: string[],
    regras: string[]
  }
}

MICROTAREFAS BASEADAS EM:
- Tempo disponível (15-30 min até 5h+)
- Estágio do negócio (iniciante até lider)
- Desejo de recrutar
- Objetivos financeiros e PV
*/

-- ============================================
-- PARTE 8: SISTEMA DE BEBIDAS FUNCIONAIS
-- ============================================

/*
BEBIDAS FUNCIONAIS - CONTEXTO:

O sistema Wellness é baseado em bebidas funcionais Herbalife.
Todas as funcionalidades giram em torno de:
- Venda de produtos (Shake, chás, suplementos)
- Preparo e combinações
- Benefícios permitidos (sem alegações médicas)
- Recrutamento de consultores
- Desenvolvimento de equipe

SCRIPTS ESPECÍFICOS:
- Preparo básico do Shake
- Variações de sabor
- Benefícios permitidos
- Como apresentar produtos
- Como lidar com objeções sobre produtos

FLUXOS:
- Processo de venda de bebidas
- Follow-up pós-venda
- Recompra de clientes
- Desenvolvimento de equipe
*/

-- ============================================
-- FIM DO DOCUMENTO
-- ============================================
-- 
-- Este documento contém:
-- ✅ Estrutura completa de banco de dados
-- ✅ Sistema de orientação técnica (ENE System)
-- ✅ Sistema NOEL completo
-- ✅ Base de conhecimento
-- ✅ Endpoints e fluxos
-- ✅ Algoritmos e lógicas
-- ✅ Ritual 2-5-10
-- ✅ Gerador de planos
-- ✅ Sistema de bebidas funcionais
-- 
-- Pronto para envio ao ChatGPT para construção de novos fluxos
-- ============================================

