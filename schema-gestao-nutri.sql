-- =====================================================
-- YLADA NUTRI - MÓDULO DE GESTÃO (CRM)
-- Schema completo para gestão de clientes, evolução,
-- histórico, agenda, avaliações, programas e formulários
-- =====================================================

-- =====================================================
-- 1. CLIENTES (Conversão de Leads)
-- =====================================================

-- Tabela principal de clientes
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL, -- Nutricionista
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL, -- Lead original (se convertido)
  
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
  lead_template_id UUID REFERENCES user_templates(id) ON DELETE SET NULL, -- Template que gerou o lead
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- =====================================================
-- 2. EVOLUÇÃO E HISTÓRICO
-- =====================================================

-- Tabela de evolução (peso, medidas, etc.)
CREATE TABLE IF NOT EXISTS client_evolution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
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
  created_by UUID REFERENCES users(id)
);

-- =====================================================
-- 3. AGENDA
-- =====================================================

-- Tabela de consultas/agendamentos
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
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
  created_by UUID REFERENCES users(id)
);

-- =====================================================
-- 4. AVALIAÇÕES
-- =====================================================

-- Tabela de avaliações (antropométricas, bioimpedância, etc.)
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL, -- Se vinculado a uma consulta
  
  -- Tipo de avaliação
  assessment_type VARCHAR(100) NOT NULL, -- 'antropometrica', 'bioimpedancia', 'anamnese', 'questionario', 'reavaliacao', 'outro'
  assessment_name VARCHAR(255), -- Nome personalizado da avaliação
  
  -- Reavaliações (vinculação com avaliação anterior)
  is_reevaluation BOOLEAN DEFAULT false, -- Se é uma reavaliação
  parent_assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL, -- Avaliação original (se reavaliação)
  assessment_number INTEGER, -- Número sequencial da avaliação (1, 2, 3...)
  
  -- Dados da avaliação (JSONB para flexibilidade)
  data JSONB NOT NULL, -- Estrutura varia conforme tipo de avaliação
  
  -- Resultados e interpretação
  results JSONB, -- Resultados calculados/interpretados
  interpretation TEXT, -- Interpretação do nutricionista
  recommendations TEXT, -- Recomendações baseadas na avaliação
  
  -- Comparação com avaliação anterior (se reavaliação)
  comparison_data JSONB, -- Dados comparativos (diferenças, percentuais, etc.)
  
  -- Status
  status VARCHAR(50) DEFAULT 'rascunho', -- 'rascunho', 'completo', 'arquivado'
  completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- =====================================================
-- 5. PROGRAMAS
-- =====================================================

-- Tabela de programas/planos (planos alimentares, protocolos)
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
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
  created_by UUID REFERENCES users(id)
);

-- =====================================================
-- 6. FORMULÁRIOS PERSONALIZADOS
-- =====================================================

-- Tabela de formulários personalizados (templates)
CREATE TABLE IF NOT EXISTS custom_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
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
CREATE TABLE IF NOT EXISTS form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES custom_forms(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
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
CREATE TABLE IF NOT EXISTS client_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Tipo de atividade
  activity_type VARCHAR(100) NOT NULL, -- 'consulta', 'avaliacao', 'programa_criado', 'programa_atualizado', 'nota_adicionada', 'status_alterado', 'registro_emocional', 'registro_comportamental', 'outro'
  
  -- Dados da atividade
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB, -- Dados adicionais específicos do tipo de atividade
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- =====================================================
-- 8. HISTÓRICO EMOCIONAL E COMPORTAMENTAL
-- =====================================================

-- Tabela específica para registro emocional e comportamental
CREATE TABLE IF NOT EXISTS emotional_behavioral_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL, -- Se vinculado a uma consulta
  
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
  created_by UUID REFERENCES users(id)
);

