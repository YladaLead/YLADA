-- SQL CORRIGIDO para resolver erro de RLS
-- Execute este código no SQL Editor do Supabase Dashboard

-- 1. Primeiro, vamos remover as políticas existentes que estão causando problema
DROP POLICY IF EXISTS "Professionals can manage their own data" ON professionals;
DROP POLICY IF EXISTS "Professionals can manage their own leads" ON leads;
DROP POLICY IF EXISTS "Professionals can manage their own links" ON professional_links;
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;

-- 2. Criar políticas mais permissivas para desenvolvimento
-- Política para profissionais - permitir inserção durante cadastro
CREATE POLICY "Professionals can insert their own data" ON professionals
  FOR INSERT WITH CHECK (true);

-- Política para profissionais - permitir leitura de seus próprios dados
CREATE POLICY "Professionals can read their own data" ON professionals
  FOR SELECT USING (auth.uid()::text = id::text);

-- Política para profissionais - permitir atualização de seus próprios dados
CREATE POLICY "Professionals can update their own data" ON professionals
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Política para leads - permitir inserção pública (para captura de leads)
CREATE POLICY "Anyone can create leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Política para leads - profissionais podem ver seus próprios leads
CREATE POLICY "Professionals can read their own leads" ON leads
  FOR SELECT USING (auth.uid()::text = professional_id::text);

-- Política para leads - profissionais podem atualizar seus próprios leads
CREATE POLICY "Professionals can update their own leads" ON leads
  FOR UPDATE USING (auth.uid()::text = professional_id::text);

-- Política para links - profissionais podem inserir seus próprios links
CREATE POLICY "Professionals can insert their own links" ON professional_links
  FOR INSERT WITH CHECK (auth.uid()::text = professional_id::text);

-- Política para links - profissionais podem ler seus próprios links
CREATE POLICY "Professionals can read their own links" ON professional_links
  FOR SELECT USING (auth.uid()::text = professional_id::text);

-- Política para links - profissionais podem atualizar seus próprios links
CREATE POLICY "Professionals can update their own links" ON professional_links
  FOR UPDATE USING (auth.uid()::text = professional_id::text);

-- Política para links - profissionais podem deletar seus próprios links
CREATE POLICY "Professionals can delete their own links" ON professional_links
  FOR DELETE USING (auth.uid()::text = professional_id::text);

