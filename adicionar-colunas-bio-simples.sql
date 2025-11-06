-- Script SIMPLES e DIRETO para adicionar coluna bio
-- Execute este script NO SUPABASE SQL EDITOR

-- Adicionar coluna 'bio' se não existir
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Adicionar coluna 'user_slug' se não existir  
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS user_slug VARCHAR(255);

-- Adicionar coluna 'country_code' se não existir
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS country_code VARCHAR(10) DEFAULT 'BR';

-- Verificar se foram adicionadas
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'user_profiles'
AND column_name IN ('bio', 'user_slug', 'country_code');

