-- =====================================================
-- GARANTIR TODAS AS COLUNAS NECESSÁRIAS EM user_templates
-- Para corrigir erro 500 ao criar ferramentas Wellness
-- =====================================================

-- 1. Adicionar coluna short_code se não existir
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS short_code VARCHAR(20) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_user_templates_short_code ON user_templates(short_code);

-- 2. Garantir que todas as outras colunas existam
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS emoji VARCHAR(10);

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS custom_colors JSONB DEFAULT '{"principal": "#10B981", "secundaria": "#059669"}'::jsonb;

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS cta_type VARCHAR(20) DEFAULT 'whatsapp';

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(30);

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS external_url VARCHAR(500);

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS cta_button_text VARCHAR(100) DEFAULT 'Conversar com Especialista';

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS template_slug VARCHAR(100);

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS profession VARCHAR(50);

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS custom_whatsapp_message TEXT;

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS leader_data_collection JSONB;

-- 3. Garantir que content pode ser NULL (caso não tenha template_id)
-- Remover NOT NULL se existir
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_templates' 
    AND column_name = 'content' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE user_templates ALTER COLUMN content DROP NOT NULL;
  END IF;
END $$;

-- 4. Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_user_templates_template_slug ON user_templates(template_slug);
CREATE INDEX IF NOT EXISTS idx_user_templates_profession ON user_templates(profession);
CREATE INDEX IF NOT EXISTS idx_user_templates_status_profession ON user_templates(status, profession);

-- 5. Verificar estrutura final
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_templates'
ORDER BY ordinal_position;

-- 6. CORRIGIR FOREIGN KEY: user_templates.user_id deve referenciar auth.users
-- IMPORTANTE: O sistema usa auth.users (Supabase Auth), não public.users
DO $$ 
BEGIN
  -- Verificar qual tabela a foreign key está referenciando
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu 
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.table_name = 'user_templates'
      AND tc.constraint_type = 'FOREIGN KEY'
      AND kcu.column_name = 'user_id'
      AND ccu.table_schema = 'public'
      AND ccu.table_name = 'users'
  ) THEN
    -- Remover constraint antiga se apontar para public.users
    ALTER TABLE user_templates 
    DROP CONSTRAINT IF EXISTS user_templates_user_id_fkey;
    
    RAISE NOTICE '✅ Constraint antiga removida (apontava para public.users)';
  END IF;
  
  -- Adicionar nova constraint apontando para auth.users (se não existir)
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu 
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.table_name = 'user_templates'
      AND tc.constraint_type = 'FOREIGN KEY'
      AND kcu.column_name = 'user_id'
      AND ccu.table_schema = 'auth'
      AND ccu.table_name = 'users'
  ) THEN
    ALTER TABLE user_templates
    ADD CONSTRAINT user_templates_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;
    
    RAISE NOTICE '✅ Nova constraint adicionada (aponta para auth.users)';
  ELSE
    RAISE NOTICE 'ℹ️ Constraint já existe e aponta para auth.users';
  END IF;
END $$;

-- 7. Verificar constraint final
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema || '.' || ccu.table_name AS foreign_table,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'user_templates'
  AND kcu.column_name = 'user_id';


