-- Lote final (2 fluxos × RISK_DIAGNOSIS × leve|moderado|urgente): recrutamento Pro Líderes.
-- v2: reescrita completa para PT-BR (eliminados europeísmos de v1).

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
      'profile_title', 'Objetivos de saúde e de oportunidade — veja se o seu caso encaixa',
      'profile_summary', 'Pelas respostas, há interesse em bem-estar corporal e também em explorar renda. Converse com quem enviou o link para não misturar promessa de resultado físico com oportunidade de negócio — cada coisa no seu lugar, com ética.',
      'frase_identificacao', 'Se você se identifica, quer que saúde e finanças falem a mesma língua sem confundir as duas.',
      'main_blocker', 'Risco de mensagem ambígua; você precisa separar a conversa de produto/hábitos da conversa de modelo de negócio.',
      'consequence', 'Sem esse alinhamento, você pode se frustrar ou frustrar quem te segue.',
      'growth_potential', 'Quem te convidou pode mostrar como a equipe posiciona produto de bem-estar sem violar limites de promessa.',
      'dica_rapida', 'Evite associar "ganhar dinheiro" a "emagrecer X kg" na mesma frase — separe as narrativas.',
      'cta_text', 'Quero conversa clara sobre bem-estar e negócio',
      'whatsapp_prefill', 'Oi! Fiz o quiz emagrecimento e oportunidade. Quero falar com quem me enviou este link para separar bem a conversa de hábitos/produto e a conversa de modelo de negócio com ética.'
    )
  ),
  (
    'querem-emagrecer-renda',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil que une transformação pessoal e visão comercial',
      'profile_summary', 'As respostas mostram motivação dupla coerente: cuidar de você e construir renda com propósito. O modelo em equipe de bem-estar pode servir as duas frentes quando há clareza de papéis.',
      'frase_identificacao', 'Se isso te descreve, quer história autêntica — ganhou credibilidade onde viveu a mudança.',
      'main_blocker', 'Você precisa evitar o "antes/depois" sensacionalista em público — foque em hábitos e acompanhamento sério.',
      'consequence', 'Sem treino de compliance na equipe, você pode se expor a mensagens de risco.',
      'growth_potential', 'Peça a quem te enviou o link o guia de comunicação responsável e exemplos de boas práticas.',
      'dica_rapida', 'Conte a sua jornada como processo, não como garantia — gera confiança.',
      'cta_text', 'Quero posicionamento ético com a equipe',
      'whatsapp_prefill', 'Oi! Fiz o quiz emagrecer-renda e quero unir transformação pessoal com visão comercial ética. Quero alinhar posicionamento com quem me enviou este link.'
    )
  ),
  (
    'querem-emagrecer-renda',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Alta motivação — priorize conversa para calibrar expectativas',
      'profile_summary', 'Pelas respostas, há intensidade forte nos dois eixos (mudança física e projeto de renda). Passo crítico: alinhar urgência com realismo via quem já orienta — evita frustração e mensagens arriscadas.',
      'frase_identificacao', 'Se você se vê aqui, quer resultado visível e momentum de negócio — canalize isso com método.',
      'main_blocker', 'Risco de prometer demais para si mesmo ou para os outros no calor da urgência.',
      'consequence', 'Picos de motivação sem plano se apagam no silêncio depois — conversa estruturada te protege.',
      'growth_potential', 'Agende já com quem te enviou o link: defina metas de hábito separadas de metas de negócio nas primeiras 8 semanas.',
      'dica_rapida', 'Documente métricas de hábito (água, sono, passos) separadas de métricas de atividade comercial.',
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
      'profile_title', 'Perfil comercial e sociável — explore duplicação em equipe',
      'profile_summary', 'Pelas respostas, você gosta de pessoas e de conversa fluida. Esse traço ajuda no relacionamento mas um negócio sólido também precisa de sistema — quem te enviou o link mostra as duas faces.',
      'frase_identificacao', 'Se você se identifica, vende bem "no boca a boca" mas talvez falte um checklist.',
      'main_blocker', 'Risco de depender só do carisma sem follow-up estruturado.',
      'consequence', 'Sem um CRM simples ou ritual de acompanhamento, os leads esfriam.',
      'growth_potential', 'Peça treino de follow-up e scripts éticos à equipe.',
      'dica_rapida', 'Depois de cada conversa, anote o próximo passo com data — disciplina minimalista.',
      'cta_text', 'Quero sistema além do talento natural comercial',
      'whatsapp_prefill', 'Oi! Fiz o quiz perfil comercial e quero ver como duplicar talento de conversa com sistema. Quero falar com quem me enviou este link sobre follow-up e processo.'
    )
  ),
  (
    'boas-venda-comercial',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Vendedor nato com espaço para escalar com método de equipe',
      'profile_summary', 'As respostas indicam confiança em influenciar decisões e criar rapport. O modelo em rede se beneficia disso quando há duplicação — formar outros a fazer bem o convite.',
      'frase_identificacao', 'Se isso combina com você, talvez já crie resultado sozinho mas queira alavancar uma equipe.',
      'main_blocker', 'Ensinar a vender é diferente de vender — você precisa de um framework simples.',
      'consequence', 'Ser "estrela solo" limita o crescimento e cansa.',
      'growth_potential', 'Fale com quem te enviou o link sobre mentoria downstream e treinos de duplicação.',
      'dica_rapida', 'Grave um mini pitch de 60s e revise com alguém da liderança — afina a mensagem.',
      'cta_text', 'Quero escalar com duplicação',
      'whatsapp_prefill', 'Oi! Fiz o quiz boa venda comercial e quero escalar com duplicação e treino de equipe. Quero alinhar com quem me enviou este link.'
    )
  ),
  (
    'boas-venda-comercial',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Momento de alavancar domínio comercial com estrutura de rede',
      'profile_summary', 'Pelas respostas, você tem tração interpessoal forte e disposição para liderar conversas. Próximo nível: combinar o seu dom com o processo escalável da equipe — conversa prioritária com quem convidou.',
      'frase_identificacao', 'Se você se vê aqui, sente teto de renda se tudo passa só por você.',
      'main_blocker', 'Sem sistematizar pipeline e onboarding de novos, crescer dói.',
      'consequence', 'Adiar a estruturação te mantém em ciclo de esforço linear.',
      'growth_potential', 'Agende com quem compartilhou o link o blueprint de liderança inicial (quantos mentores, que cadência).',
      'dica_rapida', 'Comece a documentar a sua melhor sequência de conversa — vira módulo replicável.',
      'cta_text', 'Quero blueprint de liderança com a equipe',
      'whatsapp_prefill', 'Oi! Fiz o quiz venda comercial e quero alavancar já com estrutura de rede. Quero falar com quem me enviou este link sobre blueprint de liderança e onboarding.'
    )
  );
