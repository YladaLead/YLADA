-- Bloco 4 vendas Pro Líderes — lote final (2 fluxos). Fecha pro-lideres-sales-block4-fluxos.ts junto com 393–395.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'avaliacao-perfil-metabolico',
    'avaliacao-sono-energia'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  (
    'avaliacao-perfil-metabolico',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Seu metabolismo “na prática” pede estratégia — ainda sem drama',
      'profile_summary', 'Pelas respostas, oscilação de energia, facilidade de acumular peso ou dificuldade de ritmo em objetivos aparecem — patamar onde personalizar hábitos costuma destravar.',
      'frase_identificacao', 'Se combina, você provavelmente já sentiu que “genética” virou desculpa e culpa ao mesmo tempo.',
      'main_blocker', 'A tensão é corpo que responde irregular: sono e stress mexem no que a balança e a disposição fazem no dia.',
      'consequence', 'Sem estratégia, esforço parece alto com retorno que não acompanha — frustração sobe.',
      'growth_potential', 'Quem te enviou pode ajudar a montar plano mais alinhado ao teu perfil — nutrição funcional e rotina, conversa contínua.',
      'dica_rapida', 'Metabolismo na vida real é sistema: sono, stress, movimento e comida — conversa organiza a ordem.',
      'cta_text', 'Quero estratégia alinhada ao meu perfil',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de perfil metabólico e saiu um padrão leve de oscilação. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'avaliacao-perfil-metabolico',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Resposta ao esforço ainda imprevisível — plano por perfil faz diferença',
      'profile_summary', 'Pelas respostas, energia oscila bastante, ritmo de mudança de peso frustrante ou interferência clara de sono e stress já são recorrentes.',
      'frase_identificacao', 'Se você se identificou, talvez já ache que “disciplina” não explica tudo — e tem razão.',
      'main_blocker', 'O bloqueio é tático: o que funciona genérico não cola no teu corpo no teu dia.',
      'consequence', 'Continuar no genérico tende a aumentar desânimo e sensação de corpo “teimoso”.',
      'growth_potential', 'Conversar com quem te enviou permite personalizar prioridade — menos achismo, mais método.',
      'dica_rapida', 'Pequeno ajuste no que pesa mais (sono, refeição, stress) costuma abrir brecha antes da próxima fase.',
      'cta_text', 'Quero plano mais assertivo para mim',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de perfil metabólico e o resultado mostrou oscilação forte. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'avaliacao-perfil-metabolico',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Alto descompasso entre esforço e resposta — conversa guiada é prioridade',
      'profile_summary', 'Pelas respostas, dificuldade recorrente de manter ritmo, energia muito instável ou sensação de que sono e stress “mandam” no resultado têm impacto claro.',
      'frase_identificacao', 'Se isso é você, culpar só vontade já cansou — falta clareza de rotina, não de caráter.',
      'main_blocker', 'A tensão é alto impacto emocional com corpo que não coopera no ritmo esperado.',
      'consequence', 'Adiar personalização prolonga sofrimento e risco de medidas desordenadas.',
      'growth_potential', 'Fala com quem te enviou: plano por fases com critério profissional quando necessário — sustentável.',
      'dica_rapida', 'Neste patamar, direção e paciência estratégica vencem sprint sem base.',
      'cta_text', 'Preciso de plano firme alinhado ao meu caso',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de perfil metabólico e o resultado ficou bem intenso. Quero conversar com quem me enviou este link.'
    )
  ),

  (
    'avaliacao-sono-energia',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sono e energia ainda não são melhores amigos — mas dá para alinhar',
      'profile_summary', 'Pelas respostas, recuperação ao acordar, consistência de horários ou stress noturno mostram pequenas falhas — patamar leve com grande potencial de ganho.',
      'frase_identificacao', 'Se combina, você provavelmente já sentiu que “dorme horas” mas não acorda leve.',
      'main_blocker', 'A tensão é descanso que não fecha conta: corpo ainda pede energia emprestada de outro lugar.',
      'consequence', 'Pequeno déficit de recuperação puxa café, irritação e queda de foco no dia.',
      'growth_potential', 'Quem te enviou pode ajudar a ligar sono, rotina e nutrição para energia matinal melhor — conversa simples.',
      'dica_rapida', 'Primeira alavanca muitas vezes é horário estável + ritual de fim de noite — antes de suplemento milagroso.',
      'cta_text', 'Quero melhorar sono e energia com apoio',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de sono e energia e saiu um padrão leve de recuperação. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'avaliacao-sono-energia',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sono inconsistente já derruba sua energia com frequência',
      'profile_summary', 'Pelas respostas, falta de recuperação ao acordar, horários irregulares, fadiga mesmo com horas “suficientes” ou stress noturno já são recorrentes.',
      'frase_identificacao', 'Se você se identificou, o dia pode estar sendo pago com juros do sono mal fechado.',
      'main_blocker', 'O bloqueio é ciclo vicioso: dia pesado rouba noite; noite fraca rouba dia.',
      'consequence', 'Manter assim tende a aumentar dependência de estímulo e sensação de nevoeiro mental.',
      'growth_potential', 'Conversar com quem te enviou ajuda a montar ajustes práticos em rotina, nutrição e descanso — prioridade certa.',
      'dica_rapida', 'Quando dorme “bastante” e acorda mal, vale olhar qualidade e stress — não só número de horas.',
      'cta_text', 'Quero quebrar esse ciclo sono–energia',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de sono e energia e o resultado mostrou inconsistência forte. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'avaliacao-sono-energia',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Recuperação no limite — energia do dia depende de arrumar o sono',
      'profile_summary', 'Pelas respostas, recuperação pobre, sono irregular, cansaço persistente ou stress noturno intenso interferem de forma clara na disposição e no foco.',
      'frase_identificacao', 'Se isso é você, “aguentar mal dormido” virou padrão perigoso.',
      'main_blocker', 'A tensão é alto impacto: base biológica do dia não sustenta o que você precisa viver.',
      'consequence', 'Adiar cuidado prolonga desgaste físico e mental e confunde todas as outras metas.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: plano de sono e energia integrado — hábitos, rotina e apoio.',
      'dica_rapida', 'Neste patamar, priorizar sono não é luxo — é infraestrutura para tudo o resto.',
      'cta_text', 'Preciso recuperar sono e energia com plano',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de sono e energia e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para montar o próximo passo.'
    )
  );
