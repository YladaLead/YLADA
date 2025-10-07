-- Script simples para verificar e criar a tabela professional_links
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a tabela existe
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'professional_links' 
ORDER BY ordinal_position;

-- 2. Se a tabela não existir ou não tiver os campos necessários, criar/atualizar
DO $$
BEGIN
    -- Verificar se a tabela existe
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'professional_links') THEN
        -- Criar tabela se não existir
        CREATE TABLE public.professional_links (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
            tool_name TEXT NOT NULL,
            custom_url TEXT UNIQUE NOT NULL,
            cta_text TEXT DEFAULT 'Falar com Especialista',
            redirect_url TEXT NOT NULL,
            custom_message TEXT,
            redirect_type TEXT DEFAULT 'whatsapp',
            secure_id TEXT UNIQUE,
            is_active BOOLEAN DEFAULT TRUE,
            views INTEGER DEFAULT 0,
            last_accessed TIMESTAMP WITH TIME ZONE,
            custom_styles JSONB,
            custom_logo_url TEXT,
            custom_header_text TEXT,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE 'Tabela professional_links criada com sucesso!';
    ELSE
        -- Adicionar campos se não existirem
        ALTER TABLE public.professional_links 
        ADD COLUMN IF NOT EXISTS custom_message TEXT,
        ADD COLUMN IF NOT EXISTS redirect_type TEXT DEFAULT 'whatsapp',
        ADD COLUMN IF NOT EXISTS secure_id TEXT UNIQUE;
        
        RAISE NOTICE 'Campos adicionados à tabela professional_links!';
    END IF;
END $$;

-- 3. Criar políticas RLS se não existirem
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'professional_links' AND policyname = 'Professionals can view their own links') THEN
        CREATE POLICY "Professionals can view their own links" ON public.professional_links FOR SELECT USING (auth.uid() = professional_id);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'professional_links' AND policyname = 'Professionals can insert their own links') THEN
        CREATE POLICY "Professionals can insert their own links" ON public.professional_links FOR INSERT WITH CHECK (auth.uid() = professional_id);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'professional_links' AND policyname = 'Professionals can update their own links') THEN
        CREATE POLICY "Professionals can update their own links" ON public.professional_links FOR UPDATE USING (auth.uid() = professional_id);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'professional_links' AND policyname = 'Professionals can delete their own links') THEN
        CREATE POLICY "Professionals can delete their own links" ON public.professional_links FOR DELETE USING (auth.uid() = professional_id);
    END IF;
    
    RAISE NOTICE 'Políticas RLS criadas para professional_links!';
END $$;

-- 4. Verificar resultado final
SELECT 'Tabela professional_links configurada com sucesso!' as status;


