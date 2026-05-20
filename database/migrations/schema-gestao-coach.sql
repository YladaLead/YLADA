-- =====================================================
-- YLADA COACH - MÓDULO DE GESTÃO (CRM)
-- Schema completo para gestão de clientes, evolução,
-- histórico, agenda, avaliações, programas e formulários
-- =====================================================

-- =====================================================
-- 1. CLIENTES (Conversão de Leads)
-- =====================================================

-- Tabela principal de clientes
CREATE TABLE IF NOT EXISTS coach_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Coach
  lead_id UUID REFERENCES coach_leads(id) ON DELETE SET NULL, -- Lead original (se convertido)
  
  -- Dados básicos
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  birth_date DATE,
  gender VARCHAR(20), -- 'masculino', 'feminino', 'outro', 'prefiro_nao_informar'
  cpf VARCHAR(14), -- CPF (opcional, para consultas presenciais)
  
  -- Endereço
  address_street VARCHAR(255),
  address_number VARCHAR(20),
  address_complement VARCHAR(100),
  address_neighborhood VARCHAR(100),
  address_city VARCHAR(100),
  address_state VARCHAR(2), -- UF
  address_zipcode VARCHAR(10),
  
  -- Status e relacionamento
  status VARCHAR(50) DEFAULT 'ativo', -- 'ativo', 'inativo', 'pausado', 'encerrado'
  client_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_contact TIMESTAMP WITH TIME ZONE,
  next_appointment TIMESTAMP WITH TIME ZONE,
  
  -- Observações e anotações
  notes TEXT,
  tags TEXT[], -- Tags para organização (ex: ['emagrecimento', 'diabetes', 'atleta'])
  custom_fields JSONB, -- Campos personalizados adicionais
  
  -- Integração com Captação
  converted_from_lead BOOLEAN DEFAULT false, -- Se foi convertido de lead
  lead_source VARCHAR(100), -- Origem do lead (ex: 'quiz-emagrecimento', 'calculadora-imc')
  lead_template_id UUID REFERENCES coach_user_templates(id) ON DELETE SET NULL, -- Template que gerou o lead
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- 2. EVOLUÇÃO E HISTÓRICO
-- =====================================================

-- Tabela de evolução (peso, medidas, etc.)
CREATE TABLE IF NOT EXISTS coach_client_evolution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coach_clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Data da medição
  measurement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Medidas corporais
  weight DECIMAL(5,2), -- Peso (kg)
  height DECIMAL(3,2), -- Altura (m)
  bmi DECIMAL(4,2), -- IMC calculado
  
  -- Circunferências (cm)
  neck_circumference DECIMAL(5,2),
  chest_circumference DECIMAL(5,2),
  waist_circumference DECIMAL(5,2),
  hip_circumference DECIMAL(5,2),
  arm_circumference DECIMAL(5,2),
  thigh_circumference DECIMAL(5,2),
  
  -- Dobras cutâneas (mm) - opcional
  triceps_skinfold DECIMAL(5,2),
  biceps_skinfold DECIMAL(5,2),
  subscapular_skinfold DECIMAL(5,2),
  iliac_skinfold DECIMAL(5,2),
  abdominal_skinfold DECIMAL(5,2),
  thigh_skinfold DECIMAL(5,2),
  
  -- Composição corporal (se disponível)
  body_fat_percentage DECIMAL(5,2),
  muscle_mass DECIMAL(5,2),
  bone_mass DECIMAL(5,2),
  water_percentage DECIMAL(5,2),
  visceral_fat DECIMAL(5,2),
  
  -- Observações
  notes TEXT,
  photos_urls TEXT[], -- URLs de fotos de evolução (antes/depois)
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- 3. AGENDA
-- =====================================================

-- Tabela de consultas/agendamentos
CREATE TABLE IF NOT EXISTS coach_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coach_clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Dados do agendamento
  title VARCHAR(255) NOT NULL,
  description TEXT,
  appointment_type VARCHAR(50) DEFAULT 'consulta', -- 'consulta', 'retorno', 'avaliacao', 'acompanhamento', 'outro'
  
  -- Data e hora
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER, -- Duração em minutos
  
  -- Localização
  location_type VARCHAR(50) DEFAULT 'presencial', -- 'presencial', 'online', 'domicilio'
  location_address TEXT, -- Endereço (se presencial ou domicílio)
  location_url TEXT, -- URL (se online - Zoom, Meet, etc.)
  
  -- Status
  status VARCHAR(50) DEFAULT 'agendado', -- 'agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado', 'falta'
  confirmed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  
  -- Lembretes
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Anotações pós-consulta
  notes TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  next_appointment_suggested TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- 4. AVALIAÇÕES
