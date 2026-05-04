-- Bloco 4 vendas Pro Líderes — lote 3 (5 fluxos: calculadoras + prontidão + avaliações).
-- Segue 394. diagnosis_vertical NULL. Bem-estar / nutrição funcional; não substitui avaliação profissional.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'calc-imc',
    'calc-proteina',
    'pronto-emagrecer',
    'avaliacao-fome-emocional',
    'avaliacao-intolerancias-sensibilidades'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  (
    'calc-imc',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Indicador inicial para orientar próximos passos — com calma e critério',
      'profile_summary', 'Pelas respostas, peso, altura, rotina e energia sugerem um ponto de partida útil para conversa — sem transformar número em rótulo definitivo sobre você.',
      'frase_identificacao', 'Se combina, você provavelmente quer usar o indicador como bússola, não como veredito.',
      'main_blocker', 'A tensão é decisão sem referência: falta encaixar o “onde estou” com “o que faz sentido fazer agora”.',
      'consequence', 'Sem direção, cada tentativa vira achismo — e cansa antes de virar hábito.',
      'growth_potential', 'Quem te enviou pode cruzar faixas com tua rotina real e montar plano sustentável — conversa com apoio.',
      'dica_rapida', 'IMC é ferramenta populacional; teu caso vive no contexto (sono, stress, rotina) — conversa individual pesa mais.',
      'cta_text', 'Quero meu ponto de partida com orientação',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de IMC (referência de bem-estar) e quero alinhar o que fazer a seguir. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'calc-imc',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Referência corporal pede plano alinhado à tua vida — não só ao número',
      'profile_summary', 'Pelas respostas, combinação de faixas com rotina ou energia abaixo do ideal indica que o próximo passo precisa de calibragem humana — hábitos, nutrição e consistência.',
      'frase_identificacao', 'Se você se identificou, talvez já tenha tentado mudar sem encaixe no calendário.',
      'main_blocker', 'O bloqueio é falta de sistema: indicador sozinho não vira ação que você mantenha na semana.',
      'consequence', 'Continuar sem plano tende a repetir frustração e sensação de estagnação.',
      'growth_potential', 'Conversar com quem te enviou ajuda a traduzir referência em metas possíveis — com acompanhamento.',
      'dica_rapida', 'Quem melhora de verdade costuma ganhar em rotina antes de ganhar em perfeição.',
      'cta_text', 'Quero direção clara a partir da minha referência',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de IMC e preciso montar próximo passo realista. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'calc-imc',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Grande distância entre referência e rotina sustentável — priorize conversa guiada',
      'profile_summary', 'Pelas respostas, sinais de que ajuste de peso, energia ou consistência tem impacto alto no teu dia — tema que pede plano firme com quem te acompanha.',
      'frase_identificacao', 'Se isso é você, talvez já sinta que “saber” não basta — falta estrutura.',
      'main_blocker', 'A tensão é alto impacto emocional e físico sem trilha: cada semana recomeça no improviso.',
      'consequence', 'Adiar apoio prolonga desgaste e risco de medidas extremas que não duram.',
      'growth_potential', 'Fala com quem te enviou: construa plano por fases — nutrição funcional, hábitos e critério profissional quando necessário.',
      'dica_rapida', 'Neste patamar, método sustentável vence impulso; conversa evita erro caro.',
      'cta_text', 'Preciso de plano serio com acompanhamento',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de IMC e o resultado pede conversa firme para encaixe na minha vida. Quero conversar com quem me enviou este link.'
    )
  ),

  (
    'calc-proteina',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Proteína com margem de ajuste — saciedade e rotina podem melhorar',
      'profile_summary', 'Pelas respostas, peso, objetivo, atividade e fome entre refeições sugerem que calibrar proteína pode dar mais previsibilidade à energia e à saciedade.',
      'frase_identificacao', 'Se combina, você talvez coma “o suficiente” mas não “o que sustenta”.',
      'main_blocker', 'A tensão é refeição que não segura: fome volta rápido ou energia oscila entre refeições.',
      'consequence', 'Sem ajuste, compensação com snack ou excesso à noite costuma aparecer.',
      'growth_potential', 'Quem te enviou pode traduzir a estimativa em prato simples — conversa prática.',
      'dica_rapida', 'Pequeno ajuste de proteína costuma mudar o dia inteiro sem radicalizar o cardápio.',
      'cta_text', 'Quero ajustar proteína com orientação',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de proteína e quero alinhar com a minha rotina. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'calc-proteina',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Padrão proteico irregular — saciedade e meta ainda não conversam',
      'profile_summary', 'Pelas respostas, objetivo (manter, mudar composição ou energia), atividade e fome entre refeições indicam descompasso entre estimativa e hábito real.',
      'frase_identificacao', 'Se você se identificou, talvez sinta fome “cedo demais” depois de comer.',
      'main_blocker', 'O bloqueio é distribuição e consistência: proteína não entra de forma estável ao longo do dia.',
      'consequence', 'Manter assim tende a repetir ciclo de restrição impulsiva e compensação.',
      'growth_potential', 'Conversar com quem te enviou ajuda a montar modelo simples de refeição — sustentável, não teórico.',
      'dica_rapida', 'Proteína é peça de saciedade; sem ela organizada, o resto do plano sofre.',
      'cta_text', 'Quero um ajuste de proteína que eu consiga manter',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de proteína e o resultado mostrou que preciso calibrar melhor. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'calc-proteina',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Proteína e rotina muito desalinhadas — conversa firme evita erro',
      'profile_summary', 'Pelas respostas, combinação de meta, fome frequente e atividade indica que o ajuste proteico tem impacto alto — precisa de desenho com apoio, não de chute.',
      'frase_identificacao', 'Se isso é você, talvez já tenha cortado demais ou comido demais sem critério.',
      'main_blocker', 'A tensão é alto impacto em saciedade e resultado: base proteica mal calibrada derruba o resto do plano.',
      'consequence', 'Adiar orientação prolonga oscilação e sensação de injustiça com o próprio corpo.',
      'growth_potential', 'Fala com quem te enviou: defina alvo prático, refeições modelo e acompanhamento.',
      'dica_rapida', 'Neste patamar, método gentil com números sensatos vence experimento aleatório.',
      'cta_text', 'Preciso calibrar proteína com plano',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de proteína e o resultado ficou bem intenso no descompasso com meu dia. Quero conversar com quem me enviou este link.'
    )
  ),

  (
    'pronto-emagrecer',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Prontidão em evolução — dá para começar sem radicalismo',
      'profile_summary', 'Pelas respostas, você mostra abertura para ajustes por algumas semanas e mínima organização — constância ainda oscila, mas há base para início realista.',
      'frase_identificacao', 'Se combina, você provavelmente quer mudança que dure, não estrela de reality.',
      'main_blocker', 'A tensão é disciplina que ainda não virou sistema: pequenas quebras de rotina derrubam o ritmo.',
      'consequence', 'Sem formato certo, cada semana vira “recomeço” e consome motivação.',
      'growth_potential', 'Quem te enviou pode montar plano viável com acompanhamento — método, não culpa.',
      'dica_rapida', 'Emagrecer com saúde costuma ser consistência chata que funciona — conversa ajuda a achar a tua versão.',
      'cta_text', 'Quero começar com estratégia sustentável',
      'whatsapp_prefill', 'Oi! Fiz o quiz “pronto para emagrecer com saúde?” e fiquei com prontidão em evolução. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'pronto-emagrecer',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Constância é o maior desafio — método importa mais que força de vontade',
      'profile_summary', 'Pelas respostas, organização básica ou abertura a acompanhamento existem, mas histórico de perder ritmo ou desafio central na constância indica necessidade de estrutura.',
      'frase_identificacao', 'Se você se identificou, talvez já confunda falta de plano com falta de caráter.',
      'main_blocker', 'O bloqueio é aderência: quando a vida aperta, o processo de mudança é o primeiro a sair.',
      'consequence', 'Continuar no ciclo “tudo ou nada” tende a aumentar culpa e peso emocional com o corpo.',
      'growth_potential', 'Conversar com quem te enviou permite desenhar plano realista com checkpoints — pequenas vitórias encadeadas.',
      'dica_rapida', 'Acompanhamento não é fraqueza — é alavanca de constância para quem já tentou sozinho.',
      'cta_text', 'Quero estratégia para não parar no meio',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre emagrecer com saúde e o resultado mostrou constância como maior desafio. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'pronto-emagrecer',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Baixa prontidão operacional — melhor desenhar antes de “começar segunda”',
      'profile_summary', 'Pelas respostas, falta de estrutura mínima, resistência a ajustes por semanas ou padrão forte de perder ritmo indica risco alto de novo ciclo frustrante.',
      'frase_identificacao', 'Se isso é você, forçar largada sem sistema pode reforçar narrativa negativa.',
      'main_blocker', 'A tensão é compromisso que o dia a dia ainda não sustenta — falta engenharia do plano, não só desejo.',
      'consequence', 'Adiar desenho prolonga sofrimento e sensação de estar preso.',
      'growth_potential', 'Fala com quem te enviou: reduza escopo, suba apoio, construa primeira fase vencível — depois expande.',
      'dica_rapida', 'Neste patamar, vitória pequena batida é melhor que meta grande quebrada.',
      'cta_text', 'Preciso montar um começo que eu aguente',
      'whatsapp_prefill', 'Oi! Fiz o quiz pronto para emagrecer com saúde e o resultado ficou bem intenso na prontidão. Quero conversar com quem me enviou este link para definir o formato.'
    )
  ),

  (
    'avaliacao-fome-emocional',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você já percebe laço entre emoção e comida — ainda dá para suavizar com estratégia',
      'profile_summary', 'Pelas respostas, stress ou ansiedade às vezes puxam a alimentação, com culpa pontual — patamar onde método leve e rotina mais estável costumam ajudar.',
      'frase_identificacao', 'Se combina, nem todo episódio é “falta de controle” — muitas vezes é cansaço e gatilho.',
      'main_blocker', 'A tensão é comer para aliviar tensão sem ter outra válvula tão rápida no dia.',
      'consequence', 'Se cresce, o ciclo culpa–compensação rouba paz e energia.',
      'growth_potential', 'Quem te enviou pode ajudar com leitura de gatilhos e nutrição que estabiliza o dia — sem julgamento.',
      'dica_rapida', 'Fome emocional costuma melhorar quando o corpo para de oscilar de energia o dia todo.',
      'cta_text', 'Quero reduzir esse ciclo com apoio',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de fome emocional e saiu um padrão leve. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'avaliacao-fome-emocional',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Gatilhos emocionais comem espaço na tua consistência',
      'profile_summary', 'Pelas respostas, comer para aliviar stress, sensação de perda de controle, culpa frequente ou confusão entre fome física e emocional já são recorrentes.',
      'frase_identificacao', 'Se você se identificou, talvez já sinta vergonha que pesa mais que o prato.',
      'main_blocker', 'O bloqueio é circuito emocional: impulso entra antes da clareza — e culpa fecha o loop.',
      'consequence', 'Manter assim tende a piorar relação com comida e com espelho ao mesmo tempo.',
      'growth_potential', 'Conversar com quem te enviou permite montar estratégia humana — hábitos, nutrição e nomear gatilhos.',
      'dica_rapida', 'Recuperar consistência pede parceiro de conversa, não só lista de proibições.',
      'cta_text', 'Quero equilíbrio sem culpa constante',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de fome emocional e o resultado mostrou impacto forte. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'avaliacao-fome-emocional',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Fome emocional com impacto alto — conversa com apoio é central',
      'profile_summary', 'Pelas respostas, padrão de compensação com comida, culpa intensa ou confusão constante entre necessidade e impulso interfere de forma nítida na vida diária.',
      'frase_identificacao', 'Se isso é você, isso já não é “detalhe” — é tema de bem-estar sério.',
      'main_blocker', 'A tensão é alto impacto emocional: comida virou regulação de humor sem você querer.',
      'consequence', 'Adiar apoio prolonga sofrimento e pode reforçar isolamento com o problema.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: plano gentil, estrutura e linguagem de respeito ao teu ritmo.',
      'dica_rapida', 'Neste patamar, julgamento zero e método claro costumam ser o par certo.',
      'cta_text', 'Preciso de apoio para sair desse ciclo',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de fome emocional e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para um plano.'
    )
  ),

  (
    'avaliacao-intolerancias-sensibilidades',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sinais de sensibilidade alimentar — vale organizar gatilhos com calma',
      'profile_summary', 'Pelas respostas, desconforto pontual após certos alimentos ou sensação digestiva variável aparece — ainda em patamar de mapear hábitos sem alarmismo.',
      'frase_identificacao', 'Se combina, você provavelmente já cortou coisa no improviso “para ver se melhora”.',
      'main_blocker', 'A tensão é incerteza: não sabe exatamente o que piora — então vive testando no escuro.',
      'consequence', 'Sem método, lista de medo na comida pode crescer sem critério.',
      'growth_potential', 'Quem te enviou pode ajudar com plano inicial de observação e nutrição — sempre respeitando avaliação profissional quando preciso.',
      'dica_rapida', 'Sensibilidade e alergia não são a mesma coisa; conversa guiada evita autodiagnóstico.',
      'cta_text', 'Quero reduzir desconfortos com orientação',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de intolerâncias/sensibilidades e saiu um padrão leve. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'avaliacao-intolerancias-sensibilidades',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Desconforto recorrente pede mapa de gatilhos — não só cortes aleatórios',
      'profile_summary', 'Pelas respostas, estufamento, gases ou indisposição após comer, dificuldade de reconhecer alimentos gatilho ou impacto na energia já são frequentes.',
      'frase_identificacao', 'Se você se identificou, talvez já restrinja demais por medo do sintoma.',
      'main_blocker', 'O bloqueio é falta de critério: sintoma existe, mas estratégia ainda não é estável.',
      'consequence', 'Continuar no trial and error tende a aumentar ansiedade com a mesa.',
      'growth_potential', 'Conversar com quem te enviou ajuda a ordenar teste e rotina — nutrição funcional com calma.',
      'dica_rapida', 'Ajuste gradual com registro simples costuma esclarecer mais que cortar cinco coisas num dia.',
      'cta_text', 'Quero plano inicial para reduzir gatilhos',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de sensibilidades e o resultado mostrou desconforto frequente. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'avaliacao-intolerancias-sensibilidades',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sensibilidade com impacto alto no dia — organize com quem te acompanha',
      'profile_summary', 'Pelas respostas, sintomas recorrentes, forte relação com alimentos e interferência na energia indicam necessidade de plano estruturado — evitando improviso prolongado.',
      'frase_identificacao', 'Se isso é você, a comida já virou fonte de medo, não só de prazer.',
      'main_blocker', 'A tensão é alto impacto: digestão e bem-estar travam escolhas e humor.',
      'consequence', 'Adiar organização prolonga sofrimento e restrições sem critério.',
      'growth_potential', 'Fala com quem te enviou: rota de bem-estar digestivo + encaminhamento profissional quando fizer sentido.',
      'dica_rapida', 'Neste patamar, critério profissional aliado a método diário costuma ser o caminho mais seguro.',
      'cta_text', 'Preciso de apoio para esse quadro',
      'whatsapp_prefill', 'Oi! Fiz a avaliação de intolerâncias/sensibilidades e o resultado ficou bem intenso. Quero conversar com quem me enviou este link.'
    )
  );
