-- Lote 5 — Bloco 3 vendas Pro Líderes (primeiros 5 de pro-lideres-sales-block3-fluxos.ts).
-- 5 fluxos × RISK_DIAGNOSIS × leve|moderado|urgente. diagnosis_vertical NULL. flow_id = FluxoCliente.id.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'retencao-liquidos',
    'conhece-seu-corpo',
    'disciplinado-emocional-comida',
    'nutrido-vs-alimentado',
    'alimentacao-rotina'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  -- --- Teste de retenção de líquidos ---
  (
    'retencao-liquidos',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sinais leves de retenção — bom momento para ajustar rotina',
      'profile_summary', 'Pelas respostas, inchaço ou sensação de peso aparecem pontualmente, mas ainda num patamar que parece manejável com hábitos e apoio simples.',
      'frase_identificacao', 'Se isso combina, você provavelmente já notou dias em que o corpo “segura” mais líquido ou pressão.',
      'main_blocker', 'A tensão é oscilar entre conforto e incômodo ao longo do dia — sem um padrão claro de sustentação (água, ritmo, refeições).',
      'consequence', 'Se vira rotina, pequenos inchados roubam leveza e disposição sem você perceber o quanto isso pesa no humor.',
      'growth_potential', 'Quem te enviou este link pode ajudar a montar plano simples de leveza e rotina — conversa curta, próximo passo prático.',
      'dica_rapida', 'Retenção perceptível costuma melhorar com consistência de hidratação e ritmo — calibrado com quem te acompanha.',
      'cta_text', 'Quero conversar sobre leveza e rotina',
      'whatsapp_prefill', 'Oi! Fiz o teste de retenção de líquidos e saiu um padrão leve. Quero falar com quem me enviou este link sobre o próximo passo.'
    )
  ),
  (
    'retencao-liquidos',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Retenção ou inchaço já incomoda com frequência',
      'profile_summary', 'Pelas respostas, sinais de retenção (fim do dia, ao acordar ou após refeições mais pesadas) já aparecem de forma recorrente.',
      'frase_identificacao', 'Se você se identificou, talvez já adapte o dia tentando “esconder” o incômodo em vez de endereçar a causa.',
      'main_blocker', 'O bloqueio é falta de estratégia estável: o corpo reage ao ritmo, mas você ainda não tem um encaixe claro de hábitos.',
      'consequence', 'Continuar sem plano tende a manter o ciclo e aumentar frustração com sensação de corpo pesado.',
      'growth_potential', 'Conversar com quem te enviou abre espaço para nutrição funcional e rotina focados em conforto — sem promessa mágica.',
      'dica_rapida', 'Quando inchaço vem e vai, o foco costuma ser o que você repete todos os dias, não só o que come “às vezes”.',
      'cta_text', 'Quero um plano para reduzir esse desconforto',
      'whatsapp_prefill', 'Oi! Fiz o teste de retenção de líquidos e o resultado mostrou incômodo frequente. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'retencao-liquidos',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sinais fortes de retenção — vale conversar com quem te acompanha',
      'profile_summary', 'Pelas respostas, o impacto da sensação de inchaço ou retenção é alto e recorrente — com interferência clara no conforto e na disposição.',
      'frase_identificacao', 'Se isso é você, o tema já ocupa espaço real no seu dia a dia.',
      'main_blocker', 'A tensão é corpo que não “assenta”: leveza rara, desconforto frequente, sensação de peso que puxa energia para baixo.',
      'consequence', 'Adiar orientação costuma prolongar o ciclo e aumentar desgaste com o próprio corpo.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: próximo passo com hábitos e nutrição funcional voltados a leveza — sempre no tom de bem-estar.',
      'dica_rapida', 'Neste patamar, direção clara importa mais que tentar adivinhar sozinho no improviso.',
      'cta_text', 'Preciso de apoio para melhorar essa retenção',
      'whatsapp_prefill', 'Oi! Fiz o teste de retenção de líquidos e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para montar um plano.'
    )
  ),

  -- --- Você conhece o seu corpo? ---
  (
    'conhece-seu-corpo',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você já lê o corpo — mas ainda há espaço para mais clareza',
      'profile_summary', 'Pelas respostas, você enxerga parte da resposta do corpo à rotina, mas ainda falta previsibilidade sobre cansaço, energia e prioridades.',
      'frase_identificacao', 'Se faz sentido, você talvez já sinta que “vai sentindo”, sem saber sempre o que ajustar primeiro.',
      'main_blocker', 'A tensão é decisão no improviso: pequenos sinais existem, mas não viram mapa simples do que mudar.',
      'consequence', 'Sem clareza, constância oscila — você testa coisas, mas falta eixo para manter o que funciona.',
      'growth_potential', 'Quem te enviou pode ajudar a traduzir sinais em plano prático — nutrição e hábitos alinhados à tua realidade.',
      'dica_rapida', 'Corpo que responde bem costuma ser corpo que tem rotina previsível; clareza acelera isso.',
      'cta_text', 'Quero mais clareza sobre o que ajustar',
      'whatsapp_prefill', 'Oi! Fiz o quiz “você conhece o seu corpo?” e saiu que tenho clareza parcial. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'conhece-seu-corpo',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Baixa previsibilidade — seu corpo pede um mapa mais claro',
      'profile_summary', 'Pelas respostas, fica difícil prever energia, identificar gatilhos de cansaço ou saber se alimentação acompanha o ritmo — há lacunas de leitura corporal.',
      'frase_identificacao', 'Se você se identificou, provavelmente já se pegou pensando “por que hoje foi diferente?”.',
      'main_blocker', 'O bloqueio é oscilar entre tentativa e dúvida: falta um eixo simples do que priorizar na rotina.',
      'consequence', 'Manter assim tende a gerar esforço repetido sem resultado proporcional — e sensação de estar sempre “apagando incêndio”.',
      'growth_potential', 'Conversar com quem te enviou ajuda a montar prioridades reais (sono, água, refeições, picos de energia) com linguagem aplicável.',
      'dica_rapida', 'Quando não dá para prever o dia, o próximo passo costuma ser poucos indicadores fixos — não dez metas de uma vez.',
      'cta_text', 'Quero um plano mais assertivo para mim',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre conhecer o corpo e o resultado mostrou que preciso de mais clareza. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'conhece-seu-corpo',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Corpo “imprevisível” — hora de conversa guiada com apoio',
      'profile_summary', 'Pelas respostas, a falta de leitura clara do corpo (energia, cansaço, rotina) é forte — com impacto direto nas suas decisões diárias.',
      'frase_identificacao', 'Se isso é você, talvez já sinta que está reagindo ao corpo em vez de conduzir a rotina com segurança.',
      'main_blocker', 'A tensão é decisão sem bússola: você não confia de forma estável em como vai se sentir amanhã ou depois do almoço.',
      'consequence', 'Adiar apoio prolonga a sensação de estar “no escuro” sobre o que funciona para o seu caso.',
      'growth_potential', 'Fala com quem te enviou: dá para estruturar conversa e plano simples para ganhar previsibilidade — sem complicar demais.',
      'dica_rapida', 'Neste patamar, menos tentativa aleatória e mais direção costuma desbloquear resultado.',
      'cta_text', 'Preciso de ajuda para entender meu corpo na prática',
      'whatsapp_prefill', 'Oi! Fiz o quiz “você conhece o seu corpo?” e o resultado ficou bem forte na falta de clareza. Quero conversar com quem me enviou este link.'
    )
  ),

  -- --- Disciplinado ou emocional com a comida ---
  (
    'disciplinado-emocional-comida',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Seu padrão com comida ainda equilibra razão e emoção — com pequenos desvios',
      'profile_summary', 'Pelas respostas, stress ou momento emocional às vezes puxa a escolha alimentar, mas ainda num nível que parece dá para ajustar com método leve.',
      'frase_identificacao', 'Se combina, você provavelmente já notou dias em que come “por nervoso” ou compensa com doce.',
      'main_blocker', 'A tensão é oscilar entre plano e impulso: dá para manter disciplina, mas o emocional entra e quebra o ritmo em alguns momentos.',
      'consequence', 'Se o padrão cresce, culpa e compensação podem virar ciclo — mesmo quando você sabe o que “deveria” fazer.',
      'growth_potential', 'Quem te enviou pode ajudar com estratégia sem rigidez tóxica — equilíbrio prático entre estrutura e vida real.',
      'dica_rapida', 'Controle sustentável costuma nascer de energia estável + rotina previsível, não só de força de vontade.',
      'cta_text', 'Quero mais equilíbrio nas escolhas com comida',
      'whatsapp_prefill', 'Oi! Fiz o quiz disciplinado vs emocional com a comida e saiu um padrão leve de oscilação. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'disciplinado-emocional-comida',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Emoção já manda bastante nas suas escolhas alimentares',
      'profile_summary', 'Pelas respostas, stress altera o padrão de comer, há episódios de compensação ou dificuldade de manter plano sem extremos — predomínio emocional mais claro.',
      'frase_identificacao', 'Se você se identificou, talvez já sinta que “regra” sozinha não segura o dia.',
      'main_blocker', 'O bloqueio é constância: o pula-pula entre disciplina e exagero gera desgaste e sensação de falta de controle.',
      'consequence', 'Continuar assim tende a aumentar autopunição e oscilação — com impacto em energia e autoestima.',
      'growth_potential', 'Conversar com quem te enviou permite montar caminho gentil: hábitos + nutrição funcional com foco em estabilidade, não em culpa.',
      'dica_rapida', 'Quando emoção puxa a comida, muitas vezes falta base de energia no dia — não só “autocontrole”.',
      'cta_text', 'Quero reduzir o impacto emocional na alimentação',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre emoção e comida e o resultado mostrou um padrão mais forte de oscilação. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'disciplinado-emocional-comida',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Ciclo emocional com a comida está pesado — conversa com apoio faz diferença',
      'profile_summary', 'Pelas respostas, o impacto do emocional nas escolhas é alto — com episódios repetidos, sensação de perda de controle ou padrão difícil de manter.',
      'frase_identificacao', 'Se isso é você, provavelmente já cansou de prometer “segunda começo tudo de novo”.',
      'main_blocker', 'A tensão é alto impacto na relação com comida: impulso, compensação e culpa se alimentam.',
      'consequence', 'Adiar apoio prolonga o ciclo e aumenta desgaste emocional sem abrir espaço para método realista.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: próximo passo com estratégia humana — sem julgamento, com direção.',
      'dica_rapida', 'Neste patamar, método simples + companhia na conversa costuma vencer radicalismo que não cola na vida real.',
      'cta_text', 'Preciso de apoio para equilibrar minha alimentação',
      'whatsapp_prefill', 'Oi! Fiz o quiz disciplinado/emocional com a comida e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para ver o caminho.'
    )
  ),

  -- --- Nutrido vs alimentado ---
  (
    'nutrido-vs-alimentado',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você come — mas ainda há margem para densidade e energia melhores',
      'profile_summary', 'Pelas respostas, há sinais de que volume ou hábito existe, porém a estabilidade de energia, foco à tarde ou sono após comer ainda oscila.',
      'frase_identificacao', 'Se faz sentido, você talvez já sinta “cheio” mas não “disposto”.',
      'main_blocker', 'A tensão é alimentação que enche sem sustentar: falta equilíbrio que traduza em energia previsível.',
      'consequence', 'Sem pequenos ajustes, oscilação de energia vira normal e mascara o que seria ganho fácil.',
      'growth_potential', 'Quem te enviou pode indicar trocas estratégicas simples — nutrição funcional alinhada ao teu dia.',
      'dica_rapida', 'Nutrir melhor não precisa ser revolução: muitas vezes são poucos eixos que faltam, não o prato inteiro.',
      'cta_text', 'Quero melhorar nutrindo melhor no dia a dia',
      'whatsapp_prefill', 'Oi! Fiz o quiz nutrido vs alimentado e saiu que tenho espaço para otimizar. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'nutrido-vs-alimentado',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Energia irregular sugere alimentação que ainda não sustenta de verdade',
      'profile_summary', 'Pelas respostas, variedade nutricional, estabilidade pós-refeição ou foco à tarde mostram lacunas — padrão de “alimentado, mas empurrado”.',
      'frase_identificacao', 'Se você se identificou, talvez já associe sono ou apagão a certo tipo de refeição.',
      'main_blocker', 'O bloqueio é densidade nutricional e ritmo: o corpo recebe comida, mas não o que precisa para aguentar o dia com folga.',
      'consequence', 'Manter o padrão tende a repetir picos e quedas — e dificulta constância em trabalho, treino ou família.',
      'growth_potential', 'Conversar com quem te enviou ajuda a priorizar o que trocar primeiro — plano simples, aplicável.',
      'dica_rapida', 'Quando a tarde cai, olhar o almoço anterior costuma dar pista — ajuste pequeno, efeito grande.',
      'cta_text', 'Quero uma rota simples para nutrir melhor',
      'whatsapp_prefill', 'Oi! Fiz o quiz nutrido vs alimentado e o resultado mostrou energia irregular. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'nutrido-vs-alimentado',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Corpo pede nutrição de verdade — não só mais refeição',
      'profile_summary', 'Pelas respostas, o descompasso entre o que você come e como se sente (energia, foco, sono) é forte — impacto claro no dia.',
      'frase_identificacao', 'Se isso é você, talvez já sinta que “comer mais do mesmo” não resolve.',
      'main_blocker', 'A tensão é alto impacto na disposição: alimentação não sustenta o ritmo que a vida exige.',
      'consequence', 'Adiar calibragem prolonga oscilação e sensação de estar sempre recuperando energia.',
      'growth_potential', 'Fala com quem te enviou: monte um plano de nutrição funcional e hábitos coerentes com o teu objetivo — passo a passo.',
      'dica_rapida', 'Neste patamar, direção clara importa mais que acumular restrições.',
      'cta_text', 'Preciso melhorar o que me nutre de verdade',
      'whatsapp_prefill', 'Oi! Fiz o quiz nutrido vs alimentado e o resultado ficou bem intenso na energia e foco. Quero conversar com quem me enviou este link.'
    )
  ),

  -- --- Alimentação conforme a rotina ---
  (
    'alimentacao-rotina',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua alimentação e sua rotina ainda trocam farpas — mas dá para encaixar',
      'profile_summary', 'Pelas respostas, saltos de refeição, dias corridos ou quedas de energia em horários fixos já aparecem, porém num patamar ainda manejável.',
      'frase_identificacao', 'Se combina, você provavelmente já disse “hoje não deu” mais vezes do que gostaria.',
      'main_blocker', 'A tensão é desalinhamento: o plano na cabeça não conversa com o ritmo real — e a energia paga o preço.',
      'consequence', 'Se vira padrão, irregularidade alimentar vira pano de fundo e puxa irritação e cansaço.',
      'growth_potential', 'Quem te enviou pode ajudar a desenhar encaixe realista — nutrição e hábitos que cabem no teu calendário.',
      'dica_rapida', 'Plano que não cabe na rotina não é plano — é lista de desejos; o ajuste é adaptar o formato.',
      'cta_text', 'Quero alinhar comida e rotina de verdade',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre alimentação conforme a rotina e saiu um desalinhamento leve. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'alimentacao-rotina',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Rotina puxada já derruba consistência alimentar com frequência',
      'profile_summary', 'Pelas respostas, faltar refeição por tempo, perder padrão nos dias corridos ou sentir queda de energia previsível já são recorrentes.',
      'frase_identificacao', 'Se você se identificou, talvez já viva no modo “depois eu organizo”.',
      'main_blocker', 'O bloqueio é aderência: quando a vida acelera, a estratégia de comer bem é a primeira a sair da mesa.',
      'consequence', 'Continuar assim tende a aumentar oscilação de energia e sensação de estar sempre remendando o dia.',
      'growth_potential', 'Conversar com quem te enviou permite montar plano mínimo viável — o que sustenta mesmo em semana pesada.',
      'dica_rapida', 'Consistência vem de estrutura pequena repetida, não de perfeição em dia tranquilo só.',
      'cta_text', 'Quero um plano que caiba na minha rotina',
      'whatsapp_prefill', 'Oi! Fiz o quiz alimentação e rotina e o resultado mostrou desalinhamento forte. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'alimentacao-rotina',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Comida e rotina estão em guerra — precisa de plano que cola na vida real',
      'profile_summary', 'Pelas respostas, o descompasso entre rotina e alimentação é intenso — com impacto claro em energia, constância e bem-estar diário.',
      'frase_identificacao', 'Se isso é você, provavelmente já sentiu que “formato ideal” não existe nos teus dias — e precisa de versão real.',
      'main_blocker', 'A tensão é alto impacto: sem encaixe, cada semana vira reconstrução do zero — cansativo e improdutivo.',
      'consequence', 'Adiar apoio mantém ciclo de irregularidade que drena disposição e clareza.',
      'growth_potential', 'Fala com quem te enviou: construa plano adaptado ao teu ritmo — nutrição funcional + microestrutura que aguente turbulência.',
      'dica_rapida', 'Neste patamar, o foco é sustentar a rotina alimentar no dia a dia real, não perseguir um padrão que não cabe na tua vida.',
      'cta_text', 'Preciso encaixar alimentação na minha vida',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre alimentação conforme a rotina e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para montar o próximo passo.'
    )
  );
