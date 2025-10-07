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

-- 3. Remover políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "Professionals can view their own profile" ON public.professionals;
DROP POLICY IF EXISTS "Professionals can create their own profile" ON public.professionals;
DROP POLICY IF EXISTS "Professionals can update their own profile" ON public.professionals;
DROP POLICY IF EXISTS "Professionals can delete their own profile" ON public.professionals;

-- 4. Criar políticas corretas para a tabela professionals
-- Política para SELECT: usuários podem ver apenas seu próprio perfil
CREATE POLICY "Professionals can view their own profile" ON public.professionals
  FOR SELECT USING (auth.uid() = id);

-- Política para INSERT: usuários podem criar seu próprio perfil
CREATE POLICY "Professionals can create their own profile" ON public.professionals
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para UPDATE: usuários podem atualizar seu próprio perfil
CREATE POLICY "Professionals can update their own profile" ON public.professionals
  FOR UPDATE USING (auth.uid() = id);

-- Política para DELETE: usuários podem excluir seu próprio perfil
CREATE POLICY "Professionals can delete their own profile" ON public.professionals
  FOR DELETE USING (auth.uid() = id);

-- 5. Verificar se as políticas foram criadas corretamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'professionals';

-- 6. Testar se um usuário pode inserir dados (opcional - apenas para teste)
-- SELECT auth.uid(); -- Execute isso para ver o ID do usuário atual