-- =====================================================
-- 8. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Clientes
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_lead_id ON clients(lead_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_lead_source ON clients(lead_source);
CREATE INDEX IF NOT EXISTS idx_clients_converted_from_lead ON clients(converted_from_lead);

-- Evolução
CREATE INDEX IF NOT EXISTS idx_evolution_client_id ON client_evolution(client_id);
CREATE INDEX IF NOT EXISTS idx_evolution_user_id ON client_evolution(user_id);
CREATE INDEX IF NOT EXISTS idx_evolution_date ON client_evolution(measurement_date);

-- Agenda
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Avaliações
CREATE INDEX IF NOT EXISTS idx_assessments_client_id ON assessments(client_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessments_parent_id ON assessments(parent_assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessments_is_reevaluation ON assessments(is_reevaluation);

-- Programas
CREATE INDEX IF NOT EXISTS idx_programs_client_id ON programs(client_id);
CREATE INDEX IF NOT EXISTS idx_programs_user_id ON programs(user_id);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);

-- Formulários
CREATE INDEX IF NOT EXISTS idx_custom_forms_user_id ON custom_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_form_id ON form_responses(form_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_client_id ON form_responses(client_id);

-- Histórico
CREATE INDEX IF NOT EXISTS idx_history_client_id ON client_history(client_id);
CREATE INDEX IF NOT EXISTS idx_history_user_id ON client_history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_created_at ON client_history(created_at);

-- Histórico Emocional e Comportamental
CREATE INDEX IF NOT EXISTS idx_emotional_behavioral_client_id ON emotional_behavioral_history(client_id);
CREATE INDEX IF NOT EXISTS idx_emotional_behavioral_user_id ON emotional_behavioral_history(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_behavioral_record_date ON emotional_behavioral_history(record_date);
CREATE INDEX IF NOT EXISTS idx_emotional_behavioral_type ON emotional_behavioral_history(record_type);

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_evolution ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_behavioral_history ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança: usuários só veem/gerenciam seus próprios dados

-- Clientes
CREATE POLICY "Users can view own clients" ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clients" ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clients" ON clients FOR DELETE USING (auth.uid() = user_id);

-- Evolução
CREATE POLICY "Users can view own evolution" ON client_evolution FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own evolution" ON client_evolution FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own evolution" ON client_evolution FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own evolution" ON client_evolution FOR DELETE USING (auth.uid() = user_id);

-- Agenda
CREATE POLICY "Users can view own appointments" ON appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own appointments" ON appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own appointments" ON appointments FOR DELETE USING (auth.uid() = user_id);

-- Avaliações
CREATE POLICY "Users can view own assessments" ON assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessments" ON assessments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own assessments" ON assessments FOR DELETE USING (auth.uid() = user_id);

-- Programas
CREATE POLICY "Users can view own programs" ON programs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own programs" ON programs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own programs" ON programs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own programs" ON programs FOR DELETE USING (auth.uid() = user_id);

-- Formulários personalizados
CREATE POLICY "Users can view own forms" ON custom_forms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own forms" ON custom_forms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own forms" ON custom_forms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own forms" ON custom_forms FOR DELETE USING (auth.uid() = user_id);

-- Respostas de formulários
CREATE POLICY "Users can view own form responses" ON form_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert form responses" ON form_responses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Histórico
CREATE POLICY "Users can view own history" ON client_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON client_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Histórico Emocional e Comportamental
CREATE POLICY "Users can view own emotional behavioral history" ON emotional_behavioral_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own emotional behavioral history" ON emotional_behavioral_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own emotional behavioral history" ON emotional_behavioral_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own emotional behavioral history" ON emotional_behavioral_history FOR DELETE USING (auth.uid() = user_id);

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
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_forms_updated_at BEFORE UPDATE ON custom_forms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emotional_behavioral_updated_at BEFORE UPDATE ON emotional_behavioral_history
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
CREATE TRIGGER calculate_bmi_trigger BEFORE INSERT OR UPDATE ON client_evolution
    FOR EACH ROW EXECUTE FUNCTION calculate_bmi();

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================

