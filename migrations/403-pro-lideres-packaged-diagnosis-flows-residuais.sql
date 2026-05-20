-- Migration 403 — Flows residuais do catálogo Pro Líderes (vendas).
-- Cobre 4 flow_ids que aparecem no catálogo mas não tinham entrada na tabela:
--   agua                          → slug legado de hidratação (espelho de calc-hidratacao)
--   avaliacao-sensibilidades      → slug curto da avaliação de intolerâncias/sensibilidades
--   avaliacao-emagrecimento-consciente → quiz de emagrecimento consciente / inibidores
--   pos-treino                    → quiz HYPE pós-treino (espelho de pre-treino)
-- Sem entry → API entregava fallback genérico. Esta migration resolve.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'agua',
    'avaliacao-sensibilidades',
    'avaliacao-emagrecimento-consciente',
    'pos-treino'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES

-- ── agua / leve ───────────────────────────────────────────────────────────────
  (
    'agua',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Hidratação com margem clara para melhorar',
      'profile_summary', 'Pelas respostas, peso, clima, atividade ou sede indicam que dá para organizar uma meta diária mais estável — ainda sem drama.',
      'frase_identificacao', 'Se combina, você provavelmente já sabe que devia beber mais água — falta formato.',
      'main_blocker', 'A tensão é hábito de líquidos no automático: sem meta simples, o dia passa e a hidratação oscila.',
      'consequence', 'Pequeno déficit repetido puxa foco, digestão e energia sem você nomear a causa.',
      'growth_potential', 'Quem te enviou pode cruzar sua calculadora com rotina real e indicar próximo passo prático — conversa rápida.',
      'dica_rapida', 'Meta que funciona costuma ser ridícula de simples — mas amarrada ao seu horário, não à culpa.',
      'cta_text', 'Quero minha meta de hidratação com apoio',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de água e quero cruzar o resultado com orientação. Quero conversar com quem me enviou este link.'
    )
  ),

-- ── agua / moderado ───────────────────────────────────────────────────────────
  (
    'agua',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sinais fortes de que a hidratação não sustenta seu dia',
      'profile_summary', 'Pelas respostas, sede frequente, calor ou atividade alta somam com padrão irregular — água virou variável que puxa disposição para baixo.',
      'frase_identificacao', 'Se você se identificou, talvez já associe cefaleia leve, foco ruim ou sede tardia demais.',
      'main_blocker', 'O bloqueio é volume e consistência: o corpo pede líquido e ritmo, não só um copo quando lembrar.',
      'consequence', 'Manter assim tende a repetir queda de energia e sensação de corpo seco ao longo do dia.',
      'growth_potential', 'Conversar com quem te enviou permite ajustar meta com seu peso, clima e expediente — referência que você consegue cumprir.',
      'dica_rapida', 'Calculadora dá referência; vida real precisa de gatilhos — garrafa, lembretes e rotina.',
      'cta_text', 'Quero organizar hidratação de verdade',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de água e o resultado mostrou que preciso melhorar com consistência. Quero falar com quem me enviou este link.'
    )
  ),

-- ── agua / urgente ────────────────────────────────────────────────────────────
  (
    'agua',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Hidratação no limite do que seu corpo aguenta no ritmo atual',
      'profile_summary', 'Pelas respostas, combinação de sede, calor, atividade e rotina pesada indica que falta de água pode estar com impacto alto em energia e bem-estar.',
      'frase_identificacao', 'Se isso é você, talvez já sinta o corpo pedindo líquido no meio do caos do dia.',
      'main_blocker', 'A tensão é alto impacto: desidratação leve repetida derruba performance física e mental.',
      'consequence', 'Adiar organização prolonga sintomas evitáveis e confunde causa de cansaço.',
      'growth_potential', 'Fala com quem te enviou: defina meta, ritmo e apoio — hidratação como base, não detalhe.',
      'dica_rapida', 'Neste patamar, tratar água com seriedade costuma ser o hack mais barato que existe.',
      'cta_text', 'Preciso de plano de hidratação que funcione',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de água e o resultado ficou bem intenso no descasamento com minha rotina. Quero conversar com quem me enviou este link.'
    )
  ),

