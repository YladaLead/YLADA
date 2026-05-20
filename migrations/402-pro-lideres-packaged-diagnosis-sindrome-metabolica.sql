-- Migration 402 — Risco de Síndrome Metabólica Pro Líderes.
-- Cobre dois flow_ids que aparecem no catálogo: sindrome-metabolica e avaliacao-sindrome-metabolica.
-- Sem entry na tabela → API entregava fallback genérico. Esta migration resolve.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN ('sindrome-metabolica', 'avaliacao-sindrome-metabolica');

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES

-- ── sindrome-metabolica / leve ────────────────────────────────────────────────
  (
    'sindrome-metabolica',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Alguns sinais metabólicos aparecem — boa hora para agir antes de virar padrão',
      'profile_summary', 'As respostas indicam fatores isolados de risco metabólico: energia que oscila, barriga que não cede ou hábitos que o corpo já está cobrando. Ainda não configurou síndrome, mas o sinal está lá.',
      'frase_identificacao', 'Você provavelmente já percebeu que o corpo não responde mais igual — mesmo fazendo "tudo certo" às vezes.',
      'main_blocker', 'O que te trava: falta de leitura clara do que está acontecendo por dentro — sem isso, qualquer ajuste vira tentativa no escuro.',
      'consequence', 'Ignorar sinais isolados é o caminho mais comum para que eles se somem e virem um quadro mais complexo no médio prazo.',
      'growth_potential', 'Quem te enviou o quiz pode ajudar a conectar os pontos — hábito, alimentação e suporte certo — antes que os fatores se acumulem.',
      'dica_rapida', 'Cintura, sono e energia são os primeiros sinais que o metabolismo manda. Vale levantar esses três na conversa com quem te acompanha.',
      'cta_text', 'Quero entender meus sinais metabólicos',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de síndrome metabólica e saíram alguns sinais isolados. Quero conversar com quem me enviou o link sobre próximos passos.'
    )
  ),

-- ── sindrome-metabolica / moderado ───────────────────────────────────────────
  (
    'sindrome-metabolica',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Fatores metabólicos se somando — o momento de agir é agora',
      'profile_summary', 'As respostas mostram combinação de fatores: energia instável, acúmulo abdominal, sono que não recupera, ou sinais que já estão aparecendo juntos. Esse conjunto merece atenção real.',
      'frase_identificacao', 'Você provavelmente já notou que o cansaço, o peso ou a barriga parecem resistir a qualquer tentativa de mudança.',
      'main_blocker', 'O que pesa: fatores que se reforçam — quando energia, peso e sono estão desalinhados ao mesmo tempo, cada um piora o outro.',
      'consequence', 'Manter esse padrão sem intervenção aumenta o risco de os fatores se consolidarem em algo que pede cuidado médico — e isso se desenvolve silenciosamente.',
      'growth_potential', 'Quem te enviou o quiz pode ajudar a priorizar o que resolver primeiro — alimentação, suporte metabólico ou rotina — de forma prática e sem achismo.',
      'dica_rapida', 'Nesse nível, o mais importante não é fazer mais — é fazer o certo na ordem certa. Conversa com quem te acompanha define isso.',
      'cta_text', 'Quero um plano para reduzir meu risco metabólico',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de síndrome metabólica e o resultado mostrou fatores se somando. Quero conversar com quem me enviou o link sobre como agir.'
    )
  ),

-- ── sindrome-metabolica / urgente ────────────────────────────────────────────
  (
    'sindrome-metabolica',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Múltiplos fatores de risco metabólico — seu corpo está pedindo atenção',
      'profile_summary', 'As respostas apontam combinação intensa: vários fatores de risco metabólico presentes ao mesmo tempo. Energia baixa, peso abdominal, sinais que o corpo já estava dando há tempo. Isso pede ação — não amanhã.',
      'frase_identificacao', 'Você provavelmente já sente que o corpo está diferente de anos atrás, e as tentativas de mudar não estão surtindo o efeito esperado.',
      'main_blocker', 'O que te segura: ciclo que se retroalimenta — metabolismo lento, energia baixa e resistência a mudança se reforçam sem apoio externo para quebrar o padrão.',
      'consequence', 'Adiar o apoio com esse nível de fatores aumenta o risco real de complicações metabólicas — cardiovascular, glicemia, pressão — que se instalam sem avisar.',
      'growth_potential', 'O melhor movimento agora é falar com quem te enviou o quiz — existe plano estruturado para reduzir riscos metabólicos com suporte, método e acompanhamento.',
      'dica_rapida', 'Neste nível, vontade não é suficiente — estrutura e suporte fazem a diferença. A conversa com quem te acompanha é o primeiro passo concreto.',
      'cta_text', 'Preciso de apoio para reduzir meu risco metabólico',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de síndrome metabólica e o resultado foi de alto risco. Quero conversar com quem me enviou o link para montar um plano de ação.'
    )
  ),

