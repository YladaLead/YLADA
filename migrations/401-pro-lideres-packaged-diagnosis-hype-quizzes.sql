-- Migration 401 — Hype Quizzes Pro Líderes: energia-foco, pre-treino, rotina-produtiva, constancia
-- diagnosis_vertical NULL; RISK_DIAGNOSIS; flow_id = FluxoCliente.id (hype quiz presets).
-- Todos usam o questionário unificado HYPE (5 perguntas: queda de energia, estratégia, café, foco, atividade física).

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'energia-foco',
    'pre-treino',
    'rotina-produtiva',
    'constancia'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES

-- ── energia-foco ──────────────────────────────────────────────────────────────
  (
    'energia-foco',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua energia e foco oscilam — mas o padrão dá para ajustar',
      'profile_summary', 'Tem horário no dia em que o ritmo cai, o foco escapa ou a cabeça pede pausa. Ainda não comprometeu tudo, mas o sinal está lá.',
      'frase_identificacao', 'Você provavelmente já anotou mentalmente o horário em que seu desempenho cai.',
      'main_blocker', 'O que te trava: rotina sem suporte nos momentos de queda — você aguenta, mas gasta mais reserva do que deveria.',
      'consequence', 'No médio prazo, compensar com café ou força de vontade vai cobrando juros na concentração e no humor.',
      'growth_potential', 'Quem te enviou o quiz pode ajudar a montar estratégia simples para sustentar energia e foco no horário certo.',
      'dica_rapida', 'Hidratação e um intervalo ativo de 5 minutos no horário de queda costumam fazer diferença antes de qualquer suplemento.',
      'cta_text', 'Quero entender meu padrão de energia',
      'whatsapp_prefill', 'Oi! Fiz o quiz Energia & Foco e saiu oscilação leve. Quero conversar com quem me enviou o link sobre próximos passos.'
    )
  ),
  (
    'energia-foco',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Quedas de energia e foco já cobram um preço real no seu dia',
      'profile_summary', 'As respostas mostram um padrão consistente: disposição que vai embora no meio do dia, foco que some quando mais precisaria e estratégia de compensação que virou dependência.',
      'frase_identificacao', 'Você provavelmente já está acostumado a empurrar com café o que deveria ter naturalmente.',
      'main_blocker', 'O que pesa: base energética fraca — funciona, mas no limite, e a recuperação não acompanha o ritmo exigido.',
      'consequence', 'Manter esse padrão desgasta: rende menos, irrita mais e a sensação de estar sempre devendo ao próprio desempenho só aumenta.',
      'growth_potential', 'Quem te enviou o quiz pode montar com você um plano de energia mais estável — hidratação, ritmo alimentar e suporte real para o dia.',
      'dica_rapida', 'Foco que cai rápido quase sempre tem raiz em sono ou hidratação mal resolvidos — vale levantar isso na conversa.',
      'cta_text', 'Quero recuperar energia com constância',
      'whatsapp_prefill', 'Oi! Fiz o quiz Energia & Foco e o resultado mostrou quedas frequentes de foco e energia. Quero conversar com quem me enviou o link.'
    )
  ),
  (
    'energia-foco',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Energia e foco estão no limite — seu corpo está pedindo estrutura',
      'profile_summary', 'O quiz mostra um dia pesado: energia baixa boa parte do tempo, foco muito difícil de manter e estratégia de compensação que já não resolve. Isso tem nome: sobrecarga sem base.',
      'frase_identificacao', 'Você provavelmente já passou por dias em que só conseguiu "existir" — sem energia para entregar o que queria.',
      'main_blocker', 'O que te segura: falta de estrutura básica — sem sono, hidratação e ritmo alinhados, qualquer esforço custa mais do que deveria.',
      'consequence', 'Adiar esse apoio prolonga o ciclo: o cansaço acumula, o rendimento cai em bola de neve e a motivação vai junto.',
      'growth_potential', 'O melhor movimento agora é falar com quem te enviou o quiz — tem um plano para estabilizar energia sem depender só de vontade.',
      'dica_rapida', 'Neste nível, estruturas fixas simples (horário de dormir, água antes do café) costumam virar o jogo antes de qualquer ajuste maior.',
      'cta_text', 'Preciso de apoio para estabilizar energia e foco',
      'whatsapp_prefill', 'Oi! Fiz o quiz Energia & Foco e o resultado foi bem intenso. Quero conversar com quem me enviou o link para montar um plano de energia e foco.'
    )
  ),

