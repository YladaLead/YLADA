-- 444 — Devolutiva AFIADA do "Ganhos e Prosperidade" (molde da Fase 2, Chat 5).
--
-- Reescreve as 3 linhas (leve | moderado | urgente) do flow_id 'quiz-recrut-ganhos-prosperidade'
-- com a copy afiada pela Régua de Qualidade dos Diagnósticos (Chat5_Fase2_Molde_GanhosProsperidade.md §6).
-- Tom: popular, frase curta, "você"; espelho → causa → consequência → 1º passo → CTA (5 campos, 1 ideia cada).
-- SEM promessa de renda, SEM diagnóstico médico, SEM pressão. CTA ancorado em falar com quem enviou o link.
--
-- Eixo desta tabela = DOR (RISK): archetype_code leve/moderado/urgente define o TOM.
-- O eixo PRONTIDÃO (pronta × ainda-não) NÃO mora aqui — vive no handoff/porPerfil do contrato
-- (src/lib/ylada-flow/bibliotecas/recrutamento/ganhos-prosperidade.ts), computado em runtime.
-- Por isso o whatsapp_prefill aqui é caloroso e prontidão-neutro (a leitura pronta/ainda-não
-- viaja pelo handoff, não pela mensagem pública).
--
-- Schema/contrato: src/lib/pro-lideres/pro-lideres-packaged-diagnosis-contract.ts
-- Mesmo formato da 397 (RISK_DIAGNOSIS, diagnosis_vertical NULL; meta.diagnosis_vertical='pro_lideres' nos links).
-- Escopo do DELETE: SOMENTE este flow_id (não tocar nos demais fluxos da 397).

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id = 'quiz-recrut-ganhos-prosperidade';

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  (
    'quiz-recrut-ganhos-prosperidade',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você está num momento mais tranquilo com o dinheiro',
      'profile_summary', 'Pelas respostas, sobra um pouco e você não vive no aperto. É justamente nesse momento de calma que dá pra construir algo a mais, sem pressa e sem risco.',
      'frase_identificacao', 'Se você se identifica: hoje dá pra respirar, mas você sabe que depender de uma renda só sempre tem um limite.',
      'main_blocker', 'O que segura não é falta de dinheiro agora. É que quase tudo ainda vem de uma fonte só, e fonte única um dia aperta.',
      'consequence', 'Esperar não custa o seu sustento hoje. Custa o tempo, que é o que faz uma segunda fonte crescer.',
      'growth_potential', 'Dá pra começar pequeno, no conforto, sem largar nada do que você já faz. Um passo só.',
      'dica_rapida', 'Aproveite a calma de agora pra olhar isso com a cabeça fria, antes de virar urgência.',
      'cta_text', 'Quero falar com quem me enviou isso',
      'whatsapp_prefill', 'Oi! Fiz o quiz Ganhos e Prosperidade. Tô num momento tranquilo, mas queria entender como criar uma segunda fonte com calma. Por onde eu começo?'
    )
  ),
  (
    'quiz-recrut-ganhos-prosperidade',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você ganha, mas o dinheiro escorrega',
      'profile_summary', 'Você se vira, mas tá tudo amarrado numa fonte de renda só, e é isso que prende o resto. No fim do mês some e você nem vê pra onde foi.',
      'frase_identificacao', 'Se você se identifica: não falta esforço. Falta o dinheiro parar de escorregar pelas mãos.',
      'main_blocker', 'O problema não é falta de trabalho. É que quase tudo depende de uma renda só.',
      'consequence', 'Enquanto for assim, o ano que vem tende a ser igual a esse.',
      'growth_potential', 'Dá pra começar pequeno, sem largar o que você já faz. Um passo só, no seu tempo.',
      'dica_rapida', 'Antes de falar, pense numa coisa: quanto tempo por semana você teria pra algo seu.',
      'cta_text', 'Quero dar o primeiro passo',
      'whatsapp_prefill', 'Oi! Fiz o quiz Ganhos e Prosperidade e queria entender como dar o primeiro passo pra não depender de uma renda só, sem largar o que já faço.'
    )
  ),
  (
    'quiz-recrut-ganhos-prosperidade',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'O mês inteiro de trabalho e mesmo assim não fecha',
      'profile_summary', 'Pelas respostas, o aperto é real e vem todo mês. Não é que você faz pouco. É que tudo depende de uma renda só, e ela não tá dando conta.',
      'frase_identificacao', 'Se você se identifica: você não quer conversa enrolada, quer um caminho que caiba na sua vida.',
      'main_blocker', 'Não é você. É depender de uma fonte só. Quando ela aperta, aperta tudo junto.',
      'consequence', 'Cada mês assim é um mês que não volta. E sozinho, no mesmo caminho, ele tende a se repetir.',
      'growth_potential', 'O primeiro passo é uma conversa curta com quem te enviou isso, pra montar algo do seu jeito, sem promessa mágica.',
      'dica_rapida', 'Leve suas duas maiores dúvidas pra conversa. Em cinco minutos já dá pra ver se faz sentido.',
      'cta_text', 'Quero falar agora com quem me enviou',
      'whatsapp_prefill', 'Oi! Fiz o quiz Ganhos e Prosperidade e o aperto tá real. Quero falar com quem me enviou esse link pra entender um próximo passo que caiba na minha vida.'
    )
  );
