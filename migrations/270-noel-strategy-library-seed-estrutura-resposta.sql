-- SEED — Preenche diagnostic_phrase, explicacao e proximo_movimento nas 20 estratégias.
-- Estrutura de resposta: Diagnóstico → Explicação → Próximo movimento → Exemplo.
-- Rodar após 269.

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando o conteúdo não gera engajamento ou as pessoas não sabem como responder.',
  explicacao = 'Quando você usa diagnósticos curtos, as pessoas se identificam e querem saber mais — isso inicia a conversa naturalmente.',
  proximo_movimento = 'Crie um link de diagnóstico e compartilhe em um post ou story com uma pergunta que faça a pessoa refletir.'
WHERE topic = 'gerar_clientes' AND problem = 'profissional posta conteúdo mas quase ninguém entra em contato';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando o conteúdo é só informativo, sem convite para interação.',
  explicacao = 'Perguntas diagnósticas fazem a pessoa parar, refletir e responder — em vez de só curtir e passar.',
  proximo_movimento = 'Inclua uma pergunta como "qual desses bloqueios parece mais com o que você vive hoje?" no próximo conteúdo.'
WHERE topic = 'gerar_clientes' AND problem = 'seguidores acompanham mas não interagem';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando a conversa começa pelo preço.',
  explicacao = 'Quando o cliente entende primeiro o problema dele, o preço deixa de ser a primeira pergunta.',
  proximo_movimento = 'Envie um diagnóstico curto antes de iniciar a conversa — 3 ou 4 perguntas sobre a situação da pessoa.'
WHERE topic = 'filtrar_curiosos' AND problem = 'muitas pessoas perguntam preço sem entender o serviço';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando o profissional se apresenta igual a todos os outros.',
  explicacao = 'Quando você mostra análise baseada nas respostas da pessoa, você demonstra método e expertise.',
  proximo_movimento = 'Use o resultado do diagnóstico para explicar: "Com base nas suas respostas, parece que..."'
WHERE topic = 'autoridade' AND problem = 'profissional parece apenas mais um no mercado';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando não há um ponto de partida claro para a conversa.',
  explicacao = 'Um diagnóstico rápido remove a pressão de "vender" — você está oferecendo algo útil antes de falar do serviço.',
  proximo_movimento = 'Ofereça um diagnóstico de 2 ou 3 minutos antes de explicar o que você faz.'
WHERE topic = 'iniciar_conversa' AND problem = 'profissional não sabe como iniciar conversas';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando o conteúdo não convida a pessoa a participar.',
  explicacao = 'Perguntas diagnósticas transformam visualização em resposta — a pessoa precisa escolher algo.',
  proximo_movimento = 'Inclua uma pergunta no final do próximo post: "qual dessas situações você vive hoje?"'
WHERE topic = 'engajamento' AND problem = 'conteúdo gera visualizações mas poucas respostas';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando o profissional não pede indicação no momento certo.',
  explicacao = 'Logo após um resultado positivo, a pessoa está satisfeita e mais disposta a indicar.',
  proximo_movimento = 'Após mostrar um resultado ou insight, pergunte: "Você conhece alguém que também poderia se beneficiar disso?"'
WHERE topic = 'gerar_indicacoes' AND problem = 'clientes satisfeitos não indicam novas pessoas';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando poucas pessoas chegam até você ou não percebem que precisam.',
  explicacao = 'Diagnósticos despertam consciência — a pessoa enxerga um bloqueio que não via.',
  proximo_movimento = 'Compartilhe um diagnóstico que mostre bloqueios invisíveis em posts e stories.'
WHERE topic = 'agenda_vazia' AND problem = 'profissional tem poucos atendimentos';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando o cliente não vê claramente o que está perdendo.',
  explicacao = 'Quando você mostra o bloqueio identificado e o impacto de não resolver, a decisão fica mais clara.',
  proximo_movimento = 'Use o resultado do diagnóstico para explicar o impacto de não resolver o problema.'
WHERE topic = 'conversao' AND problem = 'clientes interessados demoram para decidir';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando a conversa pula direto para solução ou preço.',
  explicacao = 'Quando o cliente entende o problema antes, o valor do serviço fica óbvio.',
  proximo_movimento = 'Pergunte sobre a situação antes de explicar preço ou tratamento.'
