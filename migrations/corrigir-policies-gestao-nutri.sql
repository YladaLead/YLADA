-- =====================================================
-- CORRIGIR POLICIES DO MÓDULO DE GESTÃO
-- =====================================================
-- Este script remove e recria todas as policies para evitar conflitos
-- Execute este script se receber erro de "policy already exists"

-- Clientes
DROP POLICY IF EXISTS "Users can view own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert own clients" ON clients;
DROP POLICY IF EXISTS "Users can update own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON clients;

CREATE POLICY "Users can view own clients" ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clients" ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clients" ON clients FOR DELETE USING (auth.uid() = user_id);

-- Evolução
DROP POLICY IF EXISTS "Users can view own evolution" ON client_evolution;
DROP POLICY IF EXISTS "Users can insert own evolution" ON client_evolution;
DROP POLICY IF EXISTS "Users can update own evolution" ON client_evolution;
DROP POLICY IF EXISTS "Users can delete own evolution" ON client_evolution;

CREATE POLICY "Users can view own evolution" ON client_evolution FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own evolution" ON client_evolution FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own evolution" ON client_evolution FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own evolution" ON client_evolution FOR DELETE USING (auth.uid() = user_id);

-- Agenda
DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can insert own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete own appointments" ON appointments;

CREATE POLICY "Users can view own appointments" ON appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own appointments" ON appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own appointments" ON appointments FOR DELETE USING (auth.uid() = user_id);

-- Avaliações
DROP POLICY IF EXISTS "Users can view own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can insert own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can update own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can delete own assessments" ON assessments;

CREATE POLICY "Users can view own assessments" ON assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessments" ON assessments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own assessments" ON assessments FOR DELETE USING (auth.uid() = user_id);

-- Programas
DROP POLICY IF EXISTS "Users can view own programs" ON programs;
DROP POLICY IF EXISTS "Users can insert own programs" ON programs;
DROP POLICY IF EXISTS "Users can update own programs" ON programs;
DROP POLICY IF EXISTS "Users can delete own programs" ON programs;

CREATE POLICY "Users can view own programs" ON programs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own programs" ON programs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own programs" ON programs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own programs" ON programs FOR DELETE USING (auth.uid() = user_id);

-- Formulários personalizados
DROP POLICY IF EXISTS "Users can view own forms" ON custom_forms;
DROP POLICY IF EXISTS "Users can insert own forms" ON custom_forms;
DROP POLICY IF EXISTS "Users can update own forms" ON custom_forms;
DROP POLICY IF EXISTS "Users can delete own forms" ON custom_forms;

CREATE POLICY "Users can view own forms" ON custom_forms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own forms" ON custom_forms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own forms" ON custom_forms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own forms" ON custom_forms FOR DELETE USING (auth.uid() = user_id);

-- Respostas de formulários
DROP POLICY IF EXISTS "Users can view own form responses" ON form_responses;
DROP POLICY IF EXISTS "Users can insert form responses" ON form_responses;

CREATE POLICY "Users can view own form responses" ON form_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert form responses" ON form_responses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Histórico
DROP POLICY IF EXISTS "Users can view own history" ON client_history;
DROP POLICY IF EXISTS "Users can insert own history" ON client_history;

CREATE POLICY "Users can view own history" ON client_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON client_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Histórico Emocional e Comportamental
DROP POLICY IF EXISTS "Users can view own emotional behavioral history" ON emotional_behavioral_history;
DROP POLICY IF EXISTS "Users can insert own emotional behavioral history" ON emotional_behavioral_history;
DROP POLICY IF EXISTS "Users can update own emotional behavioral history" ON emotional_behavioral_history;
DROP POLICY IF EXISTS "Users can delete own emotional behavioral history" ON emotional_behavioral_history;

CREATE POLICY "Users can view own emotional behavioral history" ON emotional_behavioral_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own emotional behavioral history" ON emotional_behavioral_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own emotional behavioral history" ON emotional_behavioral_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own emotional behavioral history" ON emotional_behavioral_history FOR DELETE USING (auth.uid() = user_id);

