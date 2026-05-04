-- Pro Estética Corporal — lote 3: captação / mapa / massagem (b1000119, b1000120, b1000127).
-- RISK_DIAGNOSIS × leve | moderado | urgente × diagnosis_vertical = corporal.
-- Tom: avaliação presencial, sem promessa de resultado nem diagnóstico médico.
-- Calculadoras da biblioteca: migração **405** (`PROJECTION_CALCULATOR` + rota/API); ver `diagnosis-engine` para nível leve|moderado|urgente.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical = 'corporal'
  AND template_id IN (
    'b1000119-0119-4000-8000-000000000119'::uuid,
    'b1000120-0120-4000-8000-000000000120'::uuid,
    'b1000127-0127-4000-8000-000000000127'::uuid
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (template_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  -- b1000119 — prontidão / travas para investir no corpo
  (
    'b1000119-0119-4000-8000-000000000119',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Entre travas e curiosidade — ainda tempo de organizar com calma',
      'profile_summary', 'Pelas respostas, há hesitação (tempo, investimento, medo ou prioridade baixa) sem pressão extrema. Um bom passo é conversa inicial com a profissional para traduzir intenção em plano mínimo viável, sem fechar pacote longo de imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sem sentir que está “atrasando” a vida.',
      'main_blocker', 'Decidir sozinha(o) entre mil opções de feed aumenta paralisia — a consulta ancora realismo.',
      'consequence', 'Adiar a conversa mantém a sensação de estar sempre no mesmo lugar em relação ao corpo.',
      'growth_potential', 'Use o resultado para pedir avaliação focada em uma vitória pequena nas próximas semanas.',
      'dica_rapida', 'Leve uma frase: o que mais segura hoje (tempo, preço ou medo) — acelera a primeira consulta.',
      'cta_text', 'Quero conversar sobre meu próximo passo',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre o que me impede de investir no corpo. O resultado saiu exploratório — quero marcar uma avaliação para alinhar expectativa e um começo suave com vocês.'
    )
  ),
  (
    'b1000119-0119-4000-8000-000000000119',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Prontidão em construção — hora de travar prioridade com a profissional',
      'profile_summary', 'As respostas indicam interesse real, mas ainda há variáveis (rotina, experiências anteriores ou expectativa de prazo). Na consulta costuma ajudar comparar duas rotas (mais suave vs mais direcionada) e fechar frequência que você consiga manter.',
      'frase_identificacao', 'Se isso combina com você, já pesquisou bastante e quer decisão sem empurrão genérico.',
      'main_blocker', 'Fechar pacote antes de alinhar meta visível em 4–8 semanas costuma gerar desalinhamento depois.',
      'consequence', 'Continuar só na cabeça prolonga ansiedade e compras por impulso.',
      'growth_potential', 'Marque avaliação com este resultado como roteiro de perguntas — reduz ruído na conversa.',
      'dica_rapida', 'Peça critérios de melhora (sensação, medidas ou fotos padronizadas) antes de assinar série grande.',
      'cta_text', 'Quero avaliação para fechar prioridade e frequência',
      'whatsapp_prefill', 'Oi! Fiz o questionário de prontidão para protocolo corporal; o perfil saiu moderado. Quero consulta para alinhar prioridade, expectativa de prazo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000119-0119-4000-8000-000000000119',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Intenção forte — traduzir em plano seguro, já',
      'profile_summary', 'Pelas respostas, há urgência e prioridade alta nos próximos dias ou semanas. O caminho responsável é avaliação objetiva: cronograma em fases, o que não misturar no mesmo dia se houver tecnologia, e expectativa honesta sobre prazo.',
      'frase_identificacao', 'Se você se reconhece aqui, quer “como” com método, não mais uma semana só pesquisando.',
      'main_blocker', 'Correr sessões sem triagem aumenta risco de combinação ou intervalo inadequados.',
      'consequence', 'Improviso prolonga frustração mesmo com boa vontade.',
      'growth_potential', 'Peça encaixe prioritário e mencione evento ou prazo mental — a profissional calibra o plano com honestidade.',
      'dica_rapida', 'Liste o que já tentou nos últimos meses — evita repetir o mesmo caminho sem critério.',
      'cta_text', 'Quero avaliação prioritária — protocolo corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre travas e prioridade no corpo; o resultado saiu urgente. Quero avaliação o quanto antes para plano em fases, frequência e expectativa alinhada com a realidade do meu caso.'
    )
  ),

  -- b1000120 — mapa de zonas / foco corporal
  (
    'b1000120-0120-4000-8000-000000000120',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Mapa do corpo ainda aberto — boa hora para conversa guiada',
      'profile_summary', 'Pelas respostas, a prioridade de zonas ou tipo de incómodo ainda se mistura um pouco — comum no início. A avaliação presencial ajuda a nomear foco, sensibilidade da pele e o que é massagem, hábito ou tecnologia.',
      'frase_identificacao', 'Se te identificas, queres direção sem prometer três frentes ao mesmo tempo.',
      'main_blocker', 'Comparar com fotos alheias ou fechar zona errada atrasa protocolo certo para você.',
      'consequence', 'Sem foco, cada tratamento parece “meio resultado”.',
      'growth_potential', 'Leve este resultado anotando a área que marcou e há quanto tempo incomoda.',
      'dica_rapida', 'Uma vitória pequena (ex.: menos inchaço ou uma região primeiro) costuma destravar o resto.',
      'cta_text', 'Quero avaliação com base no meu mapa de zonas',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre zonas do corpo que mais incomodam. O resultado saiu no tom de primeiro mapeamento — quero marcar avaliação para priorizar foco e próximo passo com vocês.'
    )
  ),
  (
    'b1000120-0120-4000-8000-000000000120',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Foco definindo-se — cruzar zona, sensação e protocolo',
      'profile_summary', 'As respostas mostram direção razoável (zona + tipo de incómodo) mesmo que não seja única. Na consulta costuma funcionar combinar sequência segura e revisão em algumas semanas, em vez de espalhar por todo o corpo de uma vez.',
      'frase_identificacao', 'Se isso é você, já sabe mais ou menos onde quer atuar e quer critério profissional.',
      'main_blocker', 'Tratar várias áreas sem fases costuma dispersar investimento e atenção.',
      'consequence', 'Expectativa diluída em “full body” genérico tende a frustrar.',
      'growth_potential', 'Use o texto do resultado como lista de prioridades ao agendar — ganha tempo na conversa.',
      'dica_rapida', 'Comente treino ou mudança de peso recente — muda indicação de firmeza, textura ou contorno.',
      'cta_text', 'Quero consulta para plano em fases nas zonas certas',
      'whatsapp_prefill', 'Oi! Fiz o questionário do mapa de zonas corporais; o perfil saiu moderado. Quero avaliação para plano em fases, ordem de protocolo e revisão nas próximas semanas.'
    )
  ),
  (
    'b1000120-0120-4000-8000-000000000120',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Muitas frentes ou incómodo antigo — priorizar com a esteticista',
      'profile_summary', 'Pelas respostas, há várias zonas ou incómodo de longa data, misturando aparência e sensação. Avaliação prioritária ajuda a escolher uma frente inicial segura e calendarizar o resto, sem sobrecarga.',
      'frase_identificacao', 'Se te revês aqui, o corpo já pede ação estruturada, não mais experimentos soltos.',
      'main_blocker', 'Empilhar procedimentos sem ordem clara aumenta cansaço e custo com retorno confuso.',
      'consequence', 'Continuar sem prioridade máxima prolonga insatisfação com espelho ou roupa.',
      'growth_potential', 'Peça encaixe prioritário e leve lista do que já fez na região — evita repetir erro.',
      'dica_rapida', 'Fotos na mesma luz/postura ajudam a medir evolução — pergunte política da clínica.',
      'cta_text', 'Quero avaliação prioritária — mapa corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre zonas do corpo; o resultado saiu urgente (várias frentes ou incómodo há tempo). Quero avaliação prioritária para definir prioridade máxima e plano em fases com segurança.'
    )
  ),

  -- b1000127 — perfil de massagem (relax / drenagem / modeladora / combinação)
  (
    'b1000127-0127-4000-8000-000000000127',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Tipo de massagem a descobrir — começo suave faz sentido',
      'profile_summary', 'Pelas respostas, você está no início ou prefere ritmo devagar. A consulta ou primeira sessão costuma mapear pressão ideal e se o foco é relaxamento, circulação ou trabalho local — sempre com linguagem realista.',
      'frase_identificacao', 'Se te identificas, queres bem-estar sem pressão de “resultado já”.',
      'main_blocker', 'Escolher técnica só pelo nome, sem avaliar sensação e rotina, gera expectativa torta.',
      'consequence', 'Adiar a conversa mantém dúvida entre drenagem, modeladora ou relaxante.',
      'growth_potential', 'Guarde o resultado e mencione preferência de pressão ao marcar — personaliza a primeira ida.',
      'dica_rapida', 'Uma ida a cada duas semanas já pode ser plano mínimo viável — confirme com a profissional.',
      'cta_text', 'Quero alinhar tipo de massagem na avaliação',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre que massagem faz sentido para o meu corpo. O resultado saiu exploratório — quero marcar avaliação ou primeira sessão para alinhar técnica e pressão com vocês.'
    )
  ),
  (
    'b1000127-0127-4000-8000-000000000127',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Perfil de massagem a emergir — personalizar na consulta',
      'profile_summary', 'As respostas apontam objetivo dominante (leveza, tensão, zona local ou combinação leve) com frequência possível na sua rotina. Na avaliação costuma fechar-se linha principal — drenagem, modeladora ou relaxamento profundo — e cadência inicial.',
      'frase_identificacao', 'Se isso é você, já sente o corpo pedindo método, não só “uma massagem qualquer”.',
      'main_blocker', 'Sessões irregulares sem alvo costumam dar sensação de estagnação.',
      'consequence', 'Trocar de técnica a cada mês sem critério confunde o que realmente responde.',
      'growth_potential', 'Peça quantas sessões iniciais antes do primeiro balanço e o que fazer em casa entre uma e outra.',
      'dica_rapida', 'Sono e hidratação conversam com resultado de drenagem ou modeladora — comente hábitos.',
      'cta_text', 'Quero consulta para fechar linha de massagem e frequência',
      'whatsapp_prefill', 'Oi! Fiz o questionário de perfil de massagem corporal; o perfil saiu moderado. Quero consulta para definir técnica principal, pressão e frequência que eu consiga manter.'
    )
  ),
  (
    'b1000127-0127-4000-8000-000000000127',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Plano em camadas ou otimização — encaixe prioritário',
      'profile_summary', 'Pelas respostas, há foco em zona, ritmo de idas possível e abertura para combinar abordagens. Avaliação prioritária define ordem (sensação e circulação vs. contorno, por exemplo) e o que não misturar no mesmo dia sem critério profissional.',
      'frase_identificacao', 'Se te revês aqui, queres calendário claro, não empilhar tudo à cegas.',
      'main_blocker', 'Tecnologia e mãos no mesmo período sem plano aumentam sobrecarga e confusão de resultado.',
      'consequence', 'Investimento alto sem cronograma costuma virar frustração.',
      'growth_potential', 'Envie o resultado à clínica e peça proposta semanal-tipo alinhada ao que marcou no questionário.',
      'dica_rapida', 'Liste medicamentos ou gestação — segurança de indicação passa por isso na primeira conversa.',
      'cta_text', 'Quero avaliação prioritária — massagem e protocolo',
      'whatsapp_prefill', 'Oi! Fiz o questionário de perfil de massagem e combinações; o resultado saiu urgente. Quero avaliação prioritária para cronograma, ordem de técnicas e o que combinar com segurança na minha rotina.'
    )
  );