WHERE topic = 'educacao_cliente' AND problem = 'cliente não entende o valor do serviço';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando o profissional oferece solução antes de entender o cliente.',
  explicacao = 'Perguntas estratégicas mostram que você é consultor, não vendedor — a pessoa se abre mais.',
  proximo_movimento = 'Faça perguntas como "o que você já tentou fazer para resolver isso?" antes de explicar.'
WHERE topic = 'autoridade_profissional' AND problem = 'profissional é visto apenas como vendedor';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando o conteúdo não pede ação ou escolha.',
  explicacao = 'Diagnósticos interativos exigem que a pessoa faça algo — isso gera engajamento real.',
  proximo_movimento = 'Compartilhe um link de diagnóstico rápido (3 ou 4 perguntas) no próximo post.'
WHERE topic = 'engajar_seguidores' AND problem = 'seguidores passivos';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando o profissional não comunica o que o torna diferente.',
  explicacao = 'Cada pessoa tem um bloqueio diferente — o diagnóstico personalizado mostra que você entende isso.',
  proximo_movimento = 'Use o resultado do diagnóstico para explicar o que é específico da situação da pessoa.'
WHERE topic = 'posicionamento' AND problem = 'profissional não consegue se diferenciar';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando o contato esfria e não há motivo para retomar.',
  explicacao = 'Um diagnóstico ou insight relevante dá motivo natural para reabrir a conversa.',
  proximo_movimento = 'Envie um diagnóstico ou conteúdo que faça sentido para a situação que a pessoa compartilhou.'
WHERE topic = 'recuperar_cliente' AND problem = 'cliente parou de responder';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando a conversa é longa antes de saber se a pessoa está pronta.',
  explicacao = 'O diagnóstico filtra antes — quem responde com interesse real vale a conversa longa.',
  proximo_movimento = 'Envie o link do diagnóstico antes e explique que ele ajuda a entender se faz sentido avançar.'
WHERE topic = 'qualificar_cliente' AND problem = 'muitas conversas com pessoas sem interesse real';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando as pessoas não percebem que têm um problema.',
  explicacao = 'Um diagnóstico que revela bloqueio invisível desperta o "nunca tinha pensado nisso".',
  proximo_movimento = 'Use títulos como "descubra o que pode estar travando seus resultados" em conteúdos.'
WHERE topic = 'gerar_interesse' AND problem = 'pessoas não percebem que têm um problema';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando o cliente quer resultado sem entender a causa.',
  explicacao = 'Quando você explica o bloqueio antes da solução, o cliente valoriza mais o que você propõe.',
  proximo_movimento = 'Explique o bloqueio identificado antes de oferecer o tratamento ou solução.'
WHERE topic = 'educacao' AND problem = 'cliente busca solução rápida';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando o profissional não mostra análise baseada no que a pessoa disse.',
  explicacao = 'Quando você interpreta as respostas com cuidado, a pessoa sente que foi ouvida.',
  proximo_movimento = 'Use as respostas do diagnóstico para fazer uma análise antes de propor qualquer coisa.'
WHERE topic = 'gerar_confianca' AND problem = 'cliente desconfia do profissional';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando a única fonte de clientes é indicação espontânea.',
  explicacao = 'Diagnósticos em conteúdos criam novas portas de entrada — pessoas que ainda não te conhecem.',
  proximo_movimento = 'Divulgue diagnósticos em posts e stories para atrair quem ainda não é seu cliente.'
WHERE topic = 'crescimento_profissional' AND problem = 'profissional depende apenas de indicação';

UPDATE noel_strategy_library SET
  diagnostic_phrase = 'Isso acontece quando o profissional vai direto para a oferta.',
  explicacao = 'Servir antes de vender — o diagnóstico inicia o relacionamento sem pressão.',
  proximo_movimento = 'Ofereça um diagnóstico antes de falar do seu serviço ou produto.'
WHERE topic = 'diagnostico_como_marketing' AND problem = 'profissional tenta vender diretamente';
