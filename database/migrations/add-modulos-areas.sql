-- =====================================================
-- YLADA - MIGRATION: Adicionar suporte a múltiplas áreas para módulos
-- =====================================================

-- 1. Criar a tabela de relacionamento para curso_modulos_areas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'curso_modulos_areas') THEN
        CREATE TABLE curso_modulos_areas (
            modulo_id UUID NOT NULL REFERENCES wellness_curso_modulos(id) ON DELETE CASCADE,
            area VARCHAR(50) NOT NULL CHECK (area IN ('wellness', 'nutri', 'coach', 'nutra')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            PRIMARY KEY (modulo_id, area) -- Garante unicidade da combinação
        );
        RAISE NOTICE 'Tabela curso_modulos_areas criada.';
    ELSE
        RAISE NOTICE 'Tabela curso_modulos_areas já existe.';
    END IF;
END
$$;

-- 2. Adicionar índices para performance
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'curso_modulos_areas' AND indexname = 'idx_curso_modulos_areas_modulo_id') THEN
        CREATE INDEX idx_curso_modulos_areas_modulo_id ON curso_modulos_areas(modulo_id);
        RAISE NOTICE 'Índice idx_curso_modulos_areas_modulo_id criado.';
    ELSE
        RAISE NOTICE 'Índice idx_curso_modulos_areas_modulo_id já existe.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'curso_modulos_areas' AND indexname = 'idx_curso_modulos_areas_area') THEN
        CREATE INDEX idx_curso_modulos_areas_area ON curso_modulos_areas(area);
        RAISE NOTICE 'Índice idx_curso_modulos_areas_area criado.';
    ELSE
        RAISE NOTICE 'Índice idx_curso_modulos_areas_area já existe.';
    END IF;
END
$$;

-- 3. Habilitar RLS (Row Level Security)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'curso_modulos_areas') THEN
        ALTER TABLE curso_modulos_areas ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS habilitado para curso_modulos_areas.';
    ELSE
        RAISE NOTICE 'RLS já habilitado para curso_modulos_areas.';
    END IF;
END
$$;

-- 4. Criar políticas de RLS
-- Política para admins (SELECT, INSERT, UPDATE, DELETE)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage curso_modulos_areas') THEN
        CREATE POLICY "Admins can manage curso_modulos_areas"
        ON curso_modulos_areas
        FOR ALL
        TO authenticated
        USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true))
        WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true));
        RAISE NOTICE 'Política "Admins can manage curso_modulos_areas" criada.';
    ELSE
        RAISE NOTICE 'Política "Admins can manage curso_modulos_areas" já existe.';
    END IF;
END
$$;

-- Política para usuários (SELECT) - permite que usuários vejam as áreas dos módulos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view curso_modulos_areas') THEN
        CREATE POLICY "Users can view curso_modulos_areas"
        ON curso_modulos_areas
        FOR SELECT
        TO authenticated
        USING (true);
        RAISE NOTICE 'Política "Users can view curso_modulos_areas" criada.';
    ELSE
        RAISE NOTICE 'Política "Users can view curso_modulos_areas" já existe.';
    END IF;
END
$$;

