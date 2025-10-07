-- Script para corrigir telefones duplicados na tabela professionals
-- Execute este script no Supabase SQL Editor

-- 1. Verificar telefones duplicados
SELECT id, name, phone, 
       CASE 
         WHEN phone ~ '^\+55\s*55' THEN 'Duplicado com 55'
         WHEN phone ~ '^\+55\s*\+55' THEN 'Duplicado com +55'
         WHEN phone ~ '^\+55\s*[0-9]{10,}' THEN 'Possível duplicação'
         ELSE 'OK'
       END as status
FROM public.professionals 
WHERE phone IS NOT NULL AND phone != '';

-- 2. Corrigir telefones duplicados
UPDATE public.professionals 
SET phone = CASE 
  -- Caso 1: +55 55xxxxxxxxx -> +55 xxxxxxxxx
  WHEN phone ~ '^\+55\s*55([0-9]{10,})$' THEN '+55 ' || regexp_replace(phone, '^\+55\s*55([0-9]{10,})$', '\1')
  
  -- Caso 2: +55 +55xxxxxxxxx -> +55 xxxxxxxxx  
  WHEN phone ~ '^\+55\s*\+55([0-9]{10,})$' THEN '+55 ' || regexp_replace(phone, '^\+55\s*\+55([0-9]{10,})$', '\1')
  
  -- Caso 3: +55 xxxxxxxxxxxxxxxxx (números muito longos) -> +55 xxxxxxxxx
  WHEN phone ~ '^\+55\s*([0-9]{10,})([0-9]{10,})$' THEN '+55 ' || regexp_replace(phone, '^\+55\s*([0-9]{10,})([0-9]{10,})$', '\1')
  
  -- Caso 4: Limpar espaços extras e caracteres especiais
  ELSE regexp_replace(phone, '[^0-9+]', '', 'g')
END
WHERE phone IS NOT NULL 
  AND phone != ''
  AND (
    phone ~ '^\+55\s*55' OR 
    phone ~ '^\+55\s*\+55' OR 
    phone ~ '^\+55\s*[0-9]{20,}' OR
    length(regexp_replace(phone, '[^0-9]', '', 'g')) > 13
  );

-- 3. Verificar resultado
SELECT id, name, phone, 
       length(regexp_replace(phone, '[^0-9]', '', 'g')) as digit_count
FROM public.professionals 
WHERE phone IS NOT NULL AND phone != ''
ORDER BY digit_count DESC;