-- ── pre-treino ────────────────────────────────────────────────────────────────
  (
    'pre-treino',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você treina — mas o suporte antes do treino pode ser bem melhor',
      'profile_summary', 'As respostas indicam atividade física presente e energia que sustenta minimamente a rotina. O espaço para evoluir está no que acontece antes de você entrar em movimento.',
      'frase_identificacao', 'Você provavelmente já percebeu que alguns treinos rendem mais do que outros sem saber exatamente por quê.',
      'main_blocker', 'O que te trava: ausência de preparo intencional — você chega ao treino com o que sobrou do dia.',
      'consequence', 'Sem suporte pré-treino, o rendimento oscila, a recuperação é mais lenta e você não aproveita o esforço que coloca.',
      'growth_potential', 'Quem te enviou o quiz pode indicar o que faz sentido para o seu perfil antes de treinar — simples e ajustado à sua rotina.',
      'dica_rapida', 'Hidratação e uma fonte leve de energia 30 a 60 min antes do treino já mudam o rendimento de boa parte das pessoas.',
      'cta_text', 'Quero otimizar meu pré-treino',
      'whatsapp_prefill', 'Oi! Fiz o quiz Pré-Treino e saiu que ainda dá para melhorar bastante o suporte antes do treino. Quero saber mais com quem me enviou o link.'
    )
  ),
  (
    'pre-treino',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você treina, mas a energia não está ajudando como deveria',
      'profile_summary', 'O quiz mostra que a prática existe, mas a energia que chega ao treino é irregular — e isso vai direto no rendimento, na motivação e na recuperação depois.',
      'frase_identificacao', 'Você provavelmente já ficou na metade do treino sem gás, ou precisou de muito café para conseguir entrar na academia.',
      'main_blocker', 'O que pesa: rotina energética desequilibrada — o treino concorre com o cansaço do dia em vez de ter base própria.',
      'consequence', 'Treinar nesse padrão aumenta risco de desânimo, lesão por fadiga e abandono de rotina — mesmo com boa intenção.',
      'growth_potential', 'Quem te enviou o quiz pode ajudar a construir suporte pré-treino que funcione para o seu horário e nível de energia.',
      'dica_rapida', 'Mudar o horário do treino para o pico de energia do dia já ajuda muito antes de qualquer outro ajuste.',
      'cta_text', 'Quero treinar com mais energia e menos esforço',
      'whatsapp_prefill', 'Oi! Fiz o quiz Pré-Treino e o resultado mostrou que minha energia não tá ajudando os treinos. Quero conversar com quem me enviou o link.'
    )
  ),
  (
    'pre-treino',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Treino sem energia de verdade — o suporte faz toda a diferença agora',
      'profile_summary', 'As respostas mostram energia baixa, foco difícil e rotina que não sustenta o treino como deveria. Você pode estar se esforçando mais do que o necessário para resultados menores do que merece.',
      'frase_identificacao', 'Você provavelmente já cogitou desistir da rotina de exercícios porque o corpo simplesmente não responde.',
      'main_blocker', 'O que te segura: falta de base — sem energia, hidratação e ritmo alinhados, qualquer treino começa no negativo.',
      'consequence', 'Seguir treinando sem suporte adequado aumenta o risco de abandono, desmotivação e lesão por esforço sem recuperação.',
      'growth_potential', 'O melhor passo é falar com quem te enviou o quiz — tem como montar suporte real para antes, durante e depois do treino.',
      'dica_rapida', 'Antes de mudar o treino, vale ajustar o que vem antes dele. A conversa com quem te acompanha é o caminho mais rápido.',
      'cta_text', 'Quero apoio para treinar de verdade',
      'whatsapp_prefill', 'Oi! Fiz o quiz Pré-Treino e o resultado foi bem pesado. Minha energia não sustenta os treinos. Quero falar com quem me enviou o link.'
    )
  ),

