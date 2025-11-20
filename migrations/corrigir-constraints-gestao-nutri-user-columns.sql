-- =====================================================
-- CORRIGIR TODAS AS FOREIGN KEYS -> auth.users
-- =====================================================
-- Usa quando aparece erro de FK apontando para public.users
-- Executar antes de inserir clientes fictícios
-- =====================================================

-- Clients (já existia um script dedicado, mantido aqui por segurança)
ALTER TABLE clients
  DROP CONSTRAINT IF EXISTS clients_user_id_fkey,
  ADD CONSTRAINT clients_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE clients
  DROP CONSTRAINT IF EXISTS clients_created_by_fkey,
  ADD CONSTRAINT clients_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users(id);

-- Client Evolution
ALTER TABLE client_evolution
  DROP CONSTRAINT IF EXISTS client_evolution_user_id_fkey,
  ADD CONSTRAINT client_evolution_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE client_evolution
  DROP CONSTRAINT IF EXISTS client_evolution_created_by_fkey,
  ADD CONSTRAINT client_evolution_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users(id);

-- Appointments
ALTER TABLE appointments
  DROP CONSTRAINT IF EXISTS appointments_user_id_fkey,
  ADD CONSTRAINT appointments_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE appointments
  DROP CONSTRAINT IF EXISTS appointments_created_by_fkey,
  ADD CONSTRAINT appointments_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users(id);

-- Assessments
ALTER TABLE assessments
  DROP CONSTRAINT IF EXISTS assessments_user_id_fkey,
  ADD CONSTRAINT assessments_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE assessments
  DROP CONSTRAINT IF EXISTS assessments_created_by_fkey,
  ADD CONSTRAINT assessments_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users(id);

-- Programs
ALTER TABLE programs
  DROP CONSTRAINT IF EXISTS programs_user_id_fkey,
  ADD CONSTRAINT programs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE programs
  DROP CONSTRAINT IF EXISTS programs_created_by_fkey,
  ADD CONSTRAINT programs_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users(id);

-- Custom Forms
ALTER TABLE custom_forms
  DROP CONSTRAINT IF EXISTS custom_forms_user_id_fkey,
  ADD CONSTRAINT custom_forms_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Form Responses
ALTER TABLE form_responses
  DROP CONSTRAINT IF EXISTS form_responses_user_id_fkey,
  ADD CONSTRAINT form_responses_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Client History
ALTER TABLE client_history
  DROP CONSTRAINT IF EXISTS client_history_user_id_fkey,
  ADD CONSTRAINT client_history_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE client_history
  DROP CONSTRAINT IF EXISTS client_history_created_by_fkey,
  ADD CONSTRAINT client_history_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users(id);

-- Emotional/Behavioral History
ALTER TABLE emotional_behavioral_history
  DROP CONSTRAINT IF EXISTS emotional_behavioral_history_user_id_fkey,
  ADD CONSTRAINT emotional_behavioral_history_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE emotional_behavioral_history
  DROP CONSTRAINT IF EXISTS emotional_behavioral_history_created_by_fkey,
  ADD CONSTRAINT emotional_behavioral_history_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users(id);

