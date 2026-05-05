-- PT-BR: reaplica lote 2 (398) — outcomes de recrutamento Pro Líderes em português do Brasil + CTA unificado.
-- Rodar após 398; idempotente (DELETE + INSERT dos mesmos flow_id).

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
      'profile_summary', 'Pelas respostas, você está repensando renda e o próximo capítulo, ainda sem decisão fechada. Uma conversa com quem enviou o link ajuda a ver se o modelo de negócio encaixa sem pressão.',
      'frase_identificacao', 'Se você se identifica, quer estabilidade mas não quer fechar portas sem entender o terreno.',
      'main_blocker', 'O que falta é informação prática sobre o negócio independente e o ritmo real de construção — não slogans.',
      'consequence', 'Ficar só na sua cabeça prolonga incerteza; falar com alguém da equipe estrutura dúvidas.',
      'growth_potential', 'Quem compartilhou o fluxo com você pode contar como outras pessoas em transição se organizaram.',
      'dica_rapida', 'Lista o que precisas que um rendimento cobra neste mês — útil para conversa honesta.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre transição após perda de emprego. Quero conversar com quem me enviou este link para entender se esta oportunidade encaixa no meu momento.'
    )
  ),
  (
    'perderam-emprego-transicao',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Recomeço com necessidade real de rendimento — alinha com a equipe',
      'profile_summary', 'As respostas mostram pressão para gerar resultado mas também abertura para algo novo em equipe. É cenário comum onde transparência com quem te convidou evita expectativas erradas.',
      'frase_identificacao', 'Se isso é com você, você quer ver caminho concreto, não discurso motivacional vazio.',
      'main_blocker', 'O ponto crítico é cruzar urgência financeira com aprendizagem inicial — precisa de calendário e suporte claros.',
      'consequence', 'Sem esse alinhamento, você pode frustrar você por achar que “devia ser mais rápido” sem ver o processo inteiro.',
      'growth_potential', 'Peça a quem te enviou o link um plano de primeiros passos e formação obrigatória no início.',
      'dica_rapida', 'Evite comparar com quem já leva anos no modelo — pergunte o que é realista para quem começa.',
      'cta_text', 'Quero conhecer novas oportunidades',
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
      'frase_identificacao', 'Se você se vê aqui, cada semana sem decisão informada pesa.',
      'main_blocker', 'O risco é aceitar qualquer coisa por desespero; a alternativa é esclarecer com quem já vive o modelo.',
      'consequence', 'Procrastinar a conversa estruturada prolonga o vácuo entre “preciso” e “sei o que fazer”.',
      'growth_potential', 'Marque já no WhatsApp: peça o formato de apresentação que a equipe usa e prepara as suas perguntas financeiras objetivas.',
      'dica_rapida', 'Entenda os custos de entrada e formação — transparência agora evita sustos depois.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz de transição e o resultado indica urgência. Quero falar com quem me enviou este link o mais breve possível sobre encaixe e próximo passo.'
    )
  ),

  (
    'transformar-consumo-renda',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Já consome bem-estar — você pode explorar transformar isso em projeto',
      'profile_summary', 'Pelas respostas, há afinidade com produtos de nutrição e hábito de uso. Quem te enviou o link pode explicar como outras pessoas transformaram essa experiência em negócio em equipe.',
      'frase_identificacao', 'Se você se identifica, gosta do produto mas ainda não sabe se quer “vender” ou “empreender”.',
      'main_blocker', 'Falta clareza sobre o que significa construir renda a partir de consumo consciente — sem forçar.',
      'consequence', 'Sem conversa, você pode ficar só como cliente excelente quando o seu perfil poderia render mais opções.',
      'growth_potential', 'Peça exemplos de como se combina consumo, aprendizagem e atividade comercial ética na equipe.',
      'dica_rapida', 'Anote o que mais te motiva no produto — isso vira âncora de conversa honesta.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz transformar consumo em renda. Quero conversar com quem me enviou este link para entender se faz sentido para mim sem pressão.'
    )
  ),
  (
    'transformar-consumo-renda',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Forte identificação com produto — perfil para explorar negócio',
      'profile_summary', 'As respostas indicam que já vê valor nas soluções de bem-estar e você está aberto a monetizar essa experiência com método. A conversa com quem convidou alinha ética e expectativas.',
      'frase_identificacao', 'Se isso descreve você, você quer algo que “faça sentido” com você antes de convidar outras pessoas.',
      'main_blocker', 'O desafio é passar de usuário a empreendedor com apoio — não improvizar sozinho.',
      'consequence', 'Sem plano com a equipe, você pode misturar mensagem pessoal com o que a marca suporta — e perder clareza.',
      'growth_potential', 'Falar com quem te enviou o link mostra onboarding, treino e como se duplica com integridade.',
      'dica_rapida', 'Pergunte que tipo de histórias você pode contar publicamente — compliance importa.',
      'cta_text', 'Quero conhecer novas oportunidades',
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
      'profile_summary', 'Pelas respostas, há combinação de credibilidade como usuário e desejo de avançar. Priorizar conversa com quem te enviou o link permite estruturar go-live sem ruído.',
      'frase_identificacao', 'Se você se vê aqui, sentes que “se não for agora, adia-se outra vez”.',
      'main_blocker', 'O risco é começar sem estrutura; a equipe existe para evitar esse desgaste.',
      'consequence', 'Adiar tende a diluir entusiasmo e deixar oportunidade em modo rascunho.',
      'growth_potential', 'Peça já calendário de primeiras ações e materiais oficiais com quem compartilhou o link.',
      'dica_rapida', 'Alinhe com a sua liderança como vais apresentar isso a amigos — tom certo protege relacionamentos.',
      'cta_text', 'Quero conhecer novas oportunidades',
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
      'profile_summary', 'Pelas respostas, há interesse em aprender e construir algo seu, ainda em fase de recolher informação. Quem enviou o link pode mostrar o dia a dia real — não só o brilhante.',
      'frase_identificacao', 'Se você se identifica, você quer validar se isso combina com estudos, trabalho ou outros projetos.',
      'main_blocker', 'Falta visão de tempo e prioridades — normal à sua idade; resolve-se com conversa franca.',
      'consequence', 'Ficar só em podcasts e redes sem falar com a equipe atrasa o seu critério de decisão.',
      'growth_potential', 'Peça exemplos de jovens na equipe que equilibram ritmo de aprendizagem e vida.',
      'dica_rapida', 'Traga uma meta de aprendizagem para os próximos 90 dias — mesmo que seja “só esclarecer”.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz jovens empreendedores. Quero conversar com quem me enviou este link para entender o dia a dia e se encaixa comigo.'
    )
  ),
  (
    'jovens-empreendedores',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Energia para construir — bom perfil para negócio em equipe',
      'profile_summary', 'As respostas mostram iniciativa e disposição para desafios. Esse perfil costuma acelerar quando há mentoria e processo claro por trás.',
      'frase_identificacao', 'Se isso é com você, você quer resultado mas ainda você precisa de estrutura para não queimar etapas.',
      'main_blocker', 'O bloqueio típico é subestimar disciplina repetitiva no início — você pode achar que “só criatividade” chega.',
      'consequence', 'Sem alinhamento com a liderança, você pode desgastar-te a tentar reinventar o básico.',
      'growth_potential', 'Converse com quem te enviou o link sobre rituais de produtividade e accountability da equipe.',
      'dica_rapida', 'Comprometa-se com horário fixo de aprendizagem semanal — mesmo 3 horas contam.',
      'cta_text', 'Quero conhecer novas oportunidades',
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
      'frase_identificacao', 'Se você se vê aqui, odeias ficar parado quando sentes que há caminho.',
      'main_blocker', 'O risco é dispersão — muitos frentes ao mesmo tempo sem uma linha de execução.',
      'consequence', 'Sem conversa estruturada, você pode gastar energia em tarefas que a equipe já padronizou.',
      'growth_potential', 'Peça roadmap enxuto de 30 dias com quem compartilhou o link e combina check-ins.',
      'dica_rapida', 'Mede esforço como quem treina: consistência > picos de motivação.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz jovens empreendedores e quero avançar já com foco. Quero falar com quem me enviou este link para um plano enxuto e próximos passos.'
    )
  ),

  (
    'ja-consome-bem-estar',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Consumidor de bem-estar — você pode explorar o lado negócio',
      'profile_summary', 'Pelas respostas, já você valoriza nutrição e cuidado com você. Quem te enviou o convite pode explicar, sem pressão, como outras pessoas abriram conversas sobre o modelo.',
      'frase_identificacao', 'Se você se identifica, gosta da experiência como cliente e ainda não sabe se quer algo mais.',
      'main_blocker', 'Fica por esclarecer se o seu perfil e tempo permitem atividade comercial leve ou mais estruturada.',
      'consequence', 'Sem pergunta direta, você pode ficar na dúvida eterna “será para mim?”.',
      'growth_potential', 'Peça uma conversa de esclarecimento curta — o objetivo é informação, não decidir no primeiro minuto.',
      'dica_rapida', 'Reflita o que mais te motiva a recomendar algo a amigos — já é pista de encaixe.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz já consumo bem-estar. Quero conversar com quem me enviou este link para entender se exploro o lado negócio ou continuo só a consumir com consciência.'
    )
  ),
  (
    'ja-consome-bem-estar',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Crédito como usuário — bom ponto para virar recomendação ética',
      'profile_summary', 'As respostas mostram confiança nos produtos e abertura a compartilhar com rede. Isso é base sólida para um negócio em rede, desde que com método e transparência.',
      'frase_identificacao', 'Se isso descreve você, já naturalmente você fala de hábitos com outras pessoas.',
      'main_blocker', 'O desafio é separar “gosto pessoal” de “convite profissional” com respeito pelos outros.',
      'consequence', 'Sem treino com a equipe, você pode ser tímido demais ou insistente demais nas conversas.',
      'growth_potential', 'Converse com quem te enviou o link sobre scripts éticos e formas de convite que preservam relacionamento.',
      'dica_rapida', 'Pratique convite curioso (“posso mostrar para você como funciona?”) em vez de pitch fechado.',
      'cta_text', 'Quero conhecer novas oportunidades',
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
      'frase_identificacao', 'Se você se vê aqui, sentes que já é embaixador natural da categoria.',
      'main_blocker', 'O risco é dispersar mensagem sem posicionamento claro — a equipe ajuda a definir sua linha.',
      'consequence', 'Adiar organização interna pode fazer o entusiasmo diminuir em rotina.',
      'growth_potential', 'Combine com a sua liderança data para primeiro evento ou primeira lista de contatos qualificados.',
      'dica_rapida', 'Alinhe “porque eu” numa frase — autenticidade convence mais que jargão.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz já consumo bem-estar e quero estruturar já o meu movimento com apoio. Quero falar com quem me enviou este link para o próximo passo prioritário.'
    )
  ),

  (
    'trabalhar-apenas-links',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Interesse em modelo digital simples — vê se encaixa com você',
      'profile_summary', 'Pelas respostas, a ideia de trabalhar com link, mensagens e conteúdo online chama sua atenção, mas você ainda está explorando. Quem enviou o fluxo pode mostrar limites realistas do remoto.',
      'frase_identificacao', 'Se você se identifica, você quer liberdade geográfica sem entender ainda a rotina por trás.',
      'main_blocker', 'Falta clareza sobre consistência: link sozinho não substitui hábito de prospecção e follow-up.',
      'consequence', 'Romantizar “só online” sem método leva a frustração — melhor esclarecer cedo.',
      'growth_potential', 'Peça à equipe exemplos de calendário semanal de quem trabalha assim.',
      'dica_rapida', 'Defina seu melhor canal (WhatsApp, Instagram, etc.) antes de pedir dicas — foco ajuda.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar com links. Quero conversar com quem me enviou este link para entender rotina real e se faz sentido para mim.'
    )
  ),
  (
    'trabalhar-apenas-links',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil digital com foco em escala por conversa — bom match a explorar',
      'profile_summary', 'As respostas indicam conforto com ferramentas digitais e interesse em duplicar convites. O negócio em equipe costuma fornecer scripts e materiais que poupam tempo.',
      'frase_identificacao', 'Se isso é você, valoriza automação leve mas sabe que relacionamento ainda é o centro.',
      'main_blocker', 'O desafio é manter ritmo sem queimar audiência — precisa de cadência e tom certos.',
      'consequence', 'Sem orientação, você pode postar demais ou de menos e perder credibilidade.',
      'growth_potential', 'Converse com quem te enviou o link sobre biblioteca de conteúdos e boas práticas de WhatsApp.',
      'dica_rapida', 'Testa uma semana de cadência baixa mas consistente antes de escalar volume.',
      'cta_text', 'Quero conhecer novas oportunidades',
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
      'profile_summary', 'Pelas respostas, há motivação forte para modelo remoto e ação rápida. Passo seguinte: alinhar com quem te convidou para não reinventar processos que a equipe já tem.',
      'frase_identificacao', 'Se você se vê aqui, quer “modo campanha”, mas com norte.',
      'main_blocker', 'Risco de improvisto: disparar mensagens sem posicionamento e sem seguimento.',
      'consequence', 'Sem plano combinado, métricas pessoais caem e culpas mal colocadas surgem.',
      'growth_potential', 'Agende com quem compartilhou o link: combine a primeira série de convites, materiais e métrica simples (conversas, não só cliques).',
      'dica_rapida', 'Acompanhe conversas qualificadas > vaidade de reach.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar com links e quero executar já com norte. Quero falar com quem me enviou este link para combinar plano e materiais.'
    )
  );

