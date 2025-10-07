-- Script SIMPLES para corrigir telefones duplicados
-- Execute este script no Supabase SQL Editor

-- 1. Ver telefones atuais (para debug)
SELECT id, name, phone, length(phone) as phone_length
FROM public.professionals 
WHERE phone IS NOT NULL AND phone != ''
ORDER BY phone_length DESC;

-- 2. Corrigir telefones duplicados de forma simples
UPDATE public.professionals 
SET phone = CASE 
  -- Se tem mais de 20 caracteres, provavelmente está duplicado
  WHEN length(phone) > 20 THEN 
    '+55 ' || substring(regexp_replace(phone, '[^0-9]', '', 'g'), 1, 11)
  
  -- Se tem código do país duplicado (5555), remover um
  WHEN phone ~ '^\+55\s*55' THEN 
    '+55 ' || substring(regexp_replace(phone, '^\+55\s*55', '', 'g'), 1, 11)
  
  -- Se tem +55 duplicado, remover um
  WHEN phone ~ '^\+55\s*\+55' THEN 
    '+55 ' || substring(regexp_replace(phone, '^\+55\s*\+55', '', 'g'), 1, 11)
  
  -- Se não tem código do país, adicionar +55
  WHEN phone !~ '^\+55' THEN 
    '+55 ' || substring(regexp_replace(phone, '[^0-9]', '', 'g'), 1, 11)
  
  -- Caso contrário, manter como está mas limpar
  ELSE '+55 ' || substring(regexp_replace(phone, '[^0-9]', '', 'g'), 1, 11)
END
WHERE phone IS NOT NULL AND phone != '';

-- 3. Ver resultado após correção
SELECT id, name, phone, length(phone) as phone_length
FROM public.professionals 
WHERE phone IS NOT NULL AND phone != ''
ORDER BY phone_length DESC;