-- ── avaliacao-sensibilidades / leve ───────────────────────────────────────────
  (
    'avaliacao-sensibilidades',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sinais de sensibilidade alimentar — vale organizar gatilhos com calma',
      'profile_summary', 'Pelas respostas, desconforto pontual após certos alimentos ou sensação digestiva variável aparece — ainda em patamar de mapear hábitos sem alarmismo.',
      'frase_identificacao', 'Se combina, você provavelmente já cortou coisa no improviso "para ver se melhora".',
      'main_blocker', 'A tensão é incerteza: não sabe exatamente o que piora — então vive testando no escuro.',
      'consequence', 'Sem método, lista de medo na comida pode crescer sem critério.',
      'growth_potential', 'Quem te enviou pode ajudar com plano inicial de observação e nutrição — sempre respeitando avaliação profissional quando preciso.',
      'dica_rapida', 'Sensibilidade e alergia não são a mesma coisa; conversa guiada evita autodiagnóstico.',
      'cta_text', 'Quero reduzir desconfortos com orientação',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de sensibilidades alimentares e saiu um padrão leve. Quero conversar com quem me enviou este link.'
    )
  ),

-- ── avaliacao-sensibilidades / moderado ───────────────────────────────────────
  (
    'avaliacao-sensibilidades',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Desconforto recorrente pede mapa de gatilhos — não só cortes aleatórios',
      'profile_summary', 'Pelas respostas, estufamento, gases ou indisposição após comer, dificuldade de reconhecer alimentos gatilho ou impacto na energia já são frequentes.',
      'frase_identificacao', 'Se você se identificou, talvez já restrinja demais por medo do sintoma.',
      'main_blocker', 'O bloqueio é falta de critério: sintoma existe, mas estratégia ainda não é estável.',
      'consequence', 'Continuar no trial and error tende a aumentar ansiedade com a mesa.',
      'growth_potential', 'Conversar com quem te enviou ajuda a ordenar teste e rotina — nutrição funcional com calma.',
      'dica_rapida', 'Ajuste gradual com registro simples costuma esclarecer mais que cortar cinco coisas num dia.',
      'cta_text', 'Quero plano inicial para reduzir gatilhos',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de sensibilidades e o resultado mostrou desconforto frequente. Quero falar com quem me enviou este link.'
    )
  ),

-- ── avaliacao-sensibilidades / urgente ────────────────────────────────────────
  (
    'avaliacao-sensibilidades',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sensibilidade com impacto alto no dia — organize com quem te acompanha',
      'profile_summary', 'Pelas respostas, sintomas recorrentes, forte relação com alimentos e interferência na energia indicam necessidade de plano estruturado — evitando improviso prolongado.',
      'frase_identificacao', 'Se isso é você, a comida já virou fonte de medo, não só de prazer.',
      'main_blocker', 'A tensão é alto impacto: digestão e bem-estar travam escolhas e humor.',
      'consequence', 'Adiar organização prolonga sofrimento e restrições sem critério.',
      'growth_potential', 'Fala com quem te enviou: rota de bem-estar digestivo + encaminhamento profissional quando fizer sentido.',
      'dica_rapida', 'Neste patamar, critério profissional aliado a método diário costuma ser o caminho mais seguro.',
      'cta_text', 'Preciso de apoio para esse quadro',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de sensibilidades alimentares e o resultado ficou bem intenso. Quero conversar com quem me enviou este link.'
    )
  ),

-- ── avaliacao-emagrecimento-consciente / leve ─────────────────────────────────
  (
    'avaliacao-emagrecimento-consciente',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Boa base para emagrecer — alguns pontos merecem atenção antes de acelerar',
      'profile_summary', 'Pelas respostas, você mostra abertura para mudança e alguma estrutura alimentar. Ainda existem lacunas — energia, proteína ou constância — que valem organizar antes de apressar resultado.',
      'frase_identificacao', 'Se combina, você provavelmente quer emagrecer com cuidado, não só com pressa.',
      'main_blocker', 'A tensão é falta de base sólida: sem estrutura alimentar e sono organizados, qualquer método perde força.',
      'consequence', 'Descuidar da base agora aumenta risco de platô rápido ou perda de músculo junto com gordura.',
      'growth_potential', 'Quem te enviou pode ajudar a organizar alimentação, suporte e rotina antes de acelerar — resultado mais sustentável.',
      'dica_rapida', 'Emagrecer com consciência começa por proteína distribuída e sono de qualidade — antes de qualquer suplemento ou corte radical.',
      'cta_text', 'Quero organizar minha base para emagrecer bem',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de emagrecimento consciente e saiu um padrão com pontos a organizar. Quero conversar com quem me enviou este link.'
    )
  ),

-- ── avaliacao-emagrecimento-consciente / moderado ─────────────────────────────
  (
    'avaliacao-emagrecimento-consciente',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Emagrecimento sem suporte adequado — risco de perder músculo e estabilidade',
      'profile_summary', 'Pelas respostas, apetite reduzido (com ou sem medicação), falta de proteína suficiente ou oscilação de energia já marcam a rotina. O corpo emagrece, mas pode estar vulnerável.',
      'frase_identificacao', 'Se você se identificou, talvez já perceba que comer "menos" não está igual a comer "melhor".',
      'main_blocker', 'O bloqueio é base frágil: sem proteína, fibras e sono organizados, o emagrecimento corrói músculo e derruba energia.',
      'consequence', 'Manter esse padrão aumenta risco de efeito rebote, queda de cabelo, fraqueza e platô difícil de sair.',
      'growth_potential', 'Conversar com quem te enviou ajuda a ajustar rotina alimentar e suporte nutricional — resultado mais seguro e sustentável.',
      'dica_rapida', 'Neste nível, proteína em todas as refeições e hidratação adequada valem mais que qualquer acelerador.',
      'cta_text', 'Quero emagrecer com suporte e sem efeito rebote',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de emagrecimento consciente e o resultado mostrou que preciso de melhor suporte nutricional. Quero falar com quem me enviou este link.'
    )
  ),

-- ── avaliacao-emagrecimento-consciente / urgente ──────────────────────────────
  (
    'avaliacao-emagrecimento-consciente',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sinais de alto risco no emagrecimento — priorize conversa com apoio',
      'profile_summary', 'Pelas respostas, combinação de apetite muito suprimido, energia baixa, sono ruim ou oscilação intensa indica que o corpo já está cobrando. Esse quadro pede cuidado estruturado — não improviso.',
      'frase_identificacao', 'Se isso é você, talvez já perceba que o resultado na balança não reflete como o corpo está se sentindo.',
      'main_blocker', 'A tensão é alto risco de rebote e desgaste: metabolismo, músculo e humor sofrem quando a base não sustenta o ritmo.',
      'consequence', 'Adiar apoio neste patamar aumenta risco real de complicações — perda muscular, queda de cabelo, fadiga crônica ou efeito rebote intenso.',
      'growth_potential', 'O melhor passo agora é falar com quem te enviou: existe plano estruturado para emagrecer com proteção, suporte e acompanhamento.',
      'dica_rapida', 'Neste nível, vontade não basta — estrutura, método e acompanhamento profissional fazem a diferença real.',
      'cta_text', 'Preciso de apoio para emagrecer com segurança',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de emagrecimento consciente e o resultado ficou de alto risco. Quero conversar com quem me enviou este link para montar um plano.'
    )
  ),