-- =====================================================

-- Tabela de avaliações (antropométricas, bioimpedância, etc.)
CREATE TABLE IF NOT EXISTS coach_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coach_clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES coach_appointments(id) ON DELETE SET NULL, -- Se vinculado a uma consulta
  
  -- Tipo de avaliação
  assessment_type VARCHAR(100) NOT NULL, -- 'antropometrica', 'bioimpedancia', 'anamnese', 'questionario', 'reavaliacao', 'outro'
  assessment_name VARCHAR(255), -- Nome personalizado da avaliação
  
  -- Reavaliações (vinculação com avaliação anterior)
  is_reevaluation BOOLEAN DEFAULT false, -- Se é uma reavaliação
  parent_assessment_id UUID REFERENCES coach_assessments(id) ON DELETE SET NULL, -- Avaliação original (se reavaliação)
  assessment_number INTEGER, -- Número sequencial da avaliação (1, 2, 3...)
  
  -- Dados da avaliação (JSONB para flexibilidade)
  data JSONB NOT NULL, -- Estrutura varia conforme tipo de avaliação
  
  -- Resultados e interpretação
  results JSONB, -- Resultados calculados/interpretados
  interpretation TEXT, -- Interpretação do coach
  recommendations TEXT, -- Recomendações baseadas na avaliação
  
  -- Comparação com avaliação anterior (se reavaliação)
  comparison_data JSONB, -- Dados comparativos (diferenças, percentuais, etc.)
  
  -- Status
  status VARCHAR(50) DEFAULT 'rascunho', -- 'rascunho', 'completo', 'arquivado'
  completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- 5. PROGRAMAS
-- =====================================================

-- Tabela de programas/planos (planos alimentares, protocolos)
CREATE TABLE IF NOT EXISTS coach_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coach_clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Dados do programa
  name VARCHAR(255) NOT NULL,
  description TEXT,
  program_type VARCHAR(100) DEFAULT 'plano_alimentar', -- 'plano_alimentar', 'protocolo', 'treinamento', 'desafio', 'outro'
  
  -- Período
  start_date DATE NOT NULL,
  end_date DATE, -- NULL = sem data de término
  duration_days INTEGER, -- Duração em dias
  
  -- Status
  status VARCHAR(50) DEFAULT 'ativo', -- 'rascunho', 'ativo', 'pausado', 'concluido', 'cancelado'
  
  -- Conteúdo do programa (JSONB para flexibilidade)
  content JSONB NOT NULL, -- Estrutura varia conforme tipo de programa
  -- Exemplo para plano alimentar:
  -- {
  --   "meals": [
  --     {"meal": "cafe_manha", "time": "07:00", "items": [...]},
  --     {"meal": "lanche_manha", "time": "10:00", "items": [...]},
  --     ...
  --   ],
  --   "macros": {"protein": 120, "carbs": 200, "fat": 60},
  --   "calories": 2000
  -- }
  
  -- Acompanhamento
  adherence_percentage DECIMAL(5,2), -- Percentual de adesão
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- 6. FORMULÁRIOS PERSONALIZADOS
-- =====================================================

