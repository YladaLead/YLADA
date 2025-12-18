-- =====================================================
-- MIGRATION: Adicionar campos de personalização de marca
-- DATA: 2025-12-18
-- DESCRIÇÃO: Permite nutricionistas personalizarem marca com logo, cor e credenciais
-- =====================================================

-- 1. Adicionar campos de branding na tabela user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS brand_color VARCHAR(7),
ADD COLUMN IF NOT EXISTS brand_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS professional_credential VARCHAR(200);

-- 2. Adicionar comentários para documentação
COMMENT ON COLUMN user_profiles.logo_url IS 'URL do logo profissional armazenado no Supabase Storage';
COMMENT ON COLUMN user_profiles.brand_color IS 'Cor da marca em formato HEX (#RRGGBB)';
COMMENT ON COLUMN user_profiles.brand_name IS 'Nome da marca profissional (ex: Consultório Dra. Maria)';
COMMENT ON COLUMN user_profiles.professional_credential IS 'Credencial profissional (ex: CRN 12345, Nutricionista Clínica)';

-- 3. Criar bucket no Supabase Storage para logos (executar apenas uma vez)
-- Este comando deve ser executado via código ou dashboard do Supabase
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('nutri-logos', 'nutri-logos', true)
-- ON CONFLICT (id) DO NOTHING;

-- 4. Criar política de acesso ao bucket nutri-logos
-- Permitir upload apenas para usuários autenticados
DO $$
BEGIN
    -- Deletar políticas antigas se existirem
    DROP POLICY IF EXISTS "Nutris podem fazer upload de logos" ON storage.objects;
    DROP POLICY IF EXISTS "Logos são públicos" ON storage.objects;
    
    -- Permitir upload apenas para usuários autenticados na área nutri
    CREATE POLICY "Nutris podem fazer upload de logos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'nutri-logos'
        AND auth.role() = 'authenticated'
    );
    
    -- Permitir leitura pública dos logos
    CREATE POLICY "Logos são públicos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'nutri-logos');
    
    -- Permitir que usuários atualizem/deletem seus próprios logos
    CREATE POLICY "Nutris podem gerenciar seus logos"
    ON storage.objects
    FOR ALL
    USING (
        bucket_id = 'nutri-logos'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
END $$;

-- 5. Criar índice para busca rápida por brand_name
CREATE INDEX IF NOT EXISTS idx_user_profiles_brand_name ON user_profiles(brand_name);

-- 6. Adicionar constraint para validar formato da cor (deve ser HEX válido)
ALTER TABLE user_profiles
ADD CONSTRAINT check_brand_color_format
CHECK (brand_color IS NULL OR brand_color ~* '^#[0-9A-F]{6}$');

-- 7. Log da execução
DO $$
BEGIN
    RAISE NOTICE '✅ Migration executada com sucesso!';
    RAISE NOTICE '📌 Campos adicionados: logo_url, brand_color, brand_name, professional_credential';
    RAISE NOTICE '🔒 Políticas de storage criadas para bucket nutri-logos';
    RAISE NOTICE '⚠️  IMPORTANTE: Criar bucket "nutri-logos" no Supabase Dashboard se ainda não existe';
END $$;
