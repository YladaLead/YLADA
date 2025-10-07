-- Script para corrigir políticas RLS da tabela professionals
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se RLS está habilitado na tabela professionals
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'professionals';

-- 2. Verificar políticas existentes na tabela professionals
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'professionals';

-- 3. Remover TODAS as políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "Professionals can view their own profile" ON public.professionals;
DROP POLICY IF EXISTS "Professionals can create their own profile" ON public.professionals;
DROP POLICY IF EXISTS "Professionals can update their own profile" ON public.professionals;
DROP POLICY IF EXISTS "Professionals can delete their own profile" ON public.professionals;
DROP POLICY IF EXISTS "Professionals can manage their own data" ON public.professionals;

-- 4. DESABILITAR RLS TEMPORARIAMENTE para permitir cadastros
ALTER TABLE public.professionals DISABLE ROW LEVEL SECURITY;

-- 5. Verificar se RLS foi desabilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'professionals';

-- 6. Testar inserção manual (opcional - apenas para teste)
-- INSERT INTO public.professionals (id, name, email) 
-- VALUES (gen_random_uuid(), 'Teste', 'teste@teste.com');

-- 7. Se quiser reabilitar RLS depois, execute:
-- ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
-- 
-- -- E crie as políticas corretas:
-- CREATE POLICY "Professionals can view their own profile" ON public.professionals
--   FOR SELECT USING (auth.uid() = id);
-- 
-- CREATE POLICY "Professionals can create their own profile" ON public.professionals
--   FOR INSERT WITH CHECK (auth.uid() = id);
-- 
-- CREATE POLICY "Professionals can update their own profile" ON public.professionals
--   FOR UPDATE USING (auth.uid() = id);
-- 
-- CREATE POLICY "Professionals can delete their own profile" ON public.professionals
--   FOR DELETE USING (auth.uid() = id);
