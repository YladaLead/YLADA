-- Lote 2 (5 fluxos × RISK_DIAGNOSIS × leve|moderado|urgente): recrutamento Pro Líderes.
-- v2: reescrita completa para PT-BR (eliminados europeísmos de v1).

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
      'profile_summary', 'Pelas respostas, você está repensando renda e próximo capítulo, ainda sem decisão fechada. Uma conversa com quem enviou o link ajuda a ver se o modelo de negócio encaixa sem pressão.',
      'frase_identificacao', 'Se você se identifica, quer estabilidade mas não quer fechar portas sem entender o terreno.',
      'main_blocker', 'O que falta é informação prática sobre o negócio independente e o ritmo real de construção — não slogans.',
      'consequence', 'Ficar só na sua cabeça prolonga a incerteza; falar com alguém da equipe estrutura as dúvidas.',
      'growth_potential', 'Quem compartilhou o fluxo com você pode contar como outras pessoas em transição se organizaram.',
      'dica_rapida', 'Liste o que você precisa que uma renda cubra neste mês — útil para uma conversa honesta.',
      'cta_text', 'Quero falar sobre transição e oportunidade',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre transição após perda de emprego. Quero conversar com quem me enviou este link para entender se esta oportunidade encaixa no meu momento.'
    )
  ),
  (
    'perderam-emprego-transicao',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Recomeço com necessidade real de renda — alinhe com a equipe',
      'profile_summary', 'As respostas mostram pressão para gerar resultado mas também abertura para algo novo em equipe. É cenário comum onde transparência com quem te convidou evita expectativas erradas.',
      'frase_identificacao', 'Se isso combina com você, quer ver caminho concreto, não discurso motivacional vazio.',
      'main_blocker', 'O ponto crítico é cruzar urgência financeira com aprendizagem inicial — precisa de calendário e suporte claros.',
      'consequence', 'Sem esse alinhamento, você pode se frustrar por achar que "devia ser mais rápido" sem ver o processo inteiro.',
      'growth_potential', 'Peça a quem te enviou o link um plano de primeiros passos e a formação obrigatória no início.',
      'dica_rapida', 'Evite comparar com quem já leva anos no modelo — pergunte o que é realista para quem começa.',
      'cta_text', 'Quero um plano de recomeço honesto',
      'whatsapp_prefill', 'Oi! Fiz o quiz de transição profissional e preciso alinhar expectativas com a realidade. Quero conversar com quem me enviou este link sobre plano inicial e suporte.'
    )
  ),
  (
    'perderam-emprego-transicao',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Transição com urgência — conversa prioritária para ver encaixe',
      'profile_summary', 'Pelas respostas, a necessidade de renda e direção é forte. O melhor uso do tempo agora é falar com quem te enviou o link para ver próximos passos com clareza — sem promessa de atalhos.',
      'frase_identificacao', 'Se você se vê aqui, cada semana sem decisão informada pesa.',
      'main_blocker', 'O risco é aceitar qualquer coisa por desespero; a alternativa é esclarecer com quem já vive o modelo.',
      'consequence', 'Adiar a conversa estruturada prolonga o vácuo entre "preciso" e "sei o que fazer".',
      'growth_potential', 'Agende já no WhatsApp: peça o formato de apresentação que a equipe usa e prepare suas perguntas financeiras objetivas.',
      'dica_rapida', 'Entenda custos de entrada e formação — transparência agora evita surpresas depois.',
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
      'profile_title', 'Já consome bem-estar — pode explorar virar isso em projeto',
      'profile_summary', 'Pelas respostas, há afinidade com produtos de nutrição e hábito de uso. Quem te enviou o link pode explicar como outras pessoas transformaram essa experiência em negócio em equipe.',
      'frase_identificacao', 'Se você se identifica, gosta do produto mas ainda não sabe se quer "vender" ou "empreender".',
      'main_blocker', 'Falta clareza sobre o que significa construir renda a partir de consumo consciente — sem forçar.',
      'consequence', 'Sem conversar, você pode ficar só como cliente excelente quando o seu perfil poderia ter mais opções.',
      'growth_potential', 'Peça exemplos de como se combina consumo, aprendizagem e atividade comercial ética na equipe.',
      'dica_rapida', 'Anote o que mais te motiva no produto — isso vira âncora de conversa honesta.',
      'cta_text', 'Quero saber como consumo pode virar oportunidade',
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
      'profile_summary', 'As respostas indicam que você já vê valor nas soluções de bem-estar e está aberto a monetizar essa experiência com método. A conversa com quem te convidou alinha ética e expectativas.',
      'frase_identificacao', 'Se isso te descreve, quer algo que "faça sentido" com você antes de convidar outras pessoas.',
      'main_blocker', 'O desafio é passar de usuário a empreendedor com apoio — não improvisar sozinho.',
      'consequence', 'Sem plano com a equipe, você pode misturar mensagem pessoal com o que a marca suporta — e perder clareza.',
      'growth_potential', 'Falar com quem te enviou o link mostra onboarding, treino e como se duplica com integridade.',
      'dica_rapida', 'Pergunte que tipo de histórias você pode contar publicamente — compliance importa.',
      'cta_text', 'Quero alinhar ética e plano comercial',
      'whatsapp_prefill', 'Oi! Fiz o quiz consumo-renda e o perfil saiu forte em identificação com produto. Quero conversar com quem me enviou este link sobre como começar de forma correta.'
    )
  ),
  (
    'transformar-consumo-renda',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Momento ideal para dar forma a um projeto de renda ligado ao que já usa',
      'profile_summary', 'Pelas respostas, há combinação de credibilidade como usuário e desejo de avançar. Priorizar conversa com quem te enviou o link permite estruturar o início sem ruído.',
      'frase_identificacao', 'Se você se vê aqui, sente que "se não for agora, adia de novo".',
      'main_blocker', 'O risco é começar sem estrutura; a equipe existe para evitar esse desgaste.',
      'consequence', 'Adiar tende a diluir o entusiasmo e deixar a oportunidade em modo rascunho.',
      'growth_potential', 'Peça já o calendário de primeiras ações e materiais oficiais com quem compartilhou o link.',
      'dica_rapida', 'Alinhe com a sua liderança como vai apresentar isso aos amigos — o tom certo protege relacionamentos.',
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
      'profile_title', 'Perfil jovem e curioso sobre empreender — explore com quem te convidou',
      'profile_summary', 'Pelas respostas, há interesse em aprender e construir algo seu, ainda em fase de reunir informação. Quem enviou o link pode mostrar o dia a dia real — não só o lado brilhante.',
      'frase_identificacao', 'Se você se identifica, quer validar se isso combina com estudos, trabalho ou outros projetos.',
      'main_blocker', 'Falta visão de tempo e prioridades — normal nessa fase; resolve-se com uma conversa franca.',
      'consequence', 'Ficar só em podcasts e redes sem falar com a equipe atrasa o seu critério de decisão.',
      'growth_potential', 'Peça exemplos de jovens na equipe que equilibram ritmo de aprendizagem e vida.',
      'dica_rapida', 'Traga uma meta de aprendizagem para os próximos 90 dias — mesmo que seja "só esclarecer".',
      'cta_text', 'Quero entender se isso encaixa na minha fase',
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
      'frase_identificacao', 'Se isso combina com você, quer resultado mas ainda precisa de estrutura para não queimar etapas.',
      'main_blocker', 'O bloqueio típico é subestimar a disciplina repetitiva no início — pode achar que "só criatividade" resolve.',
      'consequence', 'Sem alinhamento com a liderança, você pode se desgastar tentando reinventar o básico.',
      'growth_potential', 'Fale com quem te enviou o link sobre rituais de produtividade e accountability da equipe.',
      'dica_rapida', 'Comprometa-se com um horário fixo de aprendizagem semanal — mesmo 3 horas contam.',
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
      'frase_identificacao', 'Se você se vê aqui, odeia ficar parado quando sente que há caminho.',
      'main_blocker', 'O risco é dispersão — muitas frentes ao mesmo tempo sem uma linha de execução.',
      'consequence', 'Sem conversa estruturada, você pode gastar energia em tarefas que a equipe já padronizou.',
      'growth_potential', 'Peça um roadmap enxuto de 30 dias com quem compartilhou o link e combine check-ins.',
      'dica_rapida', 'Meça esforço como quem treina: consistência > picos de motivação.',
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
      'profile_title', 'Consumidor de bem-estar — pode explorar o lado negócio',
      'profile_summary', 'Pelas respostas, você já valoriza nutrição e cuidado consigo. Quem te enviou o convite pode explicar, sem pressão, como outras pessoas abriram conversas sobre o modelo.',
      'frase_identificacao', 'Se você se identifica, gosta da experiência como cliente e ainda não sabe se quer algo mais.',
      'main_blocker', 'Fica por esclarecer se o seu perfil e tempo permitem atividade comercial leve ou mais estruturada.',
      'consequence', 'Sem uma pergunta direta, você pode ficar na dúvida eterna "será que é para mim?".',
      'growth_potential', 'Peça uma conversa de esclarecimento curta — o objetivo é informação, não decidir no primeiro minuto.',
      'dica_rapida', 'Reflita o que mais te motiva a recomendar algo para amigos — já é pista de encaixe.',
      'cta_text', 'Quero esclarecer sem compromisso',
      'whatsapp_prefill', 'Oi! Fiz o quiz já consumo bem-estar. Quero conversar com quem me enviou este link para entender se exploro o lado negócio ou continuo só consumindo com consciência.'
    )
  ),
  (
    'ja-consome-bem-estar',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Credibilidade como usuário — bom ponto para virar recomendação ética',
      'profile_summary', 'As respostas mostram confiança nos produtos e abertura para compartilhar com a rede. Isso é base sólida para um negócio em rede, desde que com método e transparência.',
      'frase_identificacao', 'Se isso te descreve, você naturalmente já fala de hábitos com outras pessoas.',
      'main_blocker', 'O desafio é separar "gosto pessoal" de "convite profissional" com respeito pelos outros.',
      'consequence', 'Sem treino com a equipe, você pode ser tímido demais ou insistente demais nas conversas.',
      'growth_potential', 'Fale com quem te enviou o link sobre scripts éticos e formas de convite que preservam o relacionamento.',
      'dica_rapida', 'Pratique o convite curioso ("posso te mostrar como funciona?") em vez do pitch fechado.',
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
      'profile_summary', 'Pelas respostas, há entusiasmo forte e disposição para ir além do consumo. A conversa urgente com quem te convidou ajuda a estruturar o lançamento sem improviso.',
      'frase_identificacao', 'Se você se vê aqui, sente que já é um embaixador natural da categoria.',
      'main_blocker', 'O risco é dispersar a mensagem sem posicionamento claro — a equipe ajuda a definir a sua linha.',
      'consequence', 'Adiar a organização interna pode fazer o entusiasmo esmorecer na rotina.',
      'growth_potential', 'Combine com a sua liderança a data para um primeiro evento ou para a primeira lista de contatos qualificados.',
      'dica_rapida', 'Alinhe "por que eu" em uma frase — autenticidade convence mais do que jargão.',
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
      'profile_title', 'Interesse em modelo digital simples — veja se encaixa com você',
      'profile_summary', 'Pelas respostas, a ideia de trabalhar com link, mensagens e conteúdo online chama a sua atenção mas você ainda está explorando. Quem enviou o fluxo pode mostrar os limites realistas do remoto.',
      'frase_identificacao', 'Se você se identifica, quer liberdade geográfica mas sem noção da rotina por trás.',
      'main_blocker', 'Falta clareza sobre consistência: link sozinho não substitui hábito de prospecção e follow-up.',
      'consequence', 'Romantizar "só online" sem método leva a frustração — melhor esclarecer cedo.',
      'growth_potential', 'Peça à equipe exemplos de calendário semanal de quem trabalha assim.',
      'dica_rapida', 'Defina o seu melhor canal (WhatsApp, Instagram, etc.) antes de pedir dicas — foco ajuda.',
      'cta_text', 'Quero entender o trabalho com links na prática',
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
      'frase_identificacao', 'Se isso combina com você, valoriza automação leve mas sabe que relacionamento ainda é o centro.',
      'main_blocker', 'O desafio é manter ritmo sem queimar a audiência — precisa de cadência e tom certos.',
      'consequence', 'Sem orientação, você pode postar demais ou de menos e perder credibilidade.',
      'growth_potential', 'Fale com quem te enviou o link sobre biblioteca de conteúdos e boas práticas de WhatsApp.',
      'dica_rapida', 'Teste uma semana de cadência baixa mas consistente antes de escalar volume.',
      'cta_text', 'Quero rotina e conteúdo alinhados à equipe',
      'whatsapp_prefill', 'Oi! Fiz o quiz links digitais e o perfil saiu alinhado a escalar convites com método. Quero alinhar rotina com quem me enviou este link.'
    )
  ),
  (
    'trabalhar-apenas-links',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Pronto para executar online — priorize conversa com a liderança',
      'profile_summary', 'Pelas respostas, há motivação forte para modelo remoto e ação rápida. Próximo passo: alinhar com quem te convidou para não reinventar processos que a equipe já tem.',
      'frase_identificacao', 'Se você se vê aqui, quer "modo campanha" mas com norte.',
      'main_blocker', 'Risco de improvisar: disparar mensagens sem posicionamento e sem acompanhamento.',
      'consequence', 'Sem plano combinado, as métricas pessoais caem e surgem culpas mal colocadas.',
      'growth_potential', 'Agende com quem compartilhou o link: combine a primeira série de convites, materiais e uma métrica simples (conversas, não só cliques).',
      'dica_rapida', 'Acompanhe conversas qualificadas > vaidade de alcance.',
      'cta_text', 'Quero executar já com plano da equipe',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar com links e quero executar já com norte. Quero falar com quem me enviou este link para combinar plano e materiais.'
    )
  );