-- ── pos-treino / leve ─────────────────────────────────────────────────────────
  (
    'pos-treino',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Recuperação pós-treino com ajuste — seu corpo devolve mais com pequenas mudanças',
      'profile_summary', 'Pelas respostas, energia, sono ou alimentação pós-treino têm margem de melhora — ainda sem impacto grande no desempenho, mas vale organizar antes de virar padrão.',
      'frase_identificacao', 'Se combina, você provavelmente treina bem mas sente que a recuperação não acompanha.',
      'main_blocker', 'A tensão é janela pós-treino mal aproveitada: sem proteína e hidratação organizadas nesse momento, a evolução fica mais lenta.',
      'consequence', 'Sem ajuste, cansaço acumulado começa a comprometer treinos futuros sem você saber a causa.',
      'growth_potential', 'Quem te enviou pode ajudar a montar rotina de recuperação prática — suporte certo na hora certa.',
      'dica_rapida', 'A primeira hora depois do treino é ouro: proteína + hidratação nesse momento aceleram muito a recuperação.',
      'cta_text', 'Quero melhorar minha recuperação pós-treino',
      'whatsapp_prefill', 'Oi! Fiz o quiz pós-treino e saíram alguns pontos para ajustar. Quero conversar com quem me enviou este link sobre próximos passos.'
    )
  ),

-- ── pos-treino / moderado ─────────────────────────────────────────────────────
  (
    'pos-treino',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Recuperação comprometida — o treino exige mais do que o corpo consegue repor',
      'profile_summary', 'Pelas respostas, cansaço que persiste depois do treino, sono que não recupera ou fome descontrolada pós-exercício já afetam a consistência. O esforço existe, mas o retorno fica abaixo do esperado.',
      'frase_identificacao', 'Se você se identificou, talvez já note que treinos seguidos deixam o corpo mais pesado do que leve.',
      'main_blocker', 'O bloqueio é déficit de recuperação: sem proteína, hidratação e descanso organizados, cada treino custa mais do que rende.',
      'consequence', 'Manter esse padrão aumenta risco de lesão, platô de resultado e queda de motivação por esforço sem retorno visível.',
      'growth_potential', 'Conversar com quem te enviou ajuda a ajustar suporte nutricional e rotina de recuperação — treinar com mais retorno.',
      'dica_rapida', 'Neste nível, o problema não é treinar mais — é recuperar melhor. Proteína, água e sono bem distribuídos mudam o jogo.',
      'cta_text', 'Quero um plano de recuperação que funcione',
      'whatsapp_prefill', 'Oi! Fiz o quiz pós-treino e o resultado mostrou que minha recuperação precisa de melhora. Quero falar com quem me enviou este link.'
    )
  ),

-- ── pos-treino / urgente ──────────────────────────────────────────────────────
  (
    'pos-treino',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Corpo no limite da recuperação — treino está custando mais do que deveria',
      'profile_summary', 'Pelas respostas, múltiplos sinais de recuperação insuficiente: cansaço intenso após treinos, sono ruim, fome fora de controle ou queda de desempenho persistente. O corpo está pedindo apoio estruturado.',
      'frase_identificacao', 'Se isso é você, provavelmente já sente que mais treino não está trazendo mais resultado.',
      'main_blocker', 'A tensão é ciclo que se retroalimenta: esforço alto sem recuperação adequada desgasta músculo, hormônios e motivação ao mesmo tempo.',
      'consequence', 'Continuar nesse ritmo sem ajuste aumenta risco real de lesão, overtraining e perda de massa — o oposto do que o treino deveria trazer.',
      'growth_potential', 'O melhor movimento agora é falar com quem te enviou: existe suporte nutricional e de rotina desenhado para quem treina com intensidade e precisa recuperar de verdade.',
      'dica_rapida', 'Neste patamar, descanso e suporte não são fraqueza — são parte do treino. Sem eles, o esforço perde sentido.',
      'cta_text', 'Preciso de apoio para recuperar e evoluir',
      'whatsapp_prefill', 'Oi! Fiz o quiz pós-treino e o resultado ficou de alto impacto na recuperação. Quero conversar com quem me enviou este link para montar um plano.'
    )
  );
