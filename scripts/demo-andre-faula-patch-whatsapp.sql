-- =============================================================================
-- PATCH: adiciona WhatsApp nos user_profiles dos membros demo André Faula
-- Rodar no Supabase SQL Editor — idempotente
-- =============================================================================

DO $$
DECLARE
  v_i        INT;
  v_email    TEXT;
  v_member_id UUID;
  v_wa       TEXT;
  v_ddds     TEXT[] := ARRAY['11','21','31','41','51','61','71','81','85','19'];
BEGIN
  FOR v_i IN 1..50 LOOP
    v_email := format('pl-afaula-%s@ylada.demo', lpad(v_i::text, 2, '0'));
    v_wa    := '+55' || v_ddds[1 + ((v_i - 1) % 10)] || '9' || lpad((91234000 + v_i)::text, 8, '0');

    SELECT id INTO v_member_id FROM auth.users
    WHERE lower(trim(email)) = lower(v_email) LIMIT 1;

    IF v_member_id IS NOT NULL THEN
      UPDATE user_profiles
      SET whatsapp = v_wa, updated_at = NOW()
      WHERE user_id = v_member_id;

      IF NOT FOUND THEN
        RAISE NOTICE 'user_profiles não encontrado para % — pule', v_email;
      END IF;
    END IF;
  END LOOP;

  RAISE NOTICE 'WhatsApp atualizado em até 50 membros demo.';
END $$;

-- Verificação: deve mostrar 50 linhas com whatsapp preenchido
SELECT up.nome_completo, up.whatsapp
FROM user_profiles up
JOIN auth.users u ON u.id = up.user_id
WHERE lower(trim(u.email)) LIKE 'pl-afaula-%@ylada.demo'
ORDER BY u.email;
