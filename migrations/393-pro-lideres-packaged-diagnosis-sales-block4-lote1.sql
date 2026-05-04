-- Lote 7 — Bloco 4 vendas Pro Líderes (primeiros 5 de pro-lideres-sales-block4-fluxos.ts).
-- diagnosis_vertical NULL; RISK_DIAGNOSIS; flow_id = FluxoCliente.id.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'quiz-energetico',
    'avaliacao-inicial',
    'desafio-21-dias',
    'desafio-7-dias',
    'descubra-perfil-bem-estar'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  (
    'quiz-energetico',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua energia oscila um pouco — ainda dá para estabilizar com método',
      'profile_summary', 'Pelas respostas, há trechos do dia com queda de disposição ou foco, mas o quadro ainda parece manejável com ajustes de rotina e apoio.',
      'frase_identificacao', 'Se isso combina, você provavelmente já notou horários em que “o corpo ou a cabeça desligam”.',
      'main_blocker', 'A tensão é falta de previsibilidade: energia e foco não sustentam o ritmo que sua vida pede o dia todo.',
      'consequence', 'Se vira padrão, você vive corrigindo com café, pressa ou esforço extra — em vez de ter base estável.',
      'growth_potential', 'Quem te enviou este link pode ajudar a montar plano simples — hábitos + nutrição funcional — para energia mais estável.',
      'dica_rapida', 'Sono que não recupera de verdade costuma derrubar o resto; vale encaixar isso na conversa com quem te acompanha.',
      'cta_text', 'Quero um plano para energia mais estável',
      'whatsapp_prefill', 'Oi! Fiz o quiz energético e saiu oscilação leve de energia e foco. Quero conversar com quem me enviou este link sobre o próximo passo.'
    )
  ),
  (
    'quiz-energetico',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Quedas de energia e foco já marcam seu dia com frequência',
      'profile_summary', 'Pelas respostas, disposição instável, queda forte em algum horário ou foco que some quando a rotina aperta já são recorrentes — sono pode não estar sustentando recuperação.',
      'frase_identificacao', 'Se você se identificou, talvez já antecipe horários em que o desempenho cai.',
      'main_blocker', 'O bloqueio é base frágil: você funciona, mas paga com oscilação e necessidade constante de “reativar”.',
      'consequence', 'Manter assim tende a aumentar desgaste, irritação e sensação de nunca estar no seu melhor.',
      'growth_potential', 'Conversar com quem te enviou permite priorizar sono, hidratação, ritmo alimentar e suporte diário — com critério.',
      'dica_rapida', 'Energia de verdade costuma ser sistema (sono + rotina + sustentação), não só estimulante pontual.',
      'cta_text', 'Quero recuperar energia com constância',
      'whatsapp_prefill', 'Oi! Fiz o quiz energético e o resultado mostrou quedas fortes e foco instável. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'quiz-energetico',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Seu padrão energético está no limite — conversa guiada faz diferença',
      'profile_summary', 'Pelas respostas, energia, foco e recuperação (sono) não conversam — impacto alto na forma como você aguenta o dia.',
      'frase_identificacao', 'Se isso é você, provavelmente já sentiu que “render” virou modo de sobrevivência.',
      'main_blocker', 'A tensão é alto impacto: pouca margem antes do colapso de disposição ou clareza.',
      'consequence', 'Adiar apoio prolonga ciclo de esforço máximo com retorno mínimo em bem-estar.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: plano estruturado para energia sustentável — sem promessa vazia.',
      'dica_rapida', 'Neste patamar, menos improviso e mais pilares fixos costumam virar o jogo.',
      'cta_text', 'Preciso de apoio para estabilizar energia e foco',
      'whatsapp_prefill', 'Oi! Fiz o quiz energético e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para montar um plano.'
    )
  ),

  (
    'avaliacao-inicial',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você não está longe do melhor — falta sobretudo direção e ritmo',
      'profile_summary', 'Pelas respostas, há espaço entre onde você está e onde gostaria de estar, mas ainda parece dá para começar com plano simples e realista.',
      'frase_identificacao', 'Se combina, você provavelmente já sentiu que “sabe o que fazer”, mas falta encaixar no dia.',
      'main_blocker', 'A tensão é começo sem estrutura: boa intenção sem linha de base clara vira oscilação de constância.',
      'consequence', 'Sem linha de base, cada tentativa nova parte do zero — e cansa antes de virar hábito.',
      'growth_potential', 'Quem te enviou pode ajudar a definir início guiado — poucos passos, alta chance de continuar.',
      'dica_rapida', 'Começo certo costuma ser menor do que imaginamos — mas repetido.',
      'cta_text', 'Quero começar com plano simples e realista',
      'whatsapp_prefill', 'Oi! Fiz a avaliação inicial e saiu que estou um pouco longe do meu melhor, mas com bom espaço para começar. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'avaliacao-inicial',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Rotina ainda não está pronta para evoluir — precisa de estrutura de início',
      'profile_summary', 'Pelas respostas, organizar a rotina para evoluir, manter 7 dias de consistência ou não repetir o padrão de “parar no meio” são desafios centrais.',
      'frase_identificacao', 'Se você se identificou, talvez já tenha histórico de começar forte e perder ritmo.',
      'main_blocker', 'O bloqueio é aderência: falta formato que aguente a vida real, não só motivação inicial.',
      'consequence', 'Continuar no vai-e-volta tende a aumentar frustração e sensação de que “não dá para você”.',
      'growth_potential', 'Conversar com quem te enviou ajuda a montar começo estruturado — metas curtas, acompanhamento, clareza.',
      'dica_rapida', 'Quando já tentou antes e parou, o foco raramente é “mais força” — é desenho do plano.',
      'cta_text', 'Quero começar certo desta vez',
      'whatsapp_prefill', 'Oi! Fiz a avaliação inicial e o resultado mostrou que perco ritmo e preciso de início mais estruturado. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'avaliacao-inicial',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você está longe do seu melhor — hora de linha de base e apoio firme',
      'profile_summary', 'Pelas respostas, distância do ideal, rotina desorganizada para evoluir e histórico de perder o fio indicam necessidade forte de começo guiado — não mais tentativa solta.',
      'frase_identificacao', 'Se isso é você, provavelmente já sentiu cansaço de recomeçar do zero.',
      'main_blocker', 'A tensão é alto risco de abandonar no meio: falta sistema que segure quando a motivação cai.',
      'consequence', 'Adiar estrutura prolonga sensação de estagnação e autocobrança sem resultado proporcional.',
      'growth_potential', 'Fala com quem te enviou: desenhe começo mínimo viável com acompanhamento — direção clara desde o dia 1.',
      'dica_rapida', 'Neste patamar, um bom início vale mais que um plano “perfeito” no papel.',
      'cta_text', 'Preciso de um começo guiado com quem me enviou',
      'whatsapp_prefill', 'Oi! Fiz a avaliação inicial e o resultado ficou bem forte: preciso de linha de base e plano realista. Quero conversar com quem me enviou este link.'
    )
  ),

  (
    'desafio-21-dias',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você tem espaço para um ciclo de 21 dias — com apoio certo',
      'profile_summary', 'Pelas respostas, consegue reservar alguns minutos, há apoio ou abertura para protocolo simples — prontidão moderada para desafio de consistência.',
      'frase_identificacao', 'Se combina, você provavelmente busca estrutura sem sentir que precisa de radicalismo.',
      'main_blocker', 'A tensão é transformar intenção em 3 semanas reais: o calendário precisa conversar com o compromisso.',
      'consequence', 'Se não fecha o ciclo, fica a sensação de “quase fui consistente” — e perde a prova de que consegue.',
      'growth_potential', 'Quem te enviou pode encaixar desafio com metas claras e acompanhamento — formato Pro Líderes, conversa contínua.',
      'dica_rapida', '21 dias funcionam quando o protocolo é simples o suficiente para repetir cansado.',
      'cta_text', 'Quero saber como entrar no desafio de 21 dias',
      'whatsapp_prefill', 'Oi! Fiz o quiz do desafio 21 dias e fiquei com boa prontidão para um ciclo guiado. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'desafio-21-dias',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Desafio de 21 dias pede apoio e protocolo — você está no meio termo',
      'profile_summary', 'Pelas respostas, tempo diário ou apoio para três semanas ainda oscila; já tentou formato de desafio ou precisa de compromisso claro com protocolo.',
      'frase_identificacao', 'Se você se identificou, talvez tema “falhar no meio” já tenha aparecido antes.',
      'main_blocker', 'O bloqueio é aderência em janela longa: a vida aperta e o protocolo é a primeira coisa a sair.',
      'consequence', 'Sem ajuste, ciclo longo vira culpa em vez de resultado.',
      'growth_potential', 'Conversar com quem te enviou permite calibrar desafio realista — o que cabe na tua semana, com checkpoint.',
      'dica_rapida', 'Desafio bom é desafio que você aceita sabendo onde vai falhar cedo — e já tem plano B.',
      'cta_text', 'Quero entrar no desafio com plano que caiba na minha vida',
      'whatsapp_prefill', 'Oi! Fiz o quiz desafio 21 dias e o resultado mostrou que preciso de apoio e protocolo claro. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'desafio-21-dias',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Três semanas de consistência vão exigir estrutura forte — fala com quem te enviou',
      'profile_summary', 'Pelas respostas, margem para minutos diários, apoio ou disciplina com protocolo está apertada — ou histórico de não segurar ciclos longos é forte.',
      'frase_identificacao', 'Se isso é você, um desafio de 21 dias só funciona com desenho muito claro e companhia.',
      'main_blocker', 'A tensão é risco alto de abandono: compromisso grande sem sistema vira frustração.',
      'consequence', 'Entrar “no impulso” sem plano pode reforçar narrativa de que constância “não é para você”.',
      'growth_potential', 'O melhor passo é conversar com quem te enviou: talvez começar menor ou com fases — antes de assumir 21 dias cheios.',
      'dica_rapida', 'Neste patamar, às vezes 7 dias bem fechados precedem 21 — a conversa define o formato certo.',
      'cta_text', 'Quero alinhar o desafio com apoio antes de começar',
      'whatsapp_prefill', 'Oi! Fiz o quiz desafio 21 dias e o resultado ficou intenso — preciso de estrutura firme. Quero conversar com quem me enviou este link.'
    )
  ),

  (
    'desafio-7-dias',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil bom para um sprint de 7 dias — tração sem fricção',
      'profile_summary', 'Pelas respostas, você prefere ciclos curtos, consegue 7 dias com orientações simples e quer resultado rápido para motivar continuidade.',
      'frase_identificacao', 'Se combina, você provavelmente rende melhor com “semana 1” clara do que com plano infinito.',
      'main_blocker', 'A tensão é não transformar sprint em fogo de palha: sete dias precisam virar ponte para o próximo passo.',
      'consequence', 'Se passa sem continuidade, ganha confiança pontual mas não sistema.',
      'growth_potential', 'Quem te enviou pode montar plano de baixa fricção — 7 dias com meta explícita e o que vem depois.',
      'dica_rapida', 'Vitória rápida funciona quando o dia 8 já está nomeado — não “veremos”.',
      'cta_text', 'Quero iniciar meus 7 dias com orientação',
      'whatsapp_prefill', 'Oi! Fiz o quiz desafio 7 dias e saiu perfil ideal para sprint curto. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'desafio-7-dias',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sete dias exigem disciplina — você está no limiar entre tração e oscilação',
      'profile_summary', 'Pelas respostas, gosta de ciclos curtos, mas manter disciplina uma semana inteira ou seguir orientações sem pegar pesado ainda é um desafio.',
      'frase_identificacao', 'Se você se identificou, talvez precise de formato ainda mais simples do que imagina.',
      'main_blocker', 'O bloqueio é atrito: o plano precisa ser tão leve que não dependa de dia “perfeito”.',
      'consequence', 'Se a semana falha, culpa vem rápido — melhor calibrar antes com quem te acompanha.',
      'growth_potential', 'Conversar com quem te enviou ajuda a definir o mínimo inegociável dos 7 dias — o resto é bônus.',
      'dica_rapida', 'Uma semana boa costuma ter uma única prioridade visível — não cinco.',
      'cta_text', 'Quero um plano de 7 dias que eu consiga cumprir',
      'whatsapp_prefill', 'Oi! Fiz o quiz desafio 7 dias e o resultado mostrou que preciso de baixa fricção e apoio. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'desafio-7-dias',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sprint de 7 dias vai precisar de desenho muito claro — conversa antes de largar',
      'profile_summary', 'Pelas respostas, disciplina curta, adesão a orientações ou motivação por resultado rápido estão frágeis — risco de não fechar a semana com sensação de vitória.',
      'frase_identificacao', 'Se isso é você, forçar sprint sem apoio pode reforçar desânimo.',
      'main_blocker', 'A tensão é compromisso que excede capacidade atual — precisa de versão menor, não de mais pressão.',
      'consequence', 'Falhar um bloco de 7 dias pode virar prova errada sobre sua capacidade.',
      'growth_potential', 'Fala com quem te enviou: talvez reduzir escopo ou dividir em microblocos — mesmo espírito de tração, menos risco.',
      'dica_rapida', 'Neste patamar, vitória pequena batida > promessa grande quebrada.',
      'cta_text', 'Quero ajustar meu sprint de 7 dias com apoio',
      'whatsapp_prefill', 'Oi! Fiz o quiz desafio 7 dias e o resultado ficou bem intenso na aderência. Quero conversar com quem me enviou este link para definir o formato.'
    )
  ),

  (
    'descubra-perfil-bem-estar',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Seu perfil de bem-estar está tomando forma — falta prioridade nítida',
      'profile_summary', 'Pelas respostas, bem-estar oscila na semana, mas há base; você pode não saber qual hábito move mais agulha — ainda em patamar de clarificar.',
      'frase_identificacao', 'Se combina, você provavelmente tenta melhorar “tudo um pouco” e sente pouca alavanca.',
      'main_blocker', 'A tensão é dispersão: energia investida em muitas frentes sem ordem de impacto.',
      'consequence', 'Sem prioridade, consistência parece esforço alto com retorno baixo.',
      'growth_potential', 'Quem te enviou pode ajudar a nomear seu perfil e primeira alavanca — plano que respeita quem você é.',
      'dica_rapida', 'Um hábito âncora costuma puxar os outros mais que lista de dez metas.',
      'cta_text', 'Quero entender meu perfil e priorizar',
      'whatsapp_prefill', 'Oi! Fiz o quiz descubra seu perfil de bem-estar e saiu que preciso priorizar melhor. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'descubra-perfil-bem-estar',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Bem-estar oscila forte — perfil ainda “em construção”',
      'profile_summary', 'Pelas respostas, sono, alimentação e energia não estão alinhados; falta clareza do hábito de maior impacto; pequenas rotinas oscilam em consistência.',
      'frase_identificacao', 'Se você se identificou, talvez sinta que “uma semana vai bem, outra não”.',
      'main_blocker', 'O bloqueio é falta de mapa: você reage ao mal-estar sem sequência estratégica.',
      'consequence', 'Continuar assim tende a aumentar sensação de imprevisibilidade com o próprio corpo.',
      'growth_potential', 'Conversar com quem te enviou permite montar plano por perfil — prioridades, ritmo, acompanhamento.',
      'dica_rapida', 'Alinhar pilares (sono, água, refeição, movimento leve) em ordem certa costuma destravar o resto.',
      'cta_text', 'Quero plano alinhado ao meu perfil',
      'whatsapp_prefill', 'Oi! Fiz o quiz de perfil de bem-estar e o resultado mostrou oscilação e falta de prioridade clara. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'descubra-perfil-bem-estar',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil de bem-estar precisa de direção — não mais improviso',
      'profile_summary', 'Pelas respostas, variação de bem-estar, desalinhamento entre sono, comida e energia, e dificuldade de manter rotinas mínimas têm impacto alto.',
      'frase_identificacao', 'Se isso é você, provavelmente já sentiu que vive apagando incêndio no próprio corpo.',
      'main_blocker', 'A tensão é alto impacto sem norte: cada dia exige decisão nova sem sistema.',
      'consequence', 'Adiar mapeamento de perfil prolonga exaustão e sensação de estar sempre recomeçando.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: diagnóstico de perfil em linguagem prática + plano por fases.',
      'dica_rapida', 'Neste patamar, menos tentativa aleatória e mais conversa guiada — você precisa de espinha dorsal de hábitos.',
      'cta_text', 'Preciso de direção clara para o meu bem-estar',
      'whatsapp_prefill', 'Oi! Fiz o quiz descubra seu perfil de bem-estar e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para montar o plano.'
    )
  );
