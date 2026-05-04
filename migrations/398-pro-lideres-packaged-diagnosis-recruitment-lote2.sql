-- Lote 2 (5 fluxos × RISK_DIAGNOSIS × leve|moderado|urgente): recrutamento Pro Líderes.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'perderam-emprego-transicao',
    'transformar-consumo-renda',
    'jovens-empreendedores',
    'ja-consome-bem-estar',
    'trabalhar-apenas-links'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  (
    'perderam-emprego-transicao',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Em transição profissional — vale mapear opções com quem te convidou',
      'profile_summary', 'Pelas respostas, estás a repensar rendimento e próximo capítulo, ainda sem decisão fechada. Uma conversa com quem enviou o link ajuda a ver se o modelo de negócio encaixa sem pressão.',
      'frase_identificacao', 'Se te identificas, queres estabilidade mas não queres fechar portas sem perceber o terreno.',
      'main_blocker', 'O que falta é informação prática sobre o negócio independente e o ritmo real de construção — não slogans.',
      'consequence', 'Ficar só na tua cabeça prolonga incerteza; falar com alguém da equipa estrutura dúvidas.',
      'growth_potential', 'Quem te partilhou o fluxo pode contar como outras pessoas em transição se organizaram.',
      'dica_rapida', 'Lista o que precisas que um rendimento cobra neste mês — útil para conversa honesta.',
      'cta_text', 'Quero falar sobre transição e oportunidade',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre transição após perda de emprego. Quero conversar com quem me enviou este link para perceber se esta oportunidade encaixa no meu momento.'
    )
  ),
  (
    'perderam-emprego-transicao',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Recomeço com necessidade real de rendimento — alinha com a equipa',
      'profile_summary', 'As respostas mostram pressão para gerar resultado mas também abertura para algo novo em equipa. É cenário comum onde transparência com quem te convidou evita expectativas erradas.',
      'frase_identificacao', 'Se isto é contigo, queres ver caminho concreto, não discurso motivacional vazio.',
      'main_blocker', 'O ponto crítico é cruzar urgência financeira com aprendizagem inicial — precisa de calendário e suporte claros.',
      'consequence', 'Sem esse alinhamento, podes frustrar-te por achar que “devia ser mais rápido” sem ver o processo inteiro.',
      'growth_potential', 'Pede a quem te enviou o link um plano de primeiros passos e formação obrigatória no início.',
      'dica_rapida', 'Evita comparar com quem já leva anos no modelo — pergunta o que é realista para quem começa.',
      'cta_text', 'Quero um plano de recomeço honesto',
      'whatsapp_prefill', 'Oi! Fiz o quiz de transição profissional e preciso alinhar expectativas com realidade. Quero conversar com quem me enviou este link sobre plano inicial e suporte.'
    )
  ),
  (
    'perderam-emprego-transicao',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Transição com urgência — conversa prioritária para ver encaixe',
      'profile_summary', 'Pelas respostas, a necessidade de rendimento e direção é forte. O melhor uso do tempo agora é falar com quem te enviou o link para ver próximos passos com clareza — sem promessa de atalhos.',
      'frase_identificacao', 'Se te revês aqui, cada semana sem decisão informada pesa.',
      'main_blocker', 'O risco é aceitar qualquer coisa por desespero; a alternativa é esclarecer com quem já vive o modelo.',
      'consequence', 'Procrastinar a conversa estruturada prolonga o vácuo entre “preciso” e “sei o que fazer”.',
      'growth_potential', 'Marca já no WhatsApp: pede o formato de apresentação que a equipa usa e prepara as tuas perguntas financeiras objetivas.',
      'dica_rapida', 'Percebe custos de entrada e formação — transparência agora evita sustos depois.',
      'cta_text', 'Preciso falar hoje sobre renda e recomeço',
      'whatsapp_prefill', 'Oi! Fiz o quiz de transição e o resultado indica urgência. Quero falar com quem me enviou este link o mais breve possível sobre encaixe e próximo passo.'
    )
  ),

  (
    'transformar-consumo-renda',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Já consomes bem-estar — podes explorar virar isso em projeto',
      'profile_summary', 'Pelas respostas, há afinidade com produtos de nutrição e hábito de uso. Quem te enviou o link pode explicar como outras pessoas transformaram essa experiência em negócio em equipa.',
      'frase_identificacao', 'Se te identificas, gostas do produto mas ainda não sabes se queres “vender” ou “empreender”.',
      'main_blocker', 'Falta clareza sobre o que significa construir renda a partir de consumo consciente — sem forçar.',
      'consequence', 'Sem conversa, podes ficar só como cliente excelente quando o teu perfil poderia render mais opções.',
      'growth_potential', 'Pede exemplos de como se combina consumo, aprendizagem e atividade comercial ética na equipa.',
      'dica_rapida', 'Nota o que mais te motiva no produto — isso vira âncora de conversa honesta.',
      'cta_text', 'Quero saber como consumo pode virar oportunidade',
      'whatsapp_prefill', 'Oi! Fiz o quiz transformar consumo em renda. Quero conversar com quem me enviou este link para perceber se faz sentido para mim sem pressão.'
    )
  ),
  (
    'transformar-consumo-renda',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Forte identificação com produto — perfil para explorar negócio',
      'profile_summary', 'As respostas indicam que já vês valor nas soluções de bem-estar e estás aberto a monetizar essa experiência com método. A conversa com quem convidou alinha ética e expectativas.',
      'frase_identificacao', 'Se isto descreve-te, queres algo que “faça sentido” contigo antes de convidar outras pessoas.',
      'main_blocker', 'O desafio é passar de utilizador a empreendedor com apoio — não improvizar sozinho.',
      'consequence', 'Sem plano com a equipa, podes misturar mensagem pessoal com o que a marca suporta — e perder clareza.',
      'growth_potential', 'Falar com quem te enviou o link mostra onboarding, treino e como se duplica com integridade.',
      'dica_rapida', 'Pergunta que tipo de histórias podes contar publicamente — compliance importa.',
      'cta_text', 'Quero alinhar ética e plano comercial',
      'whatsapp_prefill', 'Oi! Fiz o quiz consumo-renda e o perfil saiu forte em identificação com produto. Quero conversar com quem me enviou este link sobre começar de forma correta.'
    )
  ),
  (
    'transformar-consumo-renda',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Momento ideal para dar corpo a um projeto de renda ligado ao que já usas',
      'profile_summary', 'Pelas respostas, há combinação de credibilidade como utilizador e desejo de avançar. Priorizar conversa com quem te enviou o link permite estruturar go-live sem ruído.',
      'frase_identificacao', 'Se te revês aqui, sentes que “se não for agora, adia-se outra vez”.',
      'main_blocker', 'O risco é começar sem estrutura; a equipa existe para evitar esse desgaste.',
      'consequence', 'Adiar tende a diluir entusiasmo e deixar oportunidade em modo rascunho.',
      'growth_potential', 'Pede já calendário de primeiras ações e materiais oficiais com quem partilhou o link.',
      'dica_rapida', 'Alinha com a tua liderança como vais apresentar isto a amigos — tom certo protege relacionamentos.',
      'cta_text', 'Quero começar já com quem me enviou o link',
      'whatsapp_prefill', 'Oi! Fiz o quiz transformar consumo em renda e quero avançar já com estrutura. Quero falar com quem me enviou este link para o próximo passo imediato.'
    )
  ),

  (
    'jovens-empreendedores',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil jovem e curioso sobre empreender — explora com quem te convidou',
      'profile_summary', 'Pelas respostas, há interesse em aprender e construir algo teu, ainda em fase de recolher informação. Quem enviou o link pode mostrar o dia a dia real — não só o brilhante.',
      'frase_identificacao', 'Se te identificas, queres validar se isto combina com estudos, trabalho ou outros projetos.',
      'main_blocker', 'Falta visão de tempo e prioridades — normal à tua idade; resolve-se com conversa franca.',
      'consequence', 'Ficar só em podcasts e redes sem falar com a equipa atrasa o teu critério de decisão.',
      'growth_potential', 'Pede exemplos de jovens na equipa que equilibram ritmo de aprendizagem e vida.',
      'dica_rapida', 'Traz uma meta de aprendizagem para os próximos 90 dias — mesmo que seja “só esclarecer”.',
      'cta_text', 'Quero entender se isto encaixa na minha fase',
      'whatsapp_prefill', 'Oi! Fiz o quiz jovens empreendedores. Quero conversar com quem me enviou este link para entender o dia a dia e se encaixa comigo.'
    )
  ),
  (
    'jovens-empreendedores',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Energia para construir — bom perfil para negócio em equipa',
      'profile_summary', 'As respostas mostram iniciativa e disposição para desafios. Esse perfil costuma acelerar quando há mentoria e processo claro por trás.',
      'frase_identificacao', 'Se isto é contigo, queres resultado mas ainda precisas de estrutura para não queimar etapas.',
      'main_blocker', 'O bloqueio típico é subestimar disciplina repetitiva no início — podes achar que “só criatividade” chega.',
      'consequence', 'Sem alinhamento com a liderança, podes desgastar-te a tentar reinventar o básico.',
      'growth_potential', 'Fala com quem te enviou o link sobre rituais de produtividade e accountability da equipa.',
      'dica_rapida', 'Compromete-te com horário fixo de aprendizagem semanal — mesmo 3 horas contam.',
      'cta_text', 'Quero mentoria e processo claros',
      'whatsapp_prefill', 'Oi! Fiz o quiz jovens empreendedores e o perfil saiu com energia forte para construir. Quero alinhar mentoria e processo com quem me enviou este link.'
    )
  ),
  (
    'jovens-empreendedores',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Impulso forte para empreender já — conversa prioritária',
      'profile_summary', 'Pelas respostas, há combinação de ambição e disposição para mover rápido. O passo inteligente é canalizar isso com quem te convidou para não confundir velocidade com desorganização.',
      'frase_identificacao', 'Se te revês aqui, odeias ficar parado quando sentes que há caminho.',
      'main_blocker', 'O risco é dispersão — muitos frentes ao mesmo tempo sem uma linha de execução.',
      'consequence', 'Sem conversa estruturada, podes gastar energia em tarefas que a equipa já padronizou.',
      'growth_potential', 'Pede roadmap enxuto de 30 dias com quem partilhou o link e combina check-ins.',
      'dica_rapida', 'Mede esforço como quem treina: consistência > picos de motivação.',
      'cta_text', 'Quero plano de 30 dias com quem me enviou',
      'whatsapp_prefill', 'Oi! Fiz o quiz jovens empreendedores e quero avançar já com foco. Quero falar com quem me enviou este link para um plano enxuto e próximos passos.'
    )
  ),

  (
    'ja-consome-bem-estar',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Consumidor de bem-estar — podes explorar o lado negócio',
      'profile_summary', 'Pelas respostas, já valorizas nutrição e cuidado contigo. Quem te enviou o convite pode explicar, sem pressão, como outras pessoas abriram conversas sobre o modelo.',
      'frase_identificacao', 'Se te identificas, gostas da experiência como cliente e ainda não sabes se queres algo mais.',
      'main_blocker', 'Fica por esclarecer se o teu perfil e tempo permitem atividade comercial leve ou mais estruturada.',
      'consequence', 'Sem pergunta direta, podes ficar na dúvida eterna “será para mim?”.',
      'growth_potential', 'Pede uma conversa de esclarecimento curta — o objetivo é informação, não decidir no primeiro minuto.',
      'dica_rapida', 'Reflete o que mais te motiva a recomendar algo a amigos — já é pista de encaixe.',
      'cta_text', 'Quero esclarecer sem compromisso',
      'whatsapp_prefill', 'Oi! Fiz o quiz já consumo bem-estar. Quero conversar com quem me enviou este link para perceber se exploro o lado negócio ou continuo só a consumir com consciência.'
    )
  ),
  (
    'ja-consome-bem-estar',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Crédito como utilizador — bom ponto para virar recomendação ética',
      'profile_summary', 'As respostas mostram confiança nos produtos e abertura a partilhar com rede. Isso é base sólida para um negócio em rede, desde que com método e transparência.',
      'frase_identificacao', 'Se isto descreve-te, já naturalmente falas de hábitos com outras pessoas.',
      'main_blocker', 'O desafio é separar “gosto pessoal” de “convite profissional” com respeito pelos outros.',
      'consequence', 'Sem treino com a equipa, podes ser demasiado tímido ou demasiado insistente nas conversas.',
      'growth_potential', 'Fala com quem te enviou o link sobre scripts éticos e formas de convite que preservam relacionamento.',
      'dica_rapida', 'Pratica convite curioso (“posso mostrar-te como funciona?”) em vez de pitch fechado.',
      'cta_text', 'Quero aprender sobre convite e ética',
      'whatsapp_prefill', 'Oi! Fiz o quiz já consumo bem-estar e o perfil saiu com abertura a recomendar com método. Quero aprender com quem me enviou este link como fazer isso de forma correta.'
    )
  ),
  (
    'ja-consome-bem-estar',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Momento de alinhar paixão pelo produto com projeto de impacto e renda',
      'profile_summary', 'Pelas respostas, há entusiasmo forte e disposição para ir além do consumo. A conversa urgente com quem te convidou ajuda a estruturar lançamento sem improviso.',
      'frase_identificacao', 'Se te revês aqui, sentes que já és embaixador natural da categoria.',
      'main_blocker', 'O risco é dispersar mensagem sem posicionamento claro — a equipa ajuda a definir tua linha.',
      'consequence', 'Adiar organização interna pode fazer o entusiasmo esmorecer em rotina.',
      'growth_potential', 'Combina com a tua liderança data para primeiro evento ou primeira lista de contactos qualificados.',
      'dica_rapida', 'Alinha “porque eu” numa frase — autenticidade convence mais que jargão.',
      'cta_text', 'Quero estruturar já o meu lançamento',
      'whatsapp_prefill', 'Oi! Fiz o quiz já consumo bem-estar e quero estruturar já o meu movimento com apoio. Quero falar com quem me enviou este link para o próximo passo prioritário.'
    )
  ),

  (
    'trabalhar-apenas-links',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Interesse em modelo digital simples — vê se encaixa contigo',
      'profile_summary', 'Pelas respostas, a ideia de trabalhar com link, mensagens e conteúdo online chama-te atenção mas ainda estás a explorar. Quem enviou o fluxo pode mostrar limites realistas do remoto.',
      'frase_identificacao', 'Se te identificas, queres liberdade geográfica sem perceber ainda a rotina por trás.',
      'main_blocker', 'Falta clareza sobre consistência: link sozinho não substitui hábito de prospecção e follow-up.',
      'consequence', 'Romantizar “só online” sem método leva a frustração — melhor esclarecer cedo.',
      'growth_potential', 'Pede à equipa exemplos de calendário semanal de quem trabalha assim.',
      'dica_rapida', 'Define teu melhor canal (WhatsApp, Instagram, etc.) antes de pedir dicas — foco ajuda.',
      'cta_text', 'Quero entender o trabalho com links na prática',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar com links. Quero conversar com quem me enviou este link para perceber rotina real e se faz sentido para mim.'
    )
  ),
  (
    'trabalhar-apenas-links',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil digital com foco em escala por conversa — bom match a explorar',
      'profile_summary', 'As respostas indicam conforto com ferramentas digitais e interesse em duplicar convites. O negócio em equipa costuma fornecer scripts e materiais que poupam tempo.',
      'frase_identificacao', 'Se isto é contigo, valorizas automação leve mas sabes que relacionamento ainda é centro.',
      'main_blocker', 'O desafio é manter ritmo sem queimar audiência — precisa de cadência e tom certos.',
      'consequence', 'Sem orientação, podes postar demais ou de menos e perder credibilidade.',
      'growth_potential', 'Fala com quem te enviou o link sobre biblioteca de conteúdos e boas práticas de WhatsApp.',
      'dica_rapida', 'Testa uma semana de cadência baixa mas consistente antes de escalar volume.',
      'cta_text', 'Quero rotina e conteúdo alinhados à equipa',
      'whatsapp_prefill', 'Oi! Fiz o quiz links digitais e o perfil saiu alinhado a escalar convites com método. Quero alinhar rotina com quem me enviou este link.'
    )
  ),
  (
    'trabalhar-apenas-links',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Pronto para executar online — prioriza conversa com a liderança',
      'profile_summary', 'Pelas respostas, há motivação forte para modelo remoto e ação rápida. Passo seguinte: alinhar com quem te convidou para não reinventar processos que a equipa já tem.',
      'frase_identificacao', 'Se te revês aqui, queres “modo campanha” mas com norte.',
      'main_blocker', 'Risco de improvisto: disparar mensagens sem posicionamento e sem seguimento.',
      'consequence', 'Sem plano combinado, métricas pessoais caem e culpas mal colocadas surgem.',
      'growth_potential', 'Agenda com quem partilhou o link: combina primeira série de convites, materiais e métrica simples (conversas, não só cliques).',
      'dica_rapida', 'Acompanha conversas qualificadas > vaidade de reach.',
      'cta_text', 'Quero executar já com plano da equipa',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar com links e quero executar já com norte. Quero falar com quem me enviou este link para combinar plano e materiais.'
    )
  );
