-- Lote final (2 fluxos × RISK_DIAGNOSIS × leve|moderado|urgente): recrutamento Pro Líderes.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'querem-emagrecer-renda',
    'boas-venda-comercial'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  (
    'querem-emagrecer-renda',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Objetivos de shape e de oportunidade — vê se o teu caso encaixa',
      'profile_summary', 'Pelas respostas, há interesse em bem-estar corporal e também em explorar renda. Conversa com quem enviou o link para não misturar promessa de resultado físico com oportunidade de negócio — cada coisa no seu lugar, com ética.',
      'frase_identificacao', 'Se te identificas, queres saúde e finanças a falar a mesma língua sem confundir as duas.',
      'main_blocker', 'Risco de mensagem ambígua; precisas de separar conversa de produto/hábitos de conversa de modelo de negócio.',
      'consequence', 'Sem esse alinhamento, podes frustrar-te ou frustrar quem te segue.',
      'growth_potential', 'Quem te convidou pode mostrar como a equipa posiciona produto de bem-estar sem violar limites de promessa.',
      'dica_rapida', 'Evita associar “ganhar dinheiro” a “emagrecer X kg” na mesma frase — separa narrativas.',
      'cta_text', 'Quero conversa clara sobre bem-estar e negócio',
      'whatsapp_prefill', 'Oi! Fiz o quiz emagrecimento e oportunidade. Quero falar com quem me enviou este link para separar bem conversa de hábitos/produto e conversa de modelo de negócio com ética.'
    )
  ),
  (
    'querem-emagrecer-renda',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil que une transformação pessoal e visão comercial',
      'profile_summary', 'As respostas mostram motivação dupla coerente: cuidar de ti e construir renda com propósito. O modelo em equipa de bem-estar pode servir as duas frentes quando há clareza de papéis.',
      'frase_identificacao', 'Se isto descreve-te, queres história autêntica — ganhou credibilidade onde viveu mudança.',
      'main_blocker', 'Precisas evitar “antes/depois” sensacionalista em público — foca hábitos e acompanhamento sério.',
      'consequence', 'Sem treino de compliance na equipa, podes expor-te a mensagens de risco.',
      'growth_potential', 'Pede a quem te enviou o link guia de comunicação responsável e exemplos de boas práticas.',
      'dica_rapida', 'Conta a tua jornada como processo, não como garantia — gera confiança.',
      'cta_text', 'Quero posicionamento ético com a equipa',
      'whatsapp_prefill', 'Oi! Fiz o quiz emagrecer-renda e quero unir transformação pessoal com visão comercial ética. Quero alinhar posicionamento com quem me enviou este link.'
    )
  ),
  (
    'querem-emagrecer-renda',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Alta motivação — prioriza conversa para calibrar expectativas',
      'profile_summary', 'Pelas respostas, há intensidade forte nos dois eixos (mudança física e projeto de renda). Passo crítico: alinhar urgência com realismo via quem já mentor — evita frustração e mensagens arriscadas.',
      'frase_identificacao', 'Se te revês aqui, queres resultado visível e momentum de negócio — canaliza isso com método.',
      'main_blocker', 'Risco de prometer demais a ti mesmo ou a outros no calor da urgência.',
      'consequence', 'Picos de motivação sem plano fundam-se em silêncio depois — conversa estruturada protege-te.',
      'growth_potential', 'Marca já com quem te enviou o link: define metas de hábito à parte de metas de negócio nas primeiras 8 semanas.',
      'dica_rapida', 'Documenta métricas de hábito (água, sono, passos) separadas de métricas de atividade comercial.',
      'cta_text', 'Quero calibrar metas já com quem me enviou',
      'whatsapp_prefill', 'Oi! Fiz o quiz emagrecer-renda com forte urgência e quero calibrar expectativas de hábitos e negócio. Quero falar com quem me enviou este link prioritariamente.'
    )
  ),

  (
    'boas-venda-comercial',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil comercial sociável — explora duplicação em equipa',
      'profile_summary', 'Pelas respostas, gostas de gente e de conversa fluida. Esse traço ajuda no relacionamento mas negócio sólido também precisa sistema — quem te enviou o link mostra as duas faces.',
      'frase_identificacao', 'Se te identificas, vendes bem “no boca a boca” mas talvez falte checklist.',
      'main_blocker', 'Risco de depender só de carisma sem follow-up estruturado.',
      'consequence', 'Sem CRM simples ou ritual de acompanhamento, leads esfriam.',
      'growth_potential', 'Pede treino de follow-up e scripts éticos à equipa.',
      'dica_rapida', 'Depois de cada conversa, anota próximo passo com data — disciplina minimalista.',
      'cta_text', 'Quero sistema além do natural comercial',
      'whatsapp_prefill', 'Oi! Fiz o quiz perfil comercial e quero ver como duplicar talento de conversa com sistema. Quero falar com quem me enviou este link sobre follow-up e processo.'
    )
  ),
  (
    'boas-venda-comercial',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Vendedor nato com espaço para escalar com método de equipa',
      'profile_summary', 'As respostas indicam confiança em influenciar decisões e criar rapport. Modelo em rede beneficia disso quando há duplicação — formar outros a fazer bem o convite.',
      'frase_identificacao', 'Se isto é contigo, talvez já cries resultado sozinho mas queiras alavancar equipa.',
      'main_blocker', 'Ensinar a vender é diferente de vender — precisas framework simples.',
      'consequence', 'Ser “estrela solo” limita crescimento e cansa.',
      'growth_potential', 'Fala com quem te enviou o link sobre mentoria downstream e treinos de duplicação.',
      'dica_rapida', 'Grava mini pitch de 60s e revisa com alguém da liderança — afina mensagem.',
      'cta_text', 'Quero escalar com duplicação',
      'whatsapp_prefill', 'Oi! Fiz o quiz boa venda comercial e quero escalar com duplicação e treino de equipa. Quero alinhar com quem me enviou este link.'
    )
  ),
  (
    'boas-venda-comercial',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Momento de alavancar domínio comercial com estrutura de rede',
      'profile_summary', 'Pelas respostas, tens tração interpessoal forte e disposição para liderar conversas. Próximo nível: combinar teu dom com processo escalável da equipa — conversa prioritária com quem convidou.',
      'frase_identificacao', 'Se te revês aqui, sentes teto de rendimento se tudo passa só por ti.',
      'main_blocker', 'Sem sistematizar pipeline e onboarding de novos, crescer dói.',
      'consequence', 'Adiar estruturação mantém-te em ciclo de esforço linear.',
      'growth_potential', 'Agenda com quem partilhou o link blueprint de liderança inicial (quantos mentores, que cadência).',
      'dica_rapida', 'Começa a documentar tua melhor sequência de conversa — vira módulo replicável.',
      'cta_text', 'Quero blueprint de liderança com a equipa',
      'whatsapp_prefill', 'Oi! Fiz o quiz venda comercial e quero alavancar já com estrutura de rede. Quero falar com quem me enviou este link sobre blueprint de liderança e onboarding.'
    )
  );
