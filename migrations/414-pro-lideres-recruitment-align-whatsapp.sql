-- Pro Líderes recrutamento (PT-BR): alinhar perguntas→resultado→WhatsApp.
-- Adiciona causa_provavel, preocupacoes, espelho_comportamental, specific_actions;
-- reduz repetição entre resumo/bloqueio/consequência; reforça whatsapp_prefill.
-- Idempotente: DELETE + INSERT dos mesmos flow_id × arquétipo (após 413).

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'perderam-emprego-transicao',
    'transformar-consumo-renda',
    'jovens-empreendedores',
    'ja-consome-bem-estar',
    'trabalhar-apenas-links',
    'querem-emagrecer-renda',
    'boas-venda-comercial'
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
      'profile_title', 'Em transição — vale mapear opções com quem te convidou',
      'profile_summary', 'Pelas respostas, você está entre renda e próximo capítulo, sem decisão fechada; isso é comum e conversível em clareza com apoio.',
      'frase_identificacao', 'Se você se identifica, quer estabilidade sem fechar portas sem entender o terreno.',
      'espelho_comportamental', 'Se fez sentido até aqui, o passo natural é tirar dúvidas com quem te enviou o link — ainda hoje.',
      'main_blocker', 'Falta visão prática do que o início exige em tempo, custo e suporte — não falta interesse em mudar.',
      'causa_provavel', 'O travamento costuma ser pouca informação estruturada sobre o modelo real, não falta de capacidade.',
      'preocupacoes', 'Continuar só na cabeça prolonga incerteza e cansa mais do que uma conversa de 15 minutos bem direta.',
      'consequence', 'Sem alinhar expectativas com quem já vive o processo, você adia o critério para decidir com segurança.',
      'growth_potential', 'Quem compartilhou o link pode contar como outras pessoas em transição se organizaram no começo.',
      'dica_rapida', 'Anote o que a renda precisa cobrir neste mês — isso deixa a conversa objetiva.',
      'specific_actions', jsonb_build_array(
        'Toque no botão e envie a mensagem sugerida; ela já abre o assunto com contexto.',
        'Peça três respostas: prazo típico no início, custos de entrada e formato de treino.',
        'Combine um horário curto para falar — microcompromisso aumenta retorno.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Terminei o quiz sobre transição/renda. Quero falar com quem me enviou este link ainda hoje — já tenho 3 perguntas objetivas (prazo no início, custos, treino).'
    )
  ),
  (
    'perderam-emprego-transicao',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Recomeço com pressão de renda — alinha com a equipe',
      'profile_summary', 'Pelas respostas, há urgência real combinada com abertura para algo novo em equipe; transparência agora evita frustração depois.',
      'frase_identificacao', 'Se isso é com você, você quer caminho concreto, não discurso motivacional vazio.',
      'espelho_comportamental', 'Se o resultado bateu forte, o melhor uso do próximo minuto é o WhatsApp com quem te convidou.',
      'main_blocker', 'Cruzar urgência financeira com aprendizagem inicial sem calendário claro — isso pede conversa com quem mentor.',
      'causa_provavel', 'O atrito costuma ser expectativa de ritmo versus realidade do onboarding; sem alinhar, o desgaste vem cedo.',
      'preocupacoes', 'Achar que deveria ser mais rápido sem ver o processo completo gera culpa injusta e atrasa decisão.',
      'consequence', 'Sem plano combinado, você oscila entre impulso e paralisia — e o tempo continua correndo.',
      'growth_potential', 'Peça a quem te enviou o link um plano de primeiros passos e formação obrigatória no início.',
      'dica_rapida', 'Evite comparar com quem já leva anos no modelo — pergunte o que é realista para quem começa.',
      'specific_actions', jsonb_build_array(
        'Envie a mensagem do botão e diga que quer alinhar urgência com plano inicial.',
        'Peça exemplo de agenda da primeira semana (horas, tarefas, suporte).',
        'Marque retorno em 48h se a pessoa não responder — mantém momentum.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz de transição; preciso alinhar urgência com plano realista de início. Quero falar com quem me enviou este link sobre calendário, custos e suporte nas primeiras semanas.'
    )
  ),
  (
    'perderam-emprego-transicao',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Transição com urgência — conversa prioritária para ver encaixe',
      'profile_summary', 'Pelas respostas, a necessidade de direção e renda é alta; o próximo passo útil é conversa estruturada com quem conhece o modelo — sem promessa de atalho mágico.',
      'frase_identificacao', 'Se você se vê aqui, cada semana sem decisão informada pesa.',
      'espelho_comportamental', 'Se o resultado acendeu alerta, não deixe o próximo passo para depois: o WhatsApp é o canal certo agora.',
      'main_blocker', 'Risco de aceitar qualquer coisa por desespero; a alternativa é esclarecer critérios com quem já vive o modelo.',
      'causa_provavel', 'Urgência sem informação qualificada vira ruído; falta priorizar uma conversa com roteiro.',
      'preocupacoes', 'Procrastinar a conversa estruturada mantém o vácuo entre preciso e sei o que fazer.',
      'consequence', 'Adiar esclarecimentos objetivos prolonga estresse sem avançar critério de decisão.',
      'growth_potential', 'Marque no WhatsApp: peça formato de apresentação da equipe e leve perguntas financeiras diretas.',
      'dica_rapida', 'Entenda custos de entrada e formação — transparência agora evita sustos depois.',
      'specific_actions', jsonb_build_array(
        'Toque no WhatsApp e peça o próximo passo nas próximas 24 horas.',
        'Envie suas 3 dúvidas mais caras (tempo, dinheiro, suporte) em uma única mensagem.',
        'Combine horário de voz ou áudio curto se escrito atrasar resposta.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz de transição e o resultado saiu urgente. Quero falar com quem me enviou este link o mais breve possível — tenho perguntas sobre tempo, custo inicial e suporte nas primeiras semanas.'
    )
  ),

  (
    'transformar-consumo-renda',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Já consome bem-estar — vale explorar o projeto com calma',
      'profile_summary', 'Pelas respostas, há afinidade com produtos de nutrição e hábito de uso; falta só ver se o lado negócio conversa com você.',
      'frase_identificacao', 'Se você se identifica, gosta do produto mas ainda não sabe se quer vender ou empreender.',
      'espelho_comportamental', 'Se você já recomenda o que usa, uma conversa curta com quem enviou o link costuma destravar dúvidas.',
      'main_blocker', 'Falta clareza sobre o que significa construir renda a partir de consumo consciente — sem pressão de decidir no primeiro minuto.',
      'causa_provavel', 'O incômodo típico é misturar gosto pessoal com papel comercial sem ter visto o processo por dentro.',
      'preocupacoes', 'Ficar só como cliente excelente quando poderia avaliar outra opção com ética também tem custo de curiosidade.',
      'consequence', 'Sem conversa, a dúvida fica em loop em vez de virar critério informado.',
      'growth_potential', 'Peça exemplos de como a equipe combina consumo, aprendizagem e convite respeitoso.',
      'dica_rapida', 'Anote o que mais te motiva no produto — vira âncora de conversa honesta.',
      'specific_actions', jsonb_build_array(
        'Use o WhatsApp e diga que quer entender o modelo sem compromisso de entrada.',
        'Peça um exemplo de primeiro mês para quem vem só do consumo.',
        'Pergunte como separam conversa de produto e convite comercial com compliance.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz transformar consumo em renda. Quero uma conversa curta com quem me enviou este link para entender se faz sentido para mim — sem pressão, só esclarecimento.'
    )
  ),
  (
    'transformar-consumo-renda',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Forte identificação com produto — perfil para explorar negócio',
      'profile_summary', 'As respostas indicam valor claro no bem-estar e abertura a monetizar com método; falta alinhar ética e expectativas com a equipe.',
      'frase_identificacao', 'Se isso descreve você, quer algo que faça sentido com você antes de convidar outras pessoas.',
      'espelho_comportamental', 'Se você sente que já tem credibilidade como usuário, o WhatsApp é o lugar certo para ver o playbook inicial.',
      'main_blocker', 'Passar de usuário a empreendedor com apoio — não improvisar mensagem nem cadência sozinho.',
      'causa_provavel', 'O desafio central é posicionamento: como falar disso com amigos sem soar forçado.',
      'preocupacoes', 'Misturar entusiasmo pessoal com o que a marca e a equipe recomendam pode gerar atrito se não houver treino.',
      'consequence', 'Sem plano com a liderança, você testa no escuro e cansa mais rápido.',
      'growth_potential', 'Fale com quem te enviou o link sobre onboarding, treino e como se duplica com integridade.',
      'dica_rapida', 'Pergunte que histórias você pode contar publicamente — compliance importa.',
      'specific_actions', jsonb_build_array(
        'Chame no WhatsApp pedindo roteiro de primeiro convite a amigos próximos.',
        'Peça materiais oficiais e exemplo de post ou mensagem aprovada.',
        'Combine check-in de 15 minutos após sua primeira semana de tentativas.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz consumo-renda; saí com forte identificação com produto. Quero falar com quem me enviou este link sobre onboarding, posicionamento e primeiro convite com ética.'
    )
  ),
  (
    'transformar-consumo-renda',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Momento de dar corpo ao projeto ligado ao que já usas',
      'profile_summary', 'Pelas respostas, há combinação de credibilidade como usuário e desejo de avançar; priorizar conversa evita começar no improviso.',
      'frase_identificacao', 'Se você se vê aqui, sente que se não for agora, adia-se outra vez.',
      'espelho_comportamental', 'Se a energia está alta, canalize no WhatsApp: quem te enviou o link segura o plano para não dispersar.',
      'main_blocker', 'Risco de começar sem estrutura; a equipe existe para evitar desgaste e mensagem confusa.',
      'causa_provavel', 'Impulso sem calendário vira picos soltos; falta um go-live mínimo combinado.',
      'preocupacoes', 'Adiar organização interna pode diluir entusiasmo em rotina sem resultado visível.',
      'consequence', 'Sem data e sem materiais, o projeto fica em modo rascunho e perde força.',
      'growth_potential', 'Peça calendário de primeiras ações e materiais oficiais com quem compartilhou o link.',
      'dica_rapida', 'Alinhe com a liderança como vai apresentar isso a amigos — tom certo protege relacionamentos.',
      'specific_actions', jsonb_build_array(
        'Mande mensagem agora pedindo data para primeiro passo e lista de materiais.',
        'Defina uma meta de 7 dias (ex.: três conversas qualificadas), não só postagem.',
        'Peça modelo de mensagem inicial para não reinventar sozinho.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz transformar consumo em renda e quero avançar já com estrutura. Quero falar com quem me enviou este link para combinar go-live, materiais e primeira semana de ação.'
    )
  ),

  (
    'jovens-empreendedores',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil jovem e curioso — explora com quem te convidou',
      'profile_summary', 'Pelas respostas, há interesse em aprender e construir algo seu, ainda colhendo informação; o dia a dia real importa mais que o feed.',
      'frase_identificacao', 'Se você se identifica, quer validar se isso combina com estudos, trabalho ou outros projetos.',
      'espelho_comportamental', 'Se você quer ver realidade antes de romantizar, uma mensagem a quem enviou o link já filtra ruído.',
      'main_blocker', 'Falta visão de tempo e prioridades — normal; resolve-se com conversa franca sobre carga horária real.',
      'causa_provavel', 'Excesso de conteúdo genérico online e pouco contato com quem executa o modelo no seu contexto.',
      'preocupacoes', 'Ficar só em vídeos e redes atrasa seu critério sem substituir uma conversa de esclarecimento.',
      'consequence', 'Sem falar com a equipe, você demora a saber se encaixa na sua rotina atual.',
      'growth_potential', 'Peça exemplos de jovens na equipe que equilibram aprendizagem e vida.',
      'dica_rapida', 'Traga uma meta de aprendizagem para 90 dias — mesmo que seja só esclarecer.',
      'specific_actions', jsonb_build_array(
        'Use o WhatsApp e diga que quer ouvir rotina real (horas, estudo, trabalho).',
        'Pergunte como é o suporte para quem está começando com pouca experiência.',
        'Combine um papo curto; se não rolar, você já filtrou sem perder semanas.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz jovens empreendedores. Quero conversar com quem me enviou este link sobre dia a dia real, horas e como encaixa com estudo/trabalho — sem pressão.'
    )
  ),
  (
    'jovens-empreendedores',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Energia para construir — bom perfil para negócio em equipe',
      'profile_summary', 'As respostas mostram iniciativa e disposição para desafio; acelera com mentoria e processo claros por trás.',
      'frase_identificacao', 'Se isso é com você, quer resultado mas precisa de estrutura para não queimar etapas.',
      'espelho_comportamental', 'Se você sente fôlego para executar, peça o mapa mínimo no WhatsApp antes de sair tentando tudo.',
      'main_blocker', 'Subestimar disciplina repetitiva no início — criatividade ajuda, mas ritual sustenta.',
      'causa_provavel', 'Falta de accountability e cadência combinada com a liderança.',
      'preocupacoes', 'Tentar reinventar o básico sozinho desgasta e mascara falta de direção.',
      'consequence', 'Sem alinhamento, você oscila entre picos de ação e queda de motivação.',
      'growth_potential', 'Converse sobre rituais de produtividade e accountability da equipe.',
      'dica_rapida', 'Comprometa horário fixo semanal de aprendizagem — mesmo três horas contam.',
      'specific_actions', jsonb_build_array(
        'Chame no WhatsApp pedindo plano de primeiras duas semanas e rituais da equipe.',
        'Peça um parceiro de accountability dentro do time, se existir.',
        'Envie sua disponibilidade real de horas — honestidade evita frustração.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz jovens empreendedores; saí com energia forte para construir. Quero alinhar mentoria, processo e cadência inicial com quem me enviou este link.'
    )
  ),
  (
    'jovens-empreendedores',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Impulso forte para empreender — conversa prioritária',
      'profile_summary', 'Pelas respostas, há ambição e disposição para mover rápido; canalizar com quem convidou evita confundir velocidade com bagunça.',
      'frase_identificacao', 'Se você se vê aqui, odeia ficar parado quando sente que há caminho.',
      'espelho_comportamental', 'Se o impulso está alto, o WhatsApp agora evita você gastar energia em frente errada.',
      'main_blocker', 'Risco de dispersão — muitas frentes sem linha de execução única.',
      'causa_provavel', 'Falta de roadmap enxuto combinado com a liderança no curto prazo.',
      'preocupacoes', 'Sem conversa estruturada, energia vira tarefas que a equipe já padronizou melhor.',
      'consequence', 'Você pode cansar antes de ver progresso mensurável.',
      'growth_potential', 'Peça roadmap de 30 dias e check-ins com quem compartilhou o link.',
      'dica_rapida', 'Consistência importa mais que picos de motivação — trate como treino.',
      'specific_actions', jsonb_build_array(
        'Mensagem no WhatsApp pedindo roadmap de 30 dias e primeira métrica simples.',
        'Peça a primeira tarefa que a equipe quer ver feita em 48 horas.',
        'Combine data de retorno para revisar o que executou.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz jovens empreendedores e quero avançar já com foco. Quero falar com quem me enviou este link para um plano enxuto de 30 dias e próximos passos imediatos.'
    )
  ),

  (
    'ja-consome-bem-estar',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Consumidor de bem-estar — explore o lado negócio com calma',
      'profile_summary', 'Pelas respostas, você valoriza nutrição e autocuidado; falta só ver se explorar o negócio conversa com seu tempo e estilo.',
      'frase_identificacao', 'Se você se identifica, gosta da experiência como cliente e ainda não sabe se quer algo mais.',
      'espelho_comportamental', 'Se você já fala de hábito com outras pessoas, o próximo passo natural é uma conversa curta no WhatsApp.',
      'main_blocker', 'Esclarecer se seu perfil e rotina permitem atividade comercial leve ou mais estruturada.',
      'causa_provavel', 'Dúvida entre continuar só consumindo bem ou testar convite com método — sem informação, fica no talvez.',
      'preocupacoes', 'A pergunta será para mim? costuma ficar em aberto até você ouvir exemplos reais.',
      'consequence', 'Sem pergunta direta, a decisão fica adiada sem critério novo.',
      'growth_potential', 'Peça conversa de esclarecimento curta — objetivo é informação, não fechar tudo no primeiro minuto.',
      'dica_rapida', 'Reflita o que te motiva a recomendar algo a amigos — já é pista de encaixe.',
      'specific_actions', jsonb_build_array(
        'Envie mensagem dizendo que quer entender se explora negócio ou segue só consumo consciente.',
        'Peça exemplo de primeiro passo para quem começa com pouco tempo.',
        'Pergunte como evitam convite chato ou invasivo com amigos.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz já consumo bem-estar. Quero uma conversa curta com quem me enviou este link para ver se faz sentido explorar o lado negócio ou seguir só consumindo com consciência.'
    )
  ),
  (
    'ja-consome-bem-estar',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Crédito como usuário — recomendação ética em equipe',
      'profile_summary', 'As respostas mostram confiança nos produtos e abertura a compartilhar com rede; método e transparência viram travas se faltarem.',
      'frase_identificacao', 'Se isso descreve você, já fala de hábitos com outras pessoas naturalmente.',
      'espelho_comportamental', 'Se você já indica o que usa, o WhatsApp é onde você pega tom e scripts que protegem relacionamento.',
      'main_blocker', 'Separar gosto pessoal de convite profissional com respeito — precisa de treino leve.',
      'causa_provavel', 'Medo de ser tímido demais ou insistente demais sem cadência definida.',
      'preocupacoes', 'Relacionamento é ativo; mensagem errada custa mais que uma conversa de alinhamento.',
      'consequence', 'Sem orientação, você testa tom no escuro e pode desanimar rápido.',
      'growth_potential', 'Converse sobre scripts éticos e formas de convite que preservam vínculo.',
      'dica_rapida', 'Pratique convite curioso em vez de pitch fechado.',
      'specific_actions', jsonb_build_array(
        'Chame no WhatsApp pedindo modelo de mensagem curta para amigos próximos.',
        'Peça checklist de compliance para posts e stories.',
        'Combine revisão de uma mensagem sua antes de enviar em massa.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz já consumo bem-estar; saí com abertura a recomendar com método. Quero aprender com quem me enviou este link tom, cadência e convite ético.'
    )
  ),
  (
    'ja-consome-bem-estar',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Alinhar paixão pelo produto com projeto de impacto e renda',
      'profile_summary', 'Pelas respostas, há entusiasmo e disposição para ir além do consumo; falta estrutura para não dispersar mensagem.',
      'frase_identificacao', 'Se você se vê aqui, sente que já é embaixador natural da categoria.',
      'espelho_comportamental', 'Se a energia está alta, não solte isso só no ar: fecha com quem enviou o link um primeiro movimento datado.',
      'main_blocker', 'Dispersar mensagem sem posicionamento claro — a equipe ajuda a definir sua linha.',
      'causa_provavel', 'Entusiasmo sem plano de primeiras conversas e sem materiais oficiais.',
      'preocupacoes', 'Adiar organização interna pode fazer o entusiasmo esfriar na rotina.',
      'consequence', 'Você perde momentum que poderia virar primeiro ciclo estruturado.',
      'growth_potential', 'Combine data para primeiro evento ou lista de contatos qualificados com a liderança.',
      'dica_rapida', 'Alinhe em uma frase o seu motivo pessoal — autenticidade convence mais que jargão.',
      'specific_actions', jsonb_build_array(
        'WhatsApp agora: peça data para primeiro movimento e materiais oficiais.',
        'Envie sua frase de motivo pessoal para revisão rápida.',
        'Peça modelo de lista de dez pessoas para conversa qualificada, não spam.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz já consumo bem-estar e quero estruturar já o movimento com apoio. Quero falar com quem me enviou este link para data, materiais e primeiro ciclo de conversas.'
    )
  ),

  (
    'trabalhar-apenas-links',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Interesse em modelo digital simples — vê se encaixa',
      'profile_summary', 'Pelas respostas, trabalhar com link e mensagens online chama atenção, mas você ainda explora; falta ver rotina real.',
      'frase_identificacao', 'Se você se identifica, quer liberdade geográfica sem entender ainda a cadência por trás.',
      'espelho_comportamental', 'Se digital para você é liberdade, confirme no WhatsApp o que isso custa em consistência semanal.',
      'main_blocker', 'Clareza sobre consistência: link sem hábito de prospecção e follow-up não vira resultado.',
      'causa_provavel', 'Expectativa romantizada de só online sem método semanal definido.',
      'preocupacoes', 'Frustração aparece quando reach não vira conversa — melhor esclarecer cedo com quem já faz.',
      'consequence', 'Sem rotina alinhada, você julga o modelo injusto antes de ter dado sequência mínima.',
      'growth_potential', 'Peça exemplos de calendário semanal de quem trabalha assim.',
      'dica_rapida', 'Defina seu melhor canal antes de pedir dicas — foco ajuda.',
      'specific_actions', jsonb_build_array(
        'Mande no WhatsApp que quer ver exemplo de semana típica de quem opera só com link.',
        'Peça cadência mínima sugerida para os primeiros 14 dias.',
        'Combine revisão de uma sequência de mensagens antes de escalar volume.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar com links. Quero falar com quem me enviou este link para entender rotina real, cadência e follow-up — e ver se faz sentido para mim.'
    )
  ),
  (
    'trabalhar-apenas-links',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil digital com foco em escala por conversa',
      'profile_summary', 'As respostas indicam conforto com ferramentas e interesse em duplicar convites; scripts e materiais poupam tempo se você alinhar.',
      'frase_identificacao', 'Se isso é você, valoriza automação leve mas sabe que relacionamento é o centro.',
      'espelho_comportamental', 'Se você já manda mensagem com facilidade, peça no WhatsApp a biblioteca e o tom que a equipe usa.',
      'main_blocker', 'Manter ritmo sem queimar audiência — cadência e tom certos precisam de referência.',
      'causa_provavel', 'Postar ou disparar sem posicionamento claro gera ruído e queda de confiança.',
      'preocupacoes', 'Credibilidade digital é fina; um excesso ou um sumiço custam caro.',
      'consequence', 'Sem orientação, você oscila entre excesso e silêncio e perde leads mornos.',
      'growth_potential', 'Converse sobre biblioteca de conteúdos e boas práticas de WhatsApp.',
      'dica_rapida', 'Teste uma semana de cadência baixa mas consistente antes de escalar volume.',
      'specific_actions', jsonb_build_array(
        'Peça no WhatsApp pack de mensagens e ordem sugerida de follow-up.',
        'Envie seu canal principal (Instagram, WhatsApp status, etc.) para receber dica específica.',
        'Marque meta de conversas qualificadas na semana, não só envios.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz links digitais; saí alinhado a escalar convites com método. Quero alinhar rotina, tom e follow-up com quem me enviou este link.'
    )
  ),
  (
    'trabalhar-apenas-links',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Pronto para executar online — prioriza conversa com a liderança',
      'profile_summary', 'Pelas respostas, há motivação forte para modelo remoto e ação rápida; alinhar evita reinventar processo que a equipe já tem.',
      'frase_identificacao', 'Se você se vê aqui, quer modo campanha, mas com norte.',
      'espelho_comportamental', 'Se você quer disparar já, primeiro combine plano no WhatsApp para não queimar lista.',
      'main_blocker', 'Improviso: mensagens sem posicionamento e sem sequência de acompanhamento.',
      'causa_provavel', 'Pressa sem combinar métrica simples e sem materiais aprovados.',
      'preocupacoes', 'Métricas de vaidade substituem conversas reais e geram desânimo.',
      'consequence', 'Sem plano combinado, esforço sobe e resultado percebido cai.',
      'growth_potential', 'Agende com quem compartilhou o link: primeira série de convites, materiais e métrica simples.',
      'dica_rapida', 'Acompanhe conversas qualificadas mais do que alcance bruto.',
      'specific_actions', jsonb_build_array(
        'WhatsApp: peça plano de primeira série de convites e materiais oficiais.',
        'Defina meta de conversas qualificadas para os próximos 7 dias.',
        'Peça revisão rápida do seu posicionamento em uma frase antes de disparar.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar com links e quero executar já com norte. Quero falar com quem me enviou este link para combinar plano, materiais e métrica de conversas qualificadas.'
    )
  ),

  (
    'querem-emagrecer-renda',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Shape na mira e curiosidade por renda — combinação que chama atenção no time',
      'profile_summary', 'Pelas respostas, dá para ver fogo no corpo e abertura para algo novo no bolso. Quem te enviou o link costuma gostar de mostrar como as duas conversas andam juntas na prática.',
      'frase_identificacao', 'Se isso é você, já pensou em ser a pessoa que inspira outras no hábito — e ainda ganhar tração com projeto por trás?',
      'espelho_comportamental', 'Se a curiosidade falou mais alto que o medo, o próximo passo é curto: uma mensagem e você vê se o jogo vale a pena para você.',
      'main_blocker', 'O que segura muita gente aqui é não ter visto por dentro como tempo, treino e primeiro movimento no negócio se encaixam numa semana real — não falta vontade.',
      'causa_provavel', 'Falta o mapa desenhado por quem já vive: onde entra produto, onde entra convite e onde entra a sua rotina.',
      'preocupacoes', 'Deixar o tema esfriar no sofá enquanto o interesse ainda está quente — aí vira só conversa de WhatsApp de grupo.',
      'consequence', 'Sem essa conversa, fica tudo bonito na cabeça e parado na gaveta.',
      'growth_potential', 'Chame quem te convidou: em poucos minutos você sente se o modelo conversa com o seu ritmo ou não.',
      'dica_rapida', 'História de processo abre porta; número milagroso fecha ou gera desconfiança — pense nisso antes de postar.',
      'specific_actions', jsonb_build_array(
        'Mande no WhatsApp: quero ver como vocês montam projeto quando a pessoa também cuida do shape.',
        'Pergunte qual seria sua primeira semana só explorando, sem pressão de decidir tudo na hora.',
        'Peça um exemplo de como alguém do time apresenta oportunidade sem misturar promessa de corpo com ganho.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz de shape + renda e fiquei curioso sobre o projeto por trás. Quero falar com quem me enviou este link para ver como encaixa na minha rotina — sem enrolação.'
    )
  ),
  (
    'querem-emagrecer-renda',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Dupla ambição: corpo em movimento e olho no crescimento',
      'profile_summary', 'As respostas mostram tração nos dois lados — você já vive a mudança e sente que tem narrativa para contar. Em time, isso costuma virar convite natural quando tem método.',
      'frase_identificacao', 'Se isso descreve você, você já percebe que credibilidade vem do que você vive, não do discurso pronto.',
      'espelho_comportamental', 'Se você sente que está na hora de monetizar a confiança que já gerou, o WhatsApp é o atalho certo — com a pessoa certa.',
      'main_blocker', 'O gargalo costuma ser transformar história vivida em convite comercial sem parecer forçado — isso se aprende em dupla com a liderança.',
      'causa_provavel', 'Falta playbook leve: o que postar primeiro, como convidar amiga próxima, como duplicar com alguém te puxando a orelha com carinho.',
      'preocupacoes', 'Postar no impulso e depois apagar por vergonha — melhor alinhar tom antes com quem já fez dezenas de vezes.',
      'consequence', 'Sem esse alinhamento, você brilha no privado e some no público — e o projeto não decola.',
      'growth_potential', 'Peça para quem te enviou o link um roteiro de primeiras três conversas e um exemplo de post que converte sem gritaria.',
      'dica_rapida', 'Quem compra confiança compra ritmo: mostre consistência, não promessa de corpo.',
      'specific_actions', jsonb_build_array(
        'Chama no WhatsApp pedindo o playbook das primeiras três conversas.',
        'Envia uma ideia de post em uma frase e pede ajuste de tom em cima dela.',
        'Marca um papo para entender como a equipe duplica gente com a sua mesma energia.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz shape + renda e saí com vontade de levar isso para frente com método. Quero falar com quem me enviou este link sobre playbook, primeiras conversas e como duplicar sem forçar barra.'
    )
  ),
  (
    'querem-emagrecer-renda',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Modo turbo: corpo e projeto — canaliza com quem já acelera no time',
      'profile_summary', 'Pelas respostas, a energia está alta nos dois eixos; o truque é não dispersar. Quem te enviou o link sabe onde aperta e onde solta para virar ação sem pirar.',
      'frase_identificacao', 'Se você se vê aqui, você quer sentir progresso na pele e ver movimento no bolso — e quer isso logo.',
      'espelho_comportamental', 'Se o coração acelerou ao ver o resultado, não deixa a noite passar: manda mensagem e pede o plano de fogo controlado.',
      'main_blocker', 'Urgência sem rota vira estresse: muita ideia, pouca prioridade — precisa de alguém da equipe para cravar a primeira sequência de ações.',
      'causa_provavel', 'Falta combinar com a liderança uma primeira semana enxuta: hábitos que você já domina + três movimentos comerciais mínimos.',
      'preocupacoes', 'Picar em tudo e não fechar nada — aí a semana passa e a sensação é de que perdeu o bonde.',
      'consequence', 'Sem direção na mesma semana, o gás vira culpa em você mesmo — e não precisa ser assim.',
      'growth_potential', 'Agenda com quem te enviou o link: combina primeira semana, primeira conversa qualificada e primeira meta que não depende de milagre.',
      'dica_rapida', 'Ritmo sustentável bate picos vazios: combina com a liderança um número pequeno de ações por dia.',
      'specific_actions', jsonb_build_array(
        'WhatsApp agora: peça plano de primeira semana com três ações comerciais mínimas.',
        'Pergunte qual é a primeira conversa que eles querem que você faça ainda esta semana.',
        'Combine check-in rápido em 48 horas para não perder o fôlego.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz shape + renda e saí no modo ação. Quero falar hoje com quem me enviou este link para cravar primeira semana, primeiras conversas e meta realista — sem enrolação.'
    )
  ),

  (
    'boas-venda-comercial',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil comercial sociável — explora duplicação em equipe',
      'profile_summary', 'Pelas respostas, você gosta de gente e conversa fluida; negócio sólido também precisa de sistema — a equipe mostra as duas faces.',
      'frase_identificacao', 'Se você se identifica, vende bem no boca a boca mas talvez falte checklist.',
      'espelho_comportamental', 'Se relacionamento é seu forte, peça no WhatsApp o follow-up mínimo que a equipe usa.',
      'main_blocker', 'Depender só de carisma sem follow-up estruturado.',
      'causa_provavel', 'Leads mornos esfriam sem ritual simples de retorno.',
      'preocupacoes', 'Perder vendas por esquecimento custa mais que um template bem usado.',
      'consequence', 'Sem CRM simples ou ritual, oportunidades somem da memória.',
      'growth_potential', 'Peça treino de follow-up e scripts éticos à equipe.',
      'dica_rapida', 'Depois de cada conversa, anote próximo passo com data — disciplina minimalista.',
      'specific_actions', jsonb_build_array(
        'Peça modelo de follow-up de 24h e de 7 dias no WhatsApp.',
        'Envie um exemplo de conversa sua para receber ajuste de tom.',
        'Combine métrica simples: quantas conversas com próximo passo esta semana?'
      ),
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
      'profile_summary', 'As respostas indicam confiança em influenciar decisões; em rede, o próximo nível é duplicar — formar outros no convite.',
      'frase_identificacao', 'Se isso é com você, talvez já cries resultado sozinho mas queira alavancar equipe.',
      'espelho_comportamental', 'Se você sente teto solo, o WhatsApp é onde você pega framework simples de mentoria.',
      'main_blocker', 'Ensinar a vender é diferente de vender — precisa de framework simples.',
      'causa_provavel', 'Falta de roteiro de onboarding para quem entra com você.',
      'preocupacoes', 'Ser estrela solo limita crescimento e aumenta cansaço.',
      'consequence', 'Sem duplicação, renda fica linear com seu tempo.',
      'growth_potential', 'Converse sobre mentoria downstream e treinos de duplicação.',
      'dica_rapida', 'Grave mini pitch de 60s e peça revisão com a liderança.',
      'specific_actions', jsonb_build_array(
        'Peça blueprint de mentoria inicial (quantos, que cadência).',
        'Envie áudio de 60s com seu pitch para feedback no WhatsApp.',
        'Alinhe primeira semana de onboarding de uma pessoa nova com ajuda da equipe.'
      ),
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
      'profile_title', 'Alavancar domínio comercial com estrutura de rede',
      'profile_summary', 'Pelas respostas, há tração interpessoal e disposição para liderar conversas; combinar dom com processo escalável é o salto.',
      'frase_identificacao', 'Se você se vê aqui, sente teto de rendimento se tudo passa só por você.',
      'espelho_comportamental', 'Se liderar conversa é fácil para você, feche no WhatsApp blueprint de liderança inicial.',
      'main_blocker', 'Sem pipeline e onboarding de novos, crescer dói.',
      'causa_provavel', 'Crescimento linear por ausência de sistema replicável.',
      'preocupacoes', 'Adiar estruturação mantém esforço alto e resultado percebido estagnado.',
      'consequence', 'Você pode confundir ocupação com alavancagem.',
      'growth_potential', 'Agende blueprint de liderança inicial: mentores, cadência, onboarding.',
      'dica_rapida', 'Documente sua melhor sequência de conversa — vira módulo replicável.',
      'specific_actions', jsonb_build_array(
        'WhatsApp: peça blueprint de liderança e onboarding para escalar.',
        'Envie descrição do seu pipeline atual em cinco linhas para diagnóstico rápido.',
        'Combine data para primeira sessão de duplicação com a equipe.'
      ),
      'cta_text', 'Quero conhecer novas oportunidades',
      'whatsapp_prefill', 'Oi! Fiz o quiz venda comercial e quero alavancar já com estrutura de rede. Quero falar com quem me enviou este link sobre blueprint de liderança e onboarding.'
    )
  );