-- ── avaliacao-sindrome-metabolica / leve ─────────────────────────────────────
  (
    'avaliacao-sindrome-metabolica',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Alguns sinais metabólicos aparecem — boa hora para agir antes de virar padrão',
      'profile_summary', 'As respostas indicam fatores isolados de risco metabólico: energia que oscila, barriga que não cede ou hábitos que o corpo já está cobrando. Ainda não configurou síndrome, mas o sinal está lá.',
      'frase_identificacao', 'Você provavelmente já percebeu que o corpo não responde mais igual — mesmo fazendo "tudo certo" às vezes.',
      'main_blocker', 'O que te trava: falta de leitura clara do que está acontecendo por dentro — sem isso, qualquer ajuste vira tentativa no escuro.',
      'consequence', 'Ignorar sinais isolados é o caminho mais comum para que eles se somem e virem um quadro mais complexo no médio prazo.',
      'growth_potential', 'Quem te enviou o quiz pode ajudar a conectar os pontos — hábito, alimentação e suporte certo — antes que os fatores se acumulem.',
      'dica_rapida', 'Cintura, sono e energia são os primeiros sinais que o metabolismo manda. Vale levantar esses três na conversa com quem te acompanha.',
      'cta_text', 'Quero entender meus sinais metabólicos',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de síndrome metabólica e saíram alguns sinais isolados. Quero conversar com quem me enviou o link sobre próximos passos.'
    )
  ),

-- ── avaliacao-sindrome-metabolica / moderado ─────────────────────────────────
  (
    'avaliacao-sindrome-metabolica',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Fatores metabólicos se somando — o momento de agir é agora',
      'profile_summary', 'As respostas mostram combinação de fatores: energia instável, acúmulo abdominal, sono que não recupera, ou sinais que já estão aparecendo juntos. Esse conjunto merece atenção real.',
      'frase_identificacao', 'Você provavelmente já notou que o cansaço, o peso ou a barriga parecem resistir a qualquer tentativa de mudança.',
      'main_blocker', 'O que pesa: fatores que se reforçam — quando energia, peso e sono estão desalinhados ao mesmo tempo, cada um piora o outro.',
      'consequence', 'Manter esse padrão sem intervenção aumenta o risco de os fatores se consolidarem em algo que pede cuidado médico — e isso se desenvolve silenciosamente.',
      'growth_potential', 'Quem te enviou o quiz pode ajudar a priorizar o que resolver primeiro — alimentação, suporte metabólico ou rotina — de forma prática e sem achismo.',
      'dica_rapida', 'Nesse nível, o mais importante não é fazer mais — é fazer o certo na ordem certa. Conversa com quem te acompanha define isso.',
      'cta_text', 'Quero um plano para reduzir meu risco metabólico',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de síndrome metabólica e o resultado mostrou fatores se somando. Quero conversar com quem me enviou o link sobre como agir.'
    )
  ),

-- ── avaliacao-sindrome-metabolica / urgente ───────────────────────────────────
  (
    'avaliacao-sindrome-metabolica',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Múltiplos fatores de risco metabólico — seu corpo está pedindo atenção',
      'profile_summary', 'As respostas apontam combinação intensa: vários fatores de risco metabólico presentes ao mesmo tempo. Energia baixa, peso abdominal, sinais que o corpo já estava dando há tempo. Isso pede ação — não amanhã.',
      'frase_identificacao', 'Você provavelmente já sente que o corpo está diferente de anos atrás, e as tentativas de mudar não estão surtindo o efeito esperado.',
      'main_blocker', 'O que te segura: ciclo que se retroalimenta — metabolismo lento, energia baixa e resistência a mudança se reforçam sem apoio externo para quebrar o padrão.',
      'consequence', 'Adiar o apoio com esse nível de fatores aumenta o risco real de complicações metabólicas — cardiovascular, glicemia, pressão — que se instalam sem avisar.',
      'growth_potential', 'O melhor movimento agora é falar com quem te enviou o quiz — existe plano estruturado para reduzir riscos metabólicos com suporte, método e acompanhamento.',
      'dica_rapida', 'Neste nível, vontade não é suficiente — estrutura e suporte fazem a diferença. A conversa com quem te acompanha é o primeiro passo concreto.',
      'cta_text', 'Preciso de apoio para reduzir meu risco metabólico',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de síndrome metabólica e o resultado foi de alto risco. Quero conversar com quem me enviou o link para montar um plano de ação.'
    )
  );
