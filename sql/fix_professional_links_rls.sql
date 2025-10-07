-- Script para habilitar RLS e criar políticas para professional_links
-- Execute este script no Supabase SQL Editor

-- 1. Habilitar RLS na tabela professional_links
ALTER TABLE public.professional_links ENABLE ROW LEVEL SECURITY;

-- 2. Criar política para permitir que profissionais vejam apenas seus próprios links
CREATE POLICY "Professionals can view their own links" ON public.professional_links
  FOR SELECT USING (auth.uid() = professional_id);

-- 3. Criar política para permitir que profissionais criem links para si mesmos
CREATE POLICY "Professionals can create their own links" ON public.professional_links
  FOR INSERT WITH CHECK (auth.uid() = professional_id);

-- 4. Criar política para permitir que profissionais atualizem seus próprios links
CREATE POLICY "Professionals can update their own links" ON public.professional_links
  FOR UPDATE USING (auth.uid() = professional_id);

-- 5. Criar política para permitir que profissionais excluam seus próprios links
CREATE POLICY "Professionals can delete their own links" ON public.professional_links
  FOR DELETE USING (auth.uid() = professional_id);

-- 6. Verificar se RLS foi habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'professional_links';

-- 7. Verificar políticas criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'professional_links';