-- Tabela de formulários personalizados (templates)
CREATE TABLE IF NOT EXISTS coach_custom_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Dados do formulário
  name VARCHAR(255) NOT NULL,
  description TEXT,
  form_type VARCHAR(100) DEFAULT 'questionario', -- 'questionario', 'anamnese', 'avaliacao', 'consentimento', 'outro'
  
  -- Estrutura do formulário (JSONB)
  structure JSONB NOT NULL, -- Campos, perguntas, validações, etc.
  -- Exemplo:
  -- {
  --   "fields": [
  --     {"id": "field1", "type": "text", "label": "Nome", "required": true},
  --     {"id": "field2", "type": "select", "label": "Objetivo", "options": [...], "required": true},
  --     {"id": "field3", "type": "textarea", "label": "Observações", "required": false}
  --   ]
  -- }
  
  -- Configurações
  is_active BOOLEAN DEFAULT true,
  is_template BOOLEAN DEFAULT false, -- Se é um template reutilizável
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de respostas aos formulários personalizados
CREATE TABLE IF NOT EXISTS coach_form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES coach_custom_forms(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES coach_clients(id) ON DELETE SET NULL, -- NULL se formulário preenchido antes de ser cliente
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- user_id do criador do formulário
  
  -- Respostas (JSONB)
  responses JSONB NOT NULL, -- Respostas do cliente
  
  -- Metadados
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. HISTÓRICO E ATIVIDADES
-- =====================================================

-- Tabela de histórico/atividades (log de ações)
CREATE TABLE IF NOT EXISTS coach_client_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coach_clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Tipo de atividade
  activity_type VARCHAR(100) NOT NULL, -- 'consulta', 'avaliacao', 'programa_criado', 'programa_atualizado', 'nota_adicionada', 'status_alterado', 'registro_emocional', 'registro_comportamental', 'outro'
  
  -- Dados da atividade
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB, -- Dados adicionais específicos do tipo de atividade
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- 8. HISTÓRICO EMOCIONAL E COMPORTAMENTAL
-- =====================================================

-- Tabela específica para registro emocional e comportamental
CREATE TABLE IF NOT EXISTS coach_emotional_behavioral_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coach_clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES coach_appointments(id) ON DELETE SET NULL, -- Se vinculado a uma consulta
  
  -- Data do registro
  record_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Tipo de registro
  record_type VARCHAR(50) NOT NULL, -- 'emocional', 'comportamental', 'ambos'
  
  -- Registro Emocional
  emotional_state VARCHAR(100), -- 'ansioso', 'estressado', 'motivado', 'desanimado', 'equilibrado', 'outro'
  emotional_notes TEXT, -- Observações sobre estado emocional
  stress_level INTEGER, -- Nível de estresse (1-10)
  mood_score INTEGER, -- Score de humor (1-10)
  sleep_quality VARCHAR(50), -- 'otimo', 'bom', 'regular', 'ruim', 'pessimo'
  energy_level VARCHAR(50), -- 'alta', 'media', 'baixa'
  
  -- Registro Comportamental
  adherence_score INTEGER, -- Score de adesão ao programa (1-10)
  meal_following_percentage DECIMAL(5,2), -- Percentual de refeições seguidas
  exercise_frequency VARCHAR(50), -- Frequência de exercícios
  water_intake_liters DECIMAL(4,2), -- Ingestão de água (litros)
  behavioral_notes TEXT, -- Observações comportamentais
  
  -- Padrões identificados
  patterns_identified TEXT[], -- Padrões identificados (ex: ['come por ansiedade', 'pula refeições'])
  triggers TEXT[], -- Gatilhos identificados (ex: ['trabalho', 'fim de semana'])
  
  -- Observações gerais
  notes TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- 8. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Clientes
CREATE INDEX IF NOT EXISTS idx_coach_clients_user_id ON coach_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_clients_lead_id ON coach_clients(lead_id);
CREATE INDEX IF NOT EXISTS idx_coach_clients_status ON coach_clients(status);
CREATE INDEX IF NOT EXISTS idx_coach_clients_created_at ON coach_clients(created_at);
CREATE INDEX IF NOT EXISTS idx_coach_clients_name ON coach_clients(name);
CREATE INDEX IF NOT EXISTS idx_coach_clients_lead_source ON coach_clients(lead_source);
CREATE INDEX IF NOT EXISTS idx_coach_clients_converted_from_lead ON coach_clients(converted_from_lead);

-- Evolução
CREATE INDEX IF NOT EXISTS idx_coach_evolution_client_id ON coach_client_evolution(client_id);
CREATE INDEX IF NOT EXISTS idx_coach_evolution_user_id ON coach_client_evolution(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_evolution_date ON coach_client_evolution(measurement_date);

-- Agenda
CREATE INDEX IF NOT EXISTS idx_coach_appointments_client_id ON coach_appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_coach_appointments_user_id ON coach_appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_appointments_start_time ON coach_appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_coach_appointments_status ON coach_appointments(status);

-- Avaliações
CREATE INDEX IF NOT EXISTS idx_coach_assessments_client_id ON coach_assessments(client_id);
CREATE INDEX IF NOT EXISTS idx_coach_assessments_user_id ON coach_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_assessments_type ON coach_assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_coach_assessments_parent_id ON coach_assessments(parent_assessment_id);
CREATE INDEX IF NOT EXISTS idx_coach_assessments_is_reevaluation ON coach_assessments(is_reevaluation);

-- Programas
CREATE INDEX IF NOT EXISTS idx_coach_programs_client_id ON coach_programs(client_id);
CREATE INDEX IF NOT EXISTS idx_coach_programs_user_id ON coach_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_programs_status ON coach_programs(status);

-- Formulários
CREATE INDEX IF NOT EXISTS idx_coach_custom_forms_user_id ON coach_custom_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_form_responses_form_id ON coach_form_responses(form_id);
CREATE INDEX IF NOT EXISTS idx_coach_form_responses_client_id ON coach_form_responses(client_id);

-- Histórico
CREATE INDEX IF NOT EXISTS idx_coach_history_client_id ON coach_client_history(client_id);
CREATE INDEX IF NOT EXISTS idx_coach_history_user_id ON coach_client_history(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_history_created_at ON coach_client_history(created_at);

-- Histórico Emocional e Comportamental
CREATE INDEX IF NOT EXISTS idx_coach_emotional_behavioral_client_id ON coach_emotional_behavioral_history(client_id);
CREATE INDEX IF NOT EXISTS idx_coach_emotional_behavioral_user_id ON coach_emotional_behavioral_history(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_emotional_behavioral_record_date ON coach_emotional_behavioral_history(record_date);
CREATE INDEX IF NOT EXISTS idx_coach_emotional_behavioral_type ON coach_emotional_behavioral_history(record_type);

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE coach_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_client_evolution ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_custom_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_form_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_client_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_emotional_behavioral_history ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança: usuários só veem/gerenciam seus próprios dados

-- Clientes
DROP POLICY IF EXISTS "Users can view own coach clients" ON coach_clients;
DROP POLICY IF EXISTS "Users can insert own coach clients" ON coach_clients;
DROP POLICY IF EXISTS "Users can update own coach clients" ON coach_clients;
DROP POLICY IF EXISTS "Users can delete own coach clients" ON coach_clients;

CREATE POLICY "Users can view own coach clients" ON coach_clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coach clients" ON coach_clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coach clients" ON coach_clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coach clients" ON coach_clients FOR DELETE USING (auth.uid() = user_id);

-- Evolução
DROP POLICY IF EXISTS "Users can view own coach evolution" ON coach_client_evolution;
DROP POLICY IF EXISTS "Users can insert own coach evolution" ON coach_client_evolution;
DROP POLICY IF EXISTS "Users can update own coach evolution" ON coach_client_evolution;
DROP POLICY IF EXISTS "Users can delete own coach evolution" ON coach_client_evolution;

CREATE POLICY "Users can view own coach evolution" ON coach_client_evolution FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coach evolution" ON coach_client_evolution FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coach evolution" ON coach_client_evolution FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coach evolution" ON coach_client_evolution FOR DELETE USING (auth.uid() = user_id);

-- Agenda
DROP POLICY IF EXISTS "Users can view own coach appointments" ON coach_appointments;
DROP POLICY IF EXISTS "Users can insert own coach appointments" ON coach_appointments;
DROP POLICY IF EXISTS "Users can update own coach appointments" ON coach_appointments;
DROP POLICY IF EXISTS "Users can delete own coach appointments" ON coach_appointments;

CREATE POLICY "Users can view own coach appointments" ON coach_appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coach appointments" ON coach_appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coach appointments" ON coach_appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coach appointments" ON coach_appointments FOR DELETE USING (auth.uid() = user_id);

-- Avaliações
DROP POLICY IF EXISTS "Users can view own coach assessments" ON coach_assessments;
DROP POLICY IF EXISTS "Users can insert own coach assessments" ON coach_assessments;
DROP POLICY IF EXISTS "Users can update own coach assessments" ON coach_assessments;
DROP POLICY IF EXISTS "Users can delete own coach assessments" ON coach_assessments;

CREATE POLICY "Users can view own coach assessments" ON coach_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coach assessments" ON coach_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coach assessments" ON coach_assessments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coach assessments" ON coach_assessments FOR DELETE USING (auth.uid() = user_id);

-- Programas
DROP POLICY IF EXISTS "Users can view own coach programs" ON coach_programs;
DROP POLICY IF EXISTS "Users can insert own coach programs" ON coach_programs;
DROP POLICY IF EXISTS "Users can update own coach programs" ON coach_programs;
DROP POLICY IF EXISTS "Users can delete own coach programs" ON coach_programs;

CREATE POLICY "Users can view own coach programs" ON coach_programs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coach programs" ON coach_programs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coach programs" ON coach_programs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coach programs" ON coach_programs FOR DELETE USING (auth.uid() = user_id);

-- Formulários personalizados
DROP POLICY IF EXISTS "Users can view own coach forms" ON coach_custom_forms;
DROP POLICY IF EXISTS "Users can insert own coach forms" ON coach_custom_forms;
DROP POLICY IF EXISTS "Users can update own coach forms" ON coach_custom_forms;
DROP POLICY IF EXISTS "Users can delete own coach forms" ON coach_custom_forms;

CREATE POLICY "Users can view own coach forms" ON coach_custom_forms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coach forms" ON coach_custom_forms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coach forms" ON coach_custom_forms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coach forms" ON coach_custom_forms FOR DELETE USING (auth.uid() = user_id);

-- Respostas de formulários
DROP POLICY IF EXISTS "Users can view own coach form responses" ON coach_form_responses;
DROP POLICY IF EXISTS "Users can insert coach form responses" ON coach_form_responses;

CREATE POLICY "Users can view own coach form responses" ON coach_form_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert coach form responses" ON coach_form_responses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Histórico
DROP POLICY IF EXISTS "Users can view own coach history" ON coach_client_history;
DROP POLICY IF EXISTS "Users can insert own coach history" ON coach_client_history;

CREATE POLICY "Users can view own coach history" ON coach_client_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coach history" ON coach_client_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Histórico Emocional e Comportamental
DROP POLICY IF EXISTS "Users can view own coach emotional behavioral history" ON coach_emotional_behavioral_history;
DROP POLICY IF EXISTS "Users can insert own coach emotional behavioral history" ON coach_emotional_behavioral_history;
DROP POLICY IF EXISTS "Users can update own coach emotional behavioral history" ON coach_emotional_behavioral_history;
DROP POLICY IF EXISTS "Users can delete own coach emotional behavioral history" ON coach_emotional_behavioral_history;

CREATE POLICY "Users can view own coach emotional behavioral history" ON coach_emotional_behavioral_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coach emotional behavioral history" ON coach_emotional_behavioral_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coach emotional behavioral history" ON coach_emotional_behavioral_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coach emotional behavioral history" ON coach_emotional_behavioral_history FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 10. FUNÇÕES ÚTEIS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_coach_clients_updated_at ON coach_clients;
CREATE TRIGGER update_coach_clients_updated_at BEFORE UPDATE ON coach_clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coach_appointments_updated_at ON coach_appointments;
CREATE TRIGGER update_coach_appointments_updated_at BEFORE UPDATE ON coach_appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coach_assessments_updated_at ON coach_assessments;
CREATE TRIGGER update_coach_assessments_updated_at BEFORE UPDATE ON coach_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coach_programs_updated_at ON coach_programs;
CREATE TRIGGER update_coach_programs_updated_at BEFORE UPDATE ON coach_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coach_custom_forms_updated_at ON coach_custom_forms;
CREATE TRIGGER update_coach_custom_forms_updated_at BEFORE UPDATE ON coach_custom_forms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coach_emotional_behavioral_updated_at ON coach_emotional_behavioral_history;
CREATE TRIGGER update_coach_emotional_behavioral_updated_at BEFORE UPDATE ON coach_emotional_behavioral_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular IMC automaticamente
CREATE OR REPLACE FUNCTION calculate_bmi()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.weight IS NOT NULL AND NEW.height IS NOT NULL AND NEW.height > 0 THEN
        NEW.bmi = NEW.weight / (NEW.height * NEW.height);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para calcular IMC
DROP TRIGGER IF EXISTS calculate_coach_bmi_trigger ON coach_client_evolution;
CREATE TRIGGER calculate_coach_bmi_trigger BEFORE INSERT OR UPDATE ON coach_client_evolution
    FOR EACH ROW EXECUTE FUNCTION calculate_bmi();

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================