-- PT-BR: reaplica lote final (400) — outcomes de recrutamento Pro Líderes em português do Brasil + CTA unificado.
-- Rodar após 400; idempotente (DELETE + INSERT dos mesmos flow_id).

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
      'profile_title', 'Objetivos de shape e de oportunidade — veja se o seu caso encaixa',
      'profile_summary', 'Pelas respostas, há interesse em bem-estar corporal e também em explorar renda. Conversa com quem enviou o link para não misturar promessa de resultado físico com oportunidade de negócio — cada coisa no seu lugar, com ética.',
      'frase_identificacao', 'Se você se identifica, quer saúde e finanças falando a mesma língua sem confundir as duas.',
      'main_blocker', 'Risco de mensagem ambígua; você precisa separar conversa de produto/hábitos de conversa de modelo de negócio.',
      'consequence', 'Sem esse alinhamento, você pode se frustrar ou frustrar quem te segue.',
      'growth_potential', 'Quem te convidou pode mostrar como a equipe posiciona produto de bem-estar sem violar limites de promessa.',
      'dica_rapida', 'Evite associar “ganhar dinheiro” a “emagrecer X kg” na mesma frase — separa narrativas.',
      'cta_text', 'Quero conhecer novas oportunidades',
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
      'profile_summary', 'As respostas mostram motivação dupla coerente: cuidar da sua saúde e construir renda com propósito. O modelo em equipe de bem-estar pode servir as duas frentes quando há clareza de papéis.',
      'frase_identificacao', 'Se isso descreve você, quer história autêntica — ganhou credibilidade onde viveu mudança.',
      'main_blocker', 'Precisas evitar “antes/depois” sensacionalista em público — foca hábitos e acompanhamento sério.',
      'consequence', 'Sem treino de compliance na equipe, você pode expor-te a mensagens de risco.',
      'growth_potential', 'Peça a quem te enviou o link guia de comunicação responsável e exemplos de boas práticas.',
      'dica_rapida', 'Conta a sua jornada como processo, não como garantia — gera confiança.',
      'cta_text', 'Quero conhecer novas oportunidades',
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
      'profile_summary', 'Pelas respostas, há intensidade forte nos dois eixos (mudança física e projeto de renda). Passo crítico: alinhar urgência com realismo via quem já mentor — evite frustração e mensagens arriscadas.',
      'frase_identificacao', 'Se você se vê aqui, você quer resultado visível e momentum de negócio — canaliza isso com método.',
      'main_blocker', 'Risco de prometer demais a ti mesmo ou a outros no calor da urgência.',
      'consequence', 'Picos de motivação sem plano fundam-se em silêncio depois — conversa estruturada protege-te.',
      'growth_potential', 'Marque já com quem te enviou o link: define metas de hábito à parte de metas de negócio nas primeiras 8 semanas.',
      'dica_rapida', 'Documenta métricas de hábito (água, sono, passos) separadas de métricas de atividade comercial.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz emagrecer-renda com forte urgência e quero calibrar expectativas de hábitos e negócio. Quero falar com quem me enviou este link prioritariamente.'
    )
  ),

  (
    'boas-venda-comercial',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil comercial sociável — explora duplicação em equipe',
      'profile_summary', 'Pelas respostas, você gosta de gente e de conversa fluida. Esse traço ajuda no relacionamento, mas negócio sólido também precisa de sistema — quem te enviou o link mostra as duas faces.',
      'frase_identificacao', 'Se você se identifica, vendes bem “no boca a boca” mas talvez falte checklist.',
      'main_blocker', 'Risco de depender só de carisma sem follow-up estruturado.',
      'consequence', 'Sem CRM simples ou ritual de acompanhamento, leads esfriam.',
      'growth_potential', 'Peça treino de follow-up e scripts éticos à equipe.',
      'dica_rapida', 'Depois de cada conversa, anota próximo passo com data — disciplina minimalista.',
      'cta_text', 'Quero conhecer novas oportunidades',
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
      'profile_summary', 'As respostas indicam confiança em influenciar decisões e criar rapport. Modelo em rede beneficia disso quando há duplicação — formar outros a fazer bem o convite.',
      'frase_identificacao', 'Se isso é com você, talvez já cries resultado sozinho mas queiras alavancar equipe.',
      'main_blocker', 'Ensinar a vender é diferente de vender — precisas framework simples.',
      'consequence', 'Ser “estrela solo” limita crescimento e cansa.',
      'growth_potential', 'Converse com quem te enviou o link sobre mentoria downstream e treinos de duplicação.',
      'dica_rapida', 'Grava mini pitch de 60s e revisa com alguém da liderança — afina mensagem.',
      'cta_text', 'Quero conhecer novas oportunidades',
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
      'profile_summary', 'Pelas respostas, você tem tração interpessoal forte e disposição para liderar conversas. Próximo nível: combinar seu dom com processo escalável da equipe — conversa prioritária com quem convidou.',
      'frase_identificacao', 'Se você se vê aqui, sentes teto de rendimento se tudo passa só por ti.',
      'main_blocker', 'Sem sistematizar pipeline e onboarding de novos, crescer dói.',
      'consequence', 'Adiar estruturação mantém-te em ciclo de esforço linear.',
      'growth_potential', 'Agende com quem compartilhou o link blueprint de liderança inicial (quantos mentores, que cadência).',
      'dica_rapida', 'Começa a documentar sua melhor sequência de conversa — vira módulo replicável.',
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz venda comercial e quero alavancar já com estrutura de rede. Quero falar com quem me enviou este link sobre blueprint de liderança e onboarding.'
    )
  );