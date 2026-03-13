-- Knowledge Layer do Noel: bibliotecas estruturadas para consulta antes de responder
-- diagnosis_library, strategy_library, conversation_library, market_insights
-- Ver: docs/YLADA-ARQUITETURA-COMPLETA.md

-- 1) Biblioteca de estratégias (alimenta Noel Mentor)
CREATE TABLE IF NOT EXISTS noel_strategy_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  problem TEXT,
  strategy TEXT NOT NULL,
  example TEXT,
  next_action TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_noel_strategy_library_topic ON noel_strategy_library(topic);
COMMENT ON TABLE noel_strategy_library IS 'Estratégias por tópico para o Noel Mentor (Knowledge Layer).';

-- 2) Biblioteca de conversas (respostas boas que geram conversas boas)
CREATE TABLE IF NOT EXISTS noel_conversation_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario TEXT NOT NULL,
  user_question TEXT NOT NULL,
  good_answer TEXT NOT NULL,
  why_it_works TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_noel_conversation_library_scenario ON noel_conversation_library(scenario);
COMMENT ON TABLE noel_conversation_library IS 'Exemplos de perguntas e respostas boas para o Noel (Knowledge Layer).';

-- 3) Insights de mercado (alimenta Noel Analista; complementar a diagnosis_insights)
CREATE TABLE IF NOT EXISTS noel_market_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment TEXT NOT NULL,
  pattern TEXT NOT NULL,
  frequency NUMERIC(5,2),
  insight TEXT NOT NULL,
  recommended_action TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_noel_market_insights_segment ON noel_market_insights(segment);
COMMENT ON TABLE noel_market_insights IS 'Padrões e insights por segmento para o Noel Analista (Knowledge Layer).';
