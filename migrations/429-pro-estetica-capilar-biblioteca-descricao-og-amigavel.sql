-- Capilar: descrições da biblioteca pensadas para prévia (WhatsApp / Open Graph), sem jargão interno
-- («contexto para o WhatsApp», «conteúdo para compartilhar», etc.).
-- A app também filtra frases fracas em runtime (`isWeakOrInternalOgDescriptionForShare`).
--
-- Opcional: remove `page.og_description` antigo quando a cópia era meta — o layout recalcula fallback.

UPDATE ylada_biblioteca_itens
SET description = 'Sono, picos de estresse e rotina pesada aparecem no cabelo e na queda. Em poucos minutos você organiza o que contar na consulta — com calma e sem julgamento.'
WHERE template_id = 'b1000158-0158-4000-8000-000000000158'::uuid
  AND active = true;

UPDATE ylada_biblioteca_itens
SET description = 'Sol forte, noite curta, elástico apertado e nervosismo marcam o dia a dia e aparecem no fio. Poucas perguntas para ver o que mais pesa no seu caso e o que dá para ajustar.'
WHERE template_id = 'b1000182-0182-4000-8000-000000000182'::uuid
  AND active = true;

UPDATE ylada_biblioteca_itens
SET description = 'Mitos sobre queda costumam atrasar a solução. Em poucos minutos você alinha expectativa com o que costuma ser verdade na prática capilar — e chega na conversa mais segura.'
WHERE template_id = 'b1000178-0178-4000-8000-000000000178'::uuid
  AND active = true;

UPDATE ylada_biblioteca_itens
SET description = 'Check-in honesto na raiz: três sinais de que o couro pede atenção antes de piorar. Responda em poucos minutos e decida o próximo passo com clareza.'
WHERE template_id = 'b1000185-0185-4000-8000-000000000185'::uuid
  AND active = true;

UPDATE ylada_biblioteca_itens
SET description = 'Indecisa entre terapias ou procedimentos? Em poucos minutos você cruza meta, sensibilidade e ritmo — base para uma proposta técnica honesta com a profissional.'
WHERE template_id = 'b1000169-0169-4000-8000-000000000169'::uuid
  AND active = true;

UPDATE ylada_biblioteca_itens
SET description = 'Coceira persistente, vermelhidão ou ardor no couro: quando vale conversar com profissional. Conteúdo educativo em poucos minutos — orienta o próximo passo sem substituir avaliação presencial.'
WHERE template_id = 'b1000183-0183-4000-8000-000000000183'::uuid
  AND active = true;

UPDATE ylada_biblioteca_itens
SET description = 'Mudanças hormonais mexem com o cabelo (ciclo, gestação, menopausa). Entenda o que é típico, o que observar e quando buscar apoio capilar alinhado à sua saúde.'
WHERE template_id = 'b1000184-0184-4000-8000-000000000184'::uuid
  AND active = true;

UPDATE ylada_links y
SET config_json = jsonb_set(
  COALESCE(y.config_json, '{}'::jsonb),
  '{page}',
  (COALESCE(y.config_json -> 'page', '{}'::jsonb) - 'og_description'),
  true
)
WHERE y.status = 'active'
  AND (y.config_json -> 'meta' ->> 'pro_lideres_preset') IS DISTINCT FROM 'true'
  AND NULLIF(trim(y.config_json -> 'page' ->> 'og_description'), '') IS NOT NULL
  AND (
    lower(trim(y.config_json -> 'page' ->> 'og_description')) LIKE '%contexto para o whatsapp%'
    OR lower(trim(y.config_json -> 'page' ->> 'og_description')) LIKE '%conteúdo para compartilhar%'
    OR lower(trim(y.config_json -> 'page' ->> 'og_description')) LIKE '%conteudo para compartilhar%'
    OR lower(trim(y.config_json -> 'page' ->> 'og_description')) LIKE '%bom para stories%'
    OR lower(trim(y.config_json -> 'page' ->> 'og_description')) LIKE '%abre conversa técnica%'
    OR lower(trim(y.config_json -> 'page' ->> 'og_description')) LIKE '%abre conversa tecnica%'
    OR trim(y.config_json -> 'page' ->> 'og_description') ~* '—\s*contexto\.?\s*$'
    OR lower(trim(y.config_json -> 'page' ->> 'og_description')) LIKE '%educacional — sem diagnóstico%'
    OR lower(trim(y.config_json -> 'page' ->> 'og_description')) LIKE '%educacional - sem diagnostico%'
  );
