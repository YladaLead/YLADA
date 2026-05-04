-- Lote 6 — Bloco 3 vendas Pro Líderes (últimos 5 de pro-lideres-sales-block3-fluxos.ts).
-- Segue 391. diagnosis_vertical NULL; flow_id = FluxoCliente.id.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'tipo-fome',
    'perfil-intestino',
    'quiz-bem-estar',
    'quiz-perfil-nutricional',
    'quiz-detox'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  -- --- Qual é seu tipo de fome? ---
  (
    'tipo-fome',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua fome mista ainda dá para ler com calma — e ajustar',
      'profile_summary', 'Pelas respostas, aparecem sinais de fome física previsível misturados com gatilhos emocionais ou vontades específicas — ainda em patamar manejável.',
      'frase_identificacao', 'Se isso combina, você provavelmente já percebeu que nem toda vontade de comer é “barriga vazia”.',
      'main_blocker', 'A tensão é confundir impulso com necessidade: sem leitura clara, a escala oscila e a culpa entra.',
      'consequence', 'Se o padrão cresce, episódios pontuais viram narrativa fixa de “não tenho controle”.',
      'growth_potential', 'Quem te enviou pode ajudar a separar gatilho de necessidade com método simples — sem rigidez, com prática.',
      'dica_rapida', 'Quando saciedade não dura, muitas vezes falta o que sustenta energia no meio do dia — não só força de vontade.',
      'cta_text', 'Quero aprender a ler minha fome com apoio',
      'whatsapp_prefill', 'Oi! Fiz o quiz “qual é seu tipo de fome?” e saiu um padrão leve de mistura física/emocional. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'tipo-fome',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Gatilhos emocionais e fome real já se embaralham com frequência',
      'profile_summary', 'Pelas respostas, vontade em momentos emocionais, desejos específicos repetidos ou saciedade curta já aparecem de forma recorrente — leitura da fome confusa.',
      'frase_identificacao', 'Se você se identificou, talvez já sinta que come sem fome “de verdade” mais vezes do que gostaria.',
      'main_blocker', 'O bloqueio é autopiloto: o corpo pede alívio rápido e a comida vira atalho antes da clareza.',
      'consequence', 'Manter assim tende a aumentar oscilação de energia e sensação de estar sempre negociando com o impulso.',
      'growth_potential', 'Conversar com quem te enviou permite montar rota prática — nutrição funcional e microhábitos para estabilizar o dia.',
      'dica_rapida', 'Nomear o gatilho (cansaço, tédio, pressa) já muda o jogo; método ajuda a não ficar só na culpa.',
      'cta_text', 'Quero diferenciar gatilho e necessidade',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre tipo de fome e o resultado mostrou gatilhos fortes misturados com fome real. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'tipo-fome',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Padrão de fome está confuso e pesado — conversa guiada ajuda',
      'profile_summary', 'Pelas respostas, compulsos, fome mal lida ou saciedade que não segura o ritmo têm impacto alto — com interferência clara nas escolhas do dia.',
      'frase_identificacao', 'Se isso é você, provavelmente já cansou de tentar “só se segurar” sem estratégia.',
      'main_blocker', 'A tensão é alto impacto emocional e físico: impulso manda, energia oscila, culpa fecha o ciclo.',
      'consequence', 'Adiar apoio prolonga o loop e aumenta desgaste com a própria alimentação.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: plano humano para leitura da fome e rotina — sem julgamento.',
      'dica_rapida', 'Neste patamar, estrutura gentil + direção costuma vencer radicalismo que não aguenta a vida real.',
      'cta_text', 'Preciso de apoio para ler minha fome e estabilizar o dia',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre tipo de fome e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para montar o próximo passo.'
    )
  ),

  -- --- Perfil de intestino (bem-estar digestivo, sem diagnóstico médico) ---
  (
    'perfil-intestino',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Seu intestino pede ajustes leves — bom sinal de que dá para evoluir',
      'profile_summary', 'Pelas respostas, algum estufamento, oscilação de regularidade ou sensibilidade pontual aparecem, mas ainda num patamar que parece dá para organizar com hábitos.',
      'frase_identificacao', 'Se combina, você provavelmente já notou que “nem todo dia é igual”.',
      'main_blocker', 'A tensão é conforto digestivo que não é estável: fibras, água e ritmo ainda não conversam com constância.',
      'consequence', 'Se vira padrão, desconforto vira pano de fundo e puxa energia e humor.',
      'growth_potential', 'Quem te enviou pode indicar estratégia gradual — nutrição e hábitos para conforto intestinal no dia a dia.',
      'dica_rapida', 'Mudanças bruscas costumam piorar antes de melhorar; abordagem em camadas costuma ser mais sustentável.',
      'cta_text', 'Quero cuidar do meu conforto digestivo',
      'whatsapp_prefill', 'Oi! Fiz o quiz de perfil de intestino e saiu um padrão leve de desconforto. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'perfil-intestino',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Intestino sensível ou irregular já marca o dia com frequência',
      'profile_summary', 'Pelas respostas, estufamento após refeições, irregularidade ou sensibilidade a certos alimentos já são recorrentes — falta de ritmo digestivo confortável.',
      'frase_identificacao', 'Se você se identificou, talvez já adapte o cardápio no improviso para “aguentar” o dia.',
      'main_blocker', 'O bloqueio é digestão que não afasta: o corpo cobra atenção no meio de responsabilidades e compromissos.',
      'consequence', 'Continuar sem plano tende a manter ciclo de incômodo e sensação de corpo “travado”.',
      'growth_potential', 'Conversar com quem te enviou ajuda a montar passos graduais — hidratação, fibras, ritmo e nutrição funcional.',
      'dica_rapida', 'Conforto intestinal costuma melhorar quando o dia inteiro sustenta o intestino, não só “uma coisa milagrosa”.',
      'cta_text', 'Quero melhorar meu bem-estar digestivo',
      'whatsapp_prefill', 'Oi! Fiz o quiz de perfil de intestino e o resultado mostrou desconforto frequente. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'perfil-intestino',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Desconforto digestivo com impacto alto — vale plano com quem te acompanha',
      'profile_summary', 'Pelas respostas, o incômodo intestinal (regularidade, estufamento ou sensibilidade) é intenso e interfere de forma clara no bem-estar diário.',
      'frase_identificacao', 'Se isso é você, o intestino provavelmente já não é “detalhe” — é centro de atenção no dia.',
      'main_blocker', 'A tensão é alto impacto na leveza e na energia: digestão desconfortável drena disposição.',
      'consequence', 'Adiar orientação costuma prolongar o ciclo e aumentar ansiedade com a própria alimentação.',
      'growth_potential', 'Fala com quem te enviou: estratégia simples e progressiva — bem-estar e rotina — sem prometer cura milagrosa.',
      'dica_rapida', 'Neste patamar, calma + método costumam vencer lista infinita de tentativas soltas.',
      'cta_text', 'Preciso de apoio para conforto digestivo',
      'whatsapp_prefill', 'Oi! Fiz o quiz de perfil de intestino e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para um plano.'
    )
  ),

  -- --- Quiz de bem-estar ---
  (
    'quiz-bem-estar',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Bem-estar com boa base — falta só otimizar o que pesa',
      'profile_summary', 'Pelas respostas, sua rotina já sustenta parte do bem-estar, mas energia, sono, alimentação ou constância ainda oscilam em pontos claros.',
      'frase_identificacao', 'Se faz sentido, você provavelmente já sabe “o que falta”, mas não priorizou com método.',
      'main_blocker', 'A tensão é gaps previsíveis: pequenas falhas de constância que somam e seguram resultado.',
      'consequence', 'Se não endereça, você fica abaixo do próprio potencial sem necessariamente estar “no limite”.',
      'growth_potential', 'Quem te enviou pode ajudar a escolher 1–2 alavancas certas — próximo passo aplicável, não lista gigante.',
      'dica_rapida', 'Melhoria de bem-estar costuma vir de menos frentes bem feitas, não de mais promessas.',
      'cta_text', 'Quero um próximo passo simples no meu bem-estar',
      'whatsapp_prefill', 'Oi! Fiz o quiz de bem-estar e saiu que tenho base boa com espaço de otimização. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'quiz-bem-estar',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Rotina ainda não sustenta suas metas de energia e equilíbrio',
      'profile_summary', 'Pelas respostas, energia não acompanha objetivos, sono, comida e água oscilam, e constância na semana falha — bem-estar pede reorganização.',
      'frase_identificacao', 'Se você se identificou, talvez já sinta que “semana boa / semana ruim” virou normal.',
      'main_blocker', 'O bloqueio é falha de sistema: faltam pilares mínimos repetidos — não falta de vontade.',
      'consequence', 'Manter no improviso tende a repetir oscilação e sensação de estar sempre recuando.',
      'growth_potential', 'Conversar com quem te enviou permite montar plano de bem-estar realista — hábitos + nutrição funcional.',
      'dica_rapida', 'Estabilidade vem de poucos compromissos diários claros; o resto é ajuste fino com apoio.',
      'cta_text', 'Quero mais estabilidade na minha rotina',
      'whatsapp_prefill', 'Oi! Fiz o quiz de bem-estar e o resultado mostrou oscilação forte na rotina. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'quiz-bem-estar',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Bem-estar geral pede reação estruturada — não só “tentar melhorar”',
      'profile_summary', 'Pelas respostas, rotina, energia e constância estão desalinhadas de forma intensa — impacto claro no que você consegue sustentar na vida diária.',
      'frase_identificacao', 'Se isso é você, provavelmente já sentiu que pedaços do dia inteiro dependem de “força bruta”.',
      'main_blocker', 'A tensão é alto impacto: poucos pilares firmes — e o corpo e a cabeça cobram juntos.',
      'consequence', 'Adiar direção prolonga exaustão silenciosa e sensação de meta distante.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: reorganizar prioridades com plano sustentável — passo a passo.',
      'dica_rapida', 'Neste patamar, menos frentes e mais profundidade nos pilares certos costuma destravar.',
      'cta_text', 'Preciso reorganizar meu bem-estar com apoio',
      'whatsapp_prefill', 'Oi! Fiz o quiz de bem-estar e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para montar o próximo passo.'
    )
  ),

  -- --- Quiz de perfil nutricional ---
  (
    'quiz-perfil-nutricional',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil nutricional com ajustes estratégicos na mesa',
      'profile_summary', 'Pelas respostas, há sinais de padrão alimentar irregular ou impacto leve da comida na energia — ainda manejável com correções pequenas.',
      'frase_identificacao', 'Se combina, você provavelmente já notou fome fora de hora ou água no automático.',
      'main_blocker', 'A tensão é inconsistência: o que você come não conversa sempre com o ritmo que o dia exige.',
      'consequence', 'Sem calibragem, pequenas oscilações viram resultado “mediano” quando poderia ser melhor com pouco esforço.',
      'growth_potential', 'Quem te enviou pode indicar correções estratégicas — plano nutricional simples de seguir.',
      'dica_rapida', 'Subir nível da rotina costuma ser menos “dieta” e mais estrutura repetível.',
      'cta_text', 'Quero ajustar meu perfil nutricional com clareza',
      'whatsapp_prefill', 'Oi! Fiz o quiz de perfil nutricional e saiu padrão com espaço para ajuste leve. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'quiz-perfil-nutricional',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Padrão nutricional irregular já puxa energia e foco para baixo',
      'profile_summary', 'Pelas respostas, fome fora de horário, hidratação fraca ou impacto claro da alimentação na disposição já são recorrentes.',
      'frase_identificacao', 'Se você se identificou, talvez já sinta o dia “oscilar” conforme o que come.',
      'main_blocker', 'O bloqueio é aderência nutricional real: plano na teoria não vira constância na prática.',
      'consequence', 'Manter assim tende a repetir picos e quedas — trabalho, treino e descanso pagam o preço.',
      'growth_potential', 'Conversar com quem te enviou ajuda a montar rota mais simples — nutrição funcional alinhada à tua semana.',
      'dica_rapida', 'Quando água e ritmo falham, “fome emocional” às vezes é só label errado para falta de base.',
      'cta_text', 'Quero um plano nutricional mais fácil de manter',
      'whatsapp_prefill', 'Oi! Fiz o quiz de perfil nutricional e o resultado mostrou irregularidade que já me afeta. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'quiz-perfil-nutricional',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Nutrição e energia desalinhadas — hora de plano firme com apoio',
      'profile_summary', 'Pelas respostas, o impacto do padrão alimentar na energia e no bem-estar é forte — interferência clara no ritmo do dia.',
      'frase_identificacao', 'Se isso é você, talvez já sinta que “comer no piloto automático” virou problema central.',
      'main_blocker', 'A tensão é alto impacto: sem base alimentar estável, o resto da rotina fica no modo reativo.',
      'consequence', 'Adiar reorganização prolonga oscilação e sensação de nunca “acertar o dia”.',
      'growth_potential', 'Fala com quem te enviou: monte perfil nutricional aplicável com prioridades claras — sem complicação desnecessária.',
      'dica_rapida', 'Neste patamar, direção e constância valem mais que coleção de regras.',
      'cta_text', 'Preciso alinhar nutrição e energia no meu dia',
      'whatsapp_prefill', 'Oi! Fiz o quiz de perfil nutricional e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para um plano.'
    )
  ),

  -- --- Quiz Detox (reset / leveza; linguagem bem-estar) ---
  (
    'quiz-detox',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sinais leves de sobrecarga — bom momento para um reset gentil',
      'profile_summary', 'Pelas respostas, alguma sensação de peso, oscilação de energia ou leve irregularidade intestinal aparecem — patamar ainda manejável com organização.',
      'frase_identificacao', 'Se combina, você provavelmente já sentiu o corpo pedindo “pausa” ou leveza.',
      'main_blocker', 'A tensão é acúmulo leve: rotina, comida e descanso não devolvem sensação de frescor com frequência.',
      'consequence', 'Se não endereça, pequena sobrecarga vira fundo de cansaço contínuo.',
      'growth_potential', 'Quem te enviou pode ajudar com estratégia simples de reorganização — hábitos + nutrição funcional.',
      'dica_rapida', 'Reset sustentável é sobre ritmo, não sobre sofrimento; conversa ajuda a definir o que fazer primeiro.',
      'cta_text', 'Quero começar um reset leve com orientação',
      'whatsapp_prefill', 'Oi! Fiz o quiz detox/reset e saiu um padrão leve de sobrecarga. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'quiz-detox',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Corpo pede reorganização — energia e leveza em cheque',
      'profile_summary', 'Pelas respostas, inchaço ou peso frequente, energia instável, intestino irregular ou dificuldade de leveza e foco já marcam o dia com recorrência.',
      'frase_identificacao', 'Se você se identificou, talvez já pense em “recomeçar” e não saiba por onde.',
      'main_blocker', 'O bloqueio é sobrecarga funcional acumulada: o dia rende menos com mais esforço.',
      'consequence', 'Manter no improviso tende a repetir ciclo de peso e fadiga — sensação de travamento.',
      'growth_potential', 'Conversar com quem te enviou permite desenhar reset realista — passos claros, sem extremismo.',
      'dica_rapida', 'Reset que dura costuma ser gradual; choque raramente vira novo normal.',
      'cta_text', 'Quero uma estratégia simples para recuperar leveza',
      'whatsapp_prefill', 'Oi! Fiz o quiz detox e o resultado mostrou sinais fortes de sobrecarga. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'quiz-detox',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sobrecarga alta — melhor conversar já para plano de reorganização',
      'profile_summary', 'Pelas respostas, sensação de peso, energia muito instável, intestino irregular e falta de leveza/foco têm impacto alto — corpo pedindo reorganização com apoio.',
      'frase_identificacao', 'Se isso é você, provavelmente já sentiu que “aguento, mas não fluo”.',
      'main_blocker', 'A tensão é alto impacto: sobrecarga que drena disposição e clareza no dia a dia.',
      'consequence', 'Adiar plano prolonga sensação de corpo e rotina fora de sintonia.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: rota de reset sustentável com nutrição funcional e hábitos — conversa contínua.',
      'dica_rapida', 'Neste patamar, direção e gentileza com o corpo importam mais que intensidade de moda.',
      'cta_text', 'Preciso de apoio para recuperar ritmo e leveza',
      'whatsapp_prefill', 'Oi! Fiz o quiz detox e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para montar meu próximo passo.'
    )
  );