-- ── rotina-produtiva ──────────────────────────────────────────────────────────
  (
    'rotina-produtiva',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua rotina tem ritmo — mas perde energia em horários previsíveis',
      'profile_summary', 'O quiz indica base funcional de produtividade, com buracos de foco ou energia que aparecem no mesmo horário. Ainda não comprometeu o essencial, mas já dá para resolver.',
      'frase_identificacao', 'Você provavelmente já mapeou mentalmente os momentos em que o motor trava sem explicação óbvia.',
      'main_blocker', 'O que te trava: rotina sem suporte nos picos de demanda — você rende, mas gasta reserva que poderia guardar.',
      'consequence', 'Com o tempo, compensar essa oscilação vira hábito de esforço excessivo — e cansa antes do necessário.',
      'growth_potential', 'Quem te enviou o quiz pode ajudar a identificar o que está drenando energia na sua rotina e como estabilizar sem mudar tudo.',
      'dica_rapida', 'Pausa ativa de 10 minutos no horário de queda vale mais do que empurrar na adrenalina — experimenta antes da próxima conversa.',
      'cta_text', 'Quero entender onde minha rotina perde energia',
      'whatsapp_prefill', 'Oi! Fiz o quiz Rotina Produtiva e saiu que tenho picos e vales de energia ao longo do dia. Quero conversar com quem me enviou o link.'
    )
  ),
  (
    'rotina-produtiva',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Produtividade instável já está atrapalhando o que você quer entregar',
      'profile_summary', 'As respostas mostram rotina com buracos reais: foco que cai no meio das tarefas, energia que não sustenta o ritmo exigido e compensação frequente com café ou esforço forçado.',
      'frase_identificacao', 'Você provavelmente já terminou um dia "ocupado" com a sensação de que não entregou o que queria.',
      'main_blocker', 'O que pesa: base energética que não acompanha a demanda — a rotina existe, mas funciona no limite.',
      'consequence', 'Manter esse padrão aumenta desgaste, diminui qualidade do que é entregue e vai corroendo a motivação com o tempo.',
      'growth_potential', 'Quem te enviou o quiz tem como ajudar a estruturar rotina com mais base — energia, ritmo e suporte nos momentos certos.',
      'dica_rapida', 'Foco que oscila muito costuma ter raiz em hidratação insuficiente ou picos de açúcar — simples de ajustar com orientação certa.',
      'cta_text', 'Quero uma rotina com mais energia e foco de verdade',
      'whatsapp_prefill', 'Oi! Fiz o quiz Rotina Produtiva e o resultado mostrou instabilidade real de foco e energia. Quero conversar com quem me enviou o link.'
    )
  ),
  (
    'rotina-produtiva',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua rotina está no limite — energia e foco não sustentam o que você precisa',
      'profile_summary', 'O quiz mostra um padrão pesado: energia baixa, foco muito difícil de manter e rotina que se apoia mais em força de vontade do que em base real. Isso cobra um preço alto.',
      'frase_identificacao', 'Você provavelmente já sentiu que cada dia exige mais do que você tem disponível — e isso vai acumulando.',
      'main_blocker', 'O que te segura: ausência de base funcional — sem energia, foco e recuperação alinhados, qualquer tarefa custa mais do que deveria.',
      'consequence', 'Adiar esse ajuste prolonga o ciclo: o rendimento cai, a qualidade de vida vai junto e o esforço aumenta sem retorno proporcional.',
      'growth_potential', 'O melhor passo agora é falar com quem te enviou o quiz — tem como montar plano real de rotina sustentável.',
      'dica_rapida', 'Nesse nível, estrutura mínima (sono fixo, água ao acordar, pausa no almoço) costuma mudar bastante antes de qualquer suplemento.',
      'cta_text', 'Preciso de apoio para ter uma rotina com base real',
      'whatsapp_prefill', 'Oi! Fiz o quiz Rotina Produtiva e o resultado foi bem intenso. Energia e foco não estão sustentando minha rotina. Quero conversar com quem me enviou o link.'
    )
  ),

-- ── constancia ────────────────────────────────────────────────────────────────
  (
    'constancia',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você começa bem — o desafio é sustentar sem depender de motivação',
      'profile_summary', 'O quiz indica intenção e capacidade, mas a constância ainda esbarra em energia, horários ou falta de estrutura que sustente o hábito sem depender do dia perfeito.',
      'frase_identificacao', 'Você provavelmente já percebeu que funciona bem quando está motivado — e trava quando a rotina aperta.',
      'main_blocker', 'O que te trava: hábito que depende de condições ideais — um dia ruim basta para quebrar o ritmo.',
      'consequence', 'Sem estrutura que funcione nos dias comuns, cada recomeço parte do zero e o desgaste acumula.',
      'growth_potential', 'Quem te enviou o quiz pode ajudar a criar âncoras simples que mantêm o hábito mesmo nos dias difíceis.',
      'dica_rapida', 'Constância se constrói com a versão mínima do hábito — não com o dia perfeito. Vale conversar sobre isso com quem te acompanha.',
      'cta_text', 'Quero construir constância de verdade',
      'whatsapp_prefill', 'Oi! Fiz o quiz Constância & Rotina e saiu que tenho base mas travo na sustentação. Quero conversar com quem me enviou o link.'
    )
  ),
  (
    'constancia',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você inicia bem — mas manter o ritmo é onde o hábito quebra',
      'profile_summary', 'As respostas mostram um padrão de começos fortes e pausas frequentes — energia instável, foco que cai e rotina que não segura o hábito quando a vida complica.',
      'frase_identificacao', 'Você provavelmente já tentou mais de uma vez criar rotina consistente e ficou preso no mesmo ponto.',
      'main_blocker', 'O que pesa: ciclo de iniciativa e pausa — sem suporte que atravesse os dias difíceis, o hábito nunca vira automático.',
      'consequence', 'Repetir esse ciclo aumenta a sensação de que não é para você — quando, na verdade, o que falta é estrutura, não força de vontade.',
      'growth_potential', 'Quem te enviou o quiz pode ajudar a identificar onde o hábito quebra e montar suporte para atravessar essa barreira.',
      'dica_rapida', 'O hábito que sobrevive não é o mais ambicioso — é o mais simples de repetir. Conversar sobre isso já muda o jogo.',
      'cta_text', 'Quero entender por que não consigo manter a constância',
      'whatsapp_prefill', 'Oi! Fiz o quiz Constância & Rotina e o resultado mostrou que inicio mas não mantenho. Quero conversar com quem me enviou o link.'
    )
  ),
  (
    'constancia',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Constância travada — cada tentativa está custando mais do que deveria',
      'profile_summary', 'O quiz mostra muitas tentativas, pouca sustentação e energia que não suporta o hábito. Você está colocando esforço real, mas sem a base que faz o hábito ficar.',
      'frase_identificacao', 'Você provavelmente já chegou a um ponto onde desistir pareceu a opção mais racional — e isso diz mais sobre a falta de suporte do que sobre você.',
      'main_blocker', 'O que te segura: ausência de base que sustente a constância — sem energia estável e estrutura mínima, qualquer hábito é frágil.',
      'consequence', 'Cada ciclo de tentativa e abandono sem apoio aumenta a convicção de que não vai funcionar — e essa é a maior barreira real.',
      'growth_potential', 'O melhor passo é falar com quem te enviou o quiz — existe forma de construir constância com apoio e sem depender de motivação diária.',
      'dica_rapida', 'Nesse ponto, o problema não é força de vontade — é estrutura. Conversa com quem pode ajudar a montar essa estrutura.',
      'cta_text', 'Quero apoio para criar constância de verdade',
      'whatsapp_prefill', 'Oi! Fiz o quiz Constância & Rotina e o resultado foi bem pesado. Não consigo manter hábitos. Quero conversar com quem me enviou o link para montar um plano.'
    )
  );
