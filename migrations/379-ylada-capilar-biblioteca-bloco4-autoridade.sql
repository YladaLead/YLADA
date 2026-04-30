-- Terapia capilar — Bloco 4: AUTORIDADE / EDUCAÇÃO (conteúdo compartilhável + posicionamento).
-- Templates b1000178–b1000185. Tom educativo, PT-BR claro, sem diagnóstico médico; encaminha avaliação capilar e saúde quando couber.
-- @see src/config/pro-estetica-capilar-biblioteca.ts

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000178-0178-4000-8000-000000000178',
    'quiz_capilar_mitos_queda',
    'diagnostico',
    $c178$
    {
      "title": "Mitos sobre queda de cabelo: o que você ainda acredita sem perceber?",
      "introTitle": "Shampoo \"fortificante\" sozinho, água fria ou raspagem: será que algum mito está guiando sua rotina?",
      "introSubtitle": "Cinco perguntas para alinhar expectativa com o que costuma ser verdade na prática; na avaliação presencial a profissional explica o seu caso — mitos caem, mas cada cabelo precisa de contexto.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Você acha que a queda resolve só trocando de shampoo marcas \"forte\"?", "type": "single", "options": ["Não confio nisso", "Talvez ajude", "Já troquei várias vezes esperando milagre", "Ainda acredito que o frasco é o centro da solução"]},
        {"id": "q2", "text": "Sobre água fria no final do banho para \"fechar cutícula e parar queda\"…", "type": "single", "options": ["Sei que é exagero", "Faço às vezes por hábito", "Acredito que faz grande diferença", "Nunca pensei nisso"]},
        {"id": "q3", "text": "Suplemento ou \"vitamina da internet\" sem orientação profissional?", "type": "single", "options": ["Não uso", "Já usei por conta", "Uso e nem sei se preciso", "Acho que é obrigatório para parar queda"]},
        {"id": "q4", "text": "Você compara sua queda com vídeo de rede social sem contexto?", "type": "single", "options": ["Raramente", "Às vezes", "Frequentemente", "Quase sempre — me deixa mais ansiosa"]},
        {"id": "q5", "text": "O que você mais quer depois deste quiz?", "type": "single", "options": ["Só curiosidade", "Lista do que não adianta esperar sozinha", "Conversa para entender meu tipo de queda", "Plano capilar com a profissional"]}
      ],
      "results": [
        {"id": "r4", "label": "Mitos no comando", "minScore": 12, "headline": "Várias crenças populares parecem guiar suas decisões", "description": "Isso cansa e custa caro. Na consulta dá para separar o que é marketing do que é cuidado com evidência prática no seu fio e no seu couro — sem julgamento, com clareza."},
        {"id": "r3", "label": "Meio-termo", "minScore": 9, "headline": "Você já desconfia de parte do discurso, mas ainda mistura coisas", "description": "Bom sinal. Leve o resultado no WhatsApp: uma conversa curta costuma travar o que vale testar com critério e o que pode esperar."},
        {"id": "r2", "label": "Aberta a aprender", "minScore": 5, "headline": "Bom perfil para conteúdo educativo com profissional", "description": "Queda tem causa variada; o quiz não diagnostica. O próximo passo costuma ser avaliação que junta histórico, couro e rotina — com linguagem honesta."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre expectativa real", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar o que você já tentou com o que faz sentido medir na primeira visita."}
      ],
      "ctaDefault": "Quero tirar dúvidas sobre queda com profissional",
      "resultIntro": "Seu resultado:"
    }
    $c178$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000179-0179-4000-8000-000000000179',
    'quiz_capilar_erros_rotina',
    'diagnostico',
    $c179$
    {
      "title": "Erros comuns na rotina capilar: quantos você reconhece no seu dia a dia?",
      "introTitle": "Pentear molhado com força, secador no máximo ou dormir de coque: pequenos hábitos somam resultado?",
      "introSubtitle": "Cinco perguntas honestas sobre tempo e força no fio; na presencial a profissional ajusta técnica — erro comum não é vergonha, é ponto de partida.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Você pentea ou prende o cabelo ainda molhado e apertado?", "type": "single", "options": ["Quase nunca", "Às vezes", "Frequentemente", "Quase sempre — senão não seca"]},
        {"id": "q2", "text": "Secador ou chapinha no ajuste mais quente por pressa?", "type": "single", "options": ["Evito", "Às vezes", "Frequentemente", "Sempre no máximo"]},
        {"id": "q3", "text": "Esfrega o couro com unha na hora do shampoo?", "type": "single", "options": ["Não — ponta dos dedos", "Às vezes", "Quando coça muito", "Sempre"]},
        {"id": "q4", "text": "Deixa máscara \"um pouquinho mais\" do que o indicado para \"penetrar melhor\"?", "type": "single", "options": ["Sigo o tempo indicado", "Às vezes passo um pouco", "Deixo bastante mais", "Não uso máscara"]},
        {"id": "q5", "text": "Toalha no cabelo torcido tipo turbante por muito tempo?", "type": "single", "options": ["Não", "Poucos minutos", "Meia hora ou mais", "Durmo assim às vezes"]}
      ],
      "results": [
        {"id": "r4", "label": "Vários pontos de atrito", "minScore": 12, "headline": "Hábitos mecânicos e térmicos parecem pesar no seu relato", "description": "Quebra e frizz muitas vezes vêm daí antes de qualquer química. Na avaliação dá para trocar poucos gestos e ver mudança rápida — sem gastar fortuna."},
        {"id": "r3", "label": "Ajustes pontuais", "minScore": 9, "headline": "Um ou dois erros já aparecem — dá para corrigir com orientação", "description": "Suas respostas cabem em mini curso de técnica na consulta. Mande o resultado no WhatsApp."},
        {"id": "r2", "label": "No caminho certo", "minScore": 5, "headline": "Poucos hábitos arriscados; ainda há espaço para refinar", "description": "Às vezes só falta temperatura do secador ou tipo de elástico. Conversa rápida na clínica resolve."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para revisão de rotina", "description": "Com base nas suas respostas, o próximo passo costuma ser mostrar na prática como lavar, secar e prender — alinhado ao seu tipo de fio."}
      ],
      "ctaDefault": "Quero revisar minha rotina capilar com profissional",
      "resultIntro": "Seu resultado:"
    }
    $c179$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000180-0180-4000-8000-000000000180',
    'quiz_capilar_produtos_uso_errado',
    'diagnostico',
    $c180$
    {
      "title": "Produtos no cabelo: será que você está usando certo — ou só usando \"bastante\"?",
      "introTitle": "Camadas de leave-in, óleo na raiz e máscara todo dia: quantidade errada vira peso, não cuidado?",
      "introSubtitle": "Cinco perguntas sobre quantidade, ordem dos passos e troca de marca; na presencial a profissional simplifica o kit — menos confusão costuma dar mais brilho.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Quantos leave-ins, cremes ou óleos você usa no mesmo dia?", "type": "single", "options": ["Um ou nenhum", "Dois", "Três ou mais", "Perdi a conta"]},
        {"id": "q2", "text": "Óleo ou silicone na raiz com frequência?", "type": "single", "options": ["Não", "Raro", "Frequentemente", "Sempre — acho que nutre a raiz"]},
        {"id": "q3", "text": "Troca de shampoo ou máscara antes de acabar o frasco porque \"parou de fazer efeito\"?", "type": "single", "options": ["Não", "Às vezes", "Frequentemente", "Sempre — acostumei rápido"]},
        {"id": "q4", "text": "Você sabe a ordem: limpeza, hidratação, nutrição, reconstrução — ou mistura tudo?", "type": "single", "options": ["Tenho ordem clara", "Mais ou menos", "Uso o que sobra", "Compro o que está em promoção"]},
        {"id": "q5", "text": "O que você quer da consulta?", "type": "single", "options": ["Descartar o que não preciso", "Saber quantidade certa", "Kit mínimo que funcione", "Entender por que meu cabelo fica pesado"]}
      ],
      "results": [
        {"id": "r4", "label": "Sobrecarga de produto", "minScore": 12, "headline": "Acúmulo e ordem errada podem mascarar o estado real do fio", "description": "\"Mais produto\" raramente é a resposta. Na avaliação dá para fazer detox leve, reduzir passos e escolher textura certa — com economia de tempo e dinheiro."},
        {"id": "r3", "label": "Ajuste de uso", "minScore": 9, "headline": "Há espaço para simplificar sem perder resultado", "description": "Suas respostas pedem educação de aplicação (raiz vs pontas, quantidade). Leve o resultado no WhatsApp."},
        {"id": "r2", "label": "Exploratório", "minScore": 5, "headline": "Vale conferir se o problema é produto ou técnica", "description": "Às vezes o frasco é adequado, mas o jeito de usar não. Uma conversa objetiva na clínica fecha o pacote certo."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre produtos", "description": "Com base nas suas respostas, o próximo passo costuma ser lista curta do que manter, o que pausar e o que testar com critério."}
      ],
      "ctaDefault": "Quero ajuda para usar produto certo no meu cabelo",
      "resultIntro": "Seu resultado:"
    }
    $c180$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000181-0181-4000-8000-000000000181',
    'quiz_capilar_frequencia_lavagem',
    'diagnostico',
    $c181$
    {
      "title": "Frequência de lavagem: você está no equilíbrio ou no vai-e-volta do couro?",
      "introTitle": "Lavar todo dia para \"matar\" oleosidade ou evitar água semana inteira: os dois extremos confundem o couro?",
      "introSubtitle": "Cinco perguntas sobre oleosidade, atividade e sensação após lavar; na presencial a profissional indica ritmo e tipo de limpeza — frequência ideal é pessoal, não regra única da internet.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Quantas vezes por semana você lava em média?", "type": "single", "options": ["1 ou menos", "2 a 3", "4 a 5", "Todos os dias ou mais"]},
        {"id": "q2", "text": "Após lavar, em quanto tempo a raiz fica oleosa de novo?", "type": "single", "options": ["Vários dias", "Segundo dia", "No mesmo dia", "Quase nunca fica limpo"]},
        {"id": "q3", "text": "Você sente couro repuxando ou coçando depois da lavagem?", "type": "single", "options": ["Não", "Leve", "Frequente", "Quase sempre"]},
        {"id": "q4", "text": "Atividade física, suor ou uso de boné com frequência?", "type": "single", "options": ["Pouco", "Moderado", "Alto", "Muito alto"]},
        {"id": "q5", "text": "O que você mais quer entender?", "type": "single", "options": ["Se lavo demais ou de menos", "Qual shampoo faz sentido", "Como espaçar sem ficar suja", "Tudo isso com a profissional"]}
      ],
      "results": [
        {"id": "r4", "label": "Ciclo confuso", "minScore": 12, "headline": "Lavagem e sensação do couro não batem — comum quando o shampoo ou a frequência brigam", "description": "Na consulta dá para reorganizar: limpeza respeitosa, intervalo e tratamento de couro. O quiz mostra que vale a conversa técnica."},
        {"id": "r3", "label": "Ajuste fino", "minScore": 9, "headline": "Há margem para melhorar com pouca mudança", "description": "Suas respostas cabem em troca de técnica ou diluição de shampoo. Mande o resultado no WhatsApp."},
        {"id": "r2", "label": "Estável", "minScore": 5, "headline": "Você já está perto do equilíbrio; dá para só lapidar", "description": "Às vezes só falta pre-shampoo ou secagem diferente da raiz às pontas."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre frequência", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar rotina com estilo de vida e tipo de couro — sem culpa."}
      ],
      "ctaDefault": "Quero acertar frequência e lavagem do meu couro",
      "resultIntro": "Seu resultado:"
    }
    $c181$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000182-0182-4000-8000-000000000182',
    'quiz_capilar_habitos_prejudicam_fios',
    'diagnostico',
    $c182$
    {
      "title": "Hábitos do dia a dia: o que pode estar roubando brilho e força dos fios sem culpar o DNA?",
      "introTitle": "Sono curto, elástico apertado ou fumar: será que parte do que você chama de \"cabelo ruim\" é ambiente + hábito?",
      "introSubtitle": "Cinco perguntas sobre sono, estresse, sol e prender o cabelo; na avaliação presencial a profissional cruza com o couro e o fio — hábito não substitui genética, mas pode atrapalhar o melhor resultado.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Noites de sono regulares na última semana?", "type": "single", "options": ["Sim, na maioria", "Irregulares", "Ruins na maior parte", "Muito ruins há semanas"]},
        {"id": "q2", "text": "Estresse percebido (trabalho, família, saúde)?", "type": "single", "options": ["Baixo", "Médio", "Alto", "Muito alto"]},
        {"id": "q3", "text": "Sol no couro ou cabelo sem proteção com frequência?", "type": "single", "options": ["Raro", "Às vezes", "Frequentemente", "Quase todo dia"]},
        {"id": "q4", "text": "Prende o mesmo penteado apertado por muitas horas seguidas?", "type": "single", "options": ["Não", "Às vezes", "Quase todo dia", "Trabalho ou esporte exige"]},
        {"id": "q5", "text": "Tabagismo ou mudança brusca de peso recente?", "type": "single", "options": ["Não", "Tabagismo", "Mudança de peso", "Os dois / prefiro falar na consulta"]}
      ],
      "results": [
        {"id": "r4", "label": "Várias frentes", "minScore": 12, "headline": "Hábito e ambiente parecem pesar junto com o cuidado capilar", "description": "Não é julgamento — é contexto. Na consulta dá para priorizar o que dá para ajustar já e o que pede apoio amplo; o cabelo agradece quando o corpo respira melhor."},
        {"id": "r3", "label": "Foco em pequenas vitórias", "minScore": 9, "headline": "Dois ajustes de hábito costumam abrir espaço para o tratamento capilar render", "description": "Suas respostas cabem em combinação: menos tração no fio + proteção solar + rotina de sono mais honesta. Leve o resultado no WhatsApp."},
        {"id": "r2", "label": "Moderado", "minScore": 5, "headline": "Um ponto de cada vez já muda o espelho", "description": "Às vezes só o elástico ou o sol na raiz fazem diferença visível em semanas."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre hábitos e fio", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar o que é capilar com o que é rotina — com linguagem simples."}
      ],
      "ctaDefault": "Quero alinhar hábitos e cuidado capilar",
      "resultIntro": "Seu resultado:"
    }
    $c182$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000183-0183-4000-8000-000000000183',
    'quiz_capilar_inflamacao_couro_educativo',
    'diagnostico',
    $c183$
    {
      "title": "Inflamação no couro cabeludo: sinais que valem conversa (sem virar Dr. Google)?",
      "introTitle": "Vermelhidão persistente, ardor ou descamação estranha: quando o educativo vira \"melhor marcar avaliação\"?",
      "introSubtitle": "Cinco perguntas sobre tempo e sintomas; este quiz não diagnostica — ajuda você a chegar na consulta capilar (e, se for o caso, no médico) com informação organizada.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Há quanto tempo os sintomas no couro vêm te incomodando?", "type": "single", "options": ["Menos de 2 semanas", "2 semanas a 2 meses", "2 a 6 meses", "Mais de 6 meses"]},
        {"id": "q2", "text": "Coceira, ardor ou dor interferem no sono ou no trabalho?", "type": "single", "options": ["Não", "Um pouco", "Moderado", "Muito"]},
        {"id": "q3", "text": "Você já usou corticoide ou antifúngico por conta sem acompanhamento?", "type": "single", "options": ["Nunca", "Uma vez", "Várias vezes", "Uso recorrente"]},
        {"id": "q4", "text": "Mudou muito de shampoo ou \"testou\" vários ativos fortes recentemente?", "type": "single", "options": ["Não", "Pouco", "Bastante", "Estou sempre experimentando"]},
        {"id": "q5", "text": "O que você espera agora?", "type": "single", "options": ["Só entender se é grave", "Orientação capilar segura", "Lista para levar ao dermatologista", "Avaliação na clínica e encaminhamento se precisar"]}
      ],
      "results": [
        {"id": "r4", "label": "Prioridade avaliação", "minScore": 12, "headline": "Tempo longo ou impacto forte no dia a dia pedem olhar presencial — capilar e, se indicado, médico", "description": "Inflamação persistente não é só \"caspa\". Na clínica capilar você organiza o relato; a profissional indica o melhor próximo passo com segurança e sem empurrar diagnóstico por mensagem."},
        {"id": "r3", "label": "Bom encaixe capilar + vigilância", "minScore": 9, "headline": "Há espaço para protocolo suave e observação", "description": "Suas respostas cabem em limpeza gentil, pausa de experimentos e retorno em data combinada. Mande o resultado no WhatsApp."},
        {"id": "r2", "label": "Contexto recente", "minScore": 5, "headline": "Pode estar ligado a produto ou fase — ainda assim vale registrar", "description": "Anotar o que mudou na semana da crise ajuda muito na consulta. Fotos em luz natural também ajudam."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa educativa sobre couro", "description": "Com base nas suas respostas, o próximo passo costuma ser avaliação que separa irritação de hábito do que precisa de outro tipo de cuidado."}
      ],
      "ctaDefault": "Quero conversar sobre inflamação no couro cabeludo",
      "resultIntro": "Seu resultado:"
    }
    $c183$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000184-0184-4000-8000-000000000184',
    'quiz_capilar_hormonios_cabelo_educativo',
    'diagnostico',
    $c184$
    {
      "title": "Hormônios e cabelo: o que muda com ciclo, pílula, pós-parto ou menopausa (sem autodiagnóstico)?",
      "introTitle": "Queda ou oleosidade em mudança de vida: será que faz sentido juntar informação antes de sair comprando frasco?",
      "introSubtitle": "Cinco perguntas sobre ciclo, gestação, pós-parto ou menopausa; este quiz educa e organiza — exames e decisões médicas ficam com o profissional de saúde. Terapia capilar apoia o fio e o couro com continuidade.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Você está em qual momento (marque o que mais se aproxima)?", "type": "single", "options": ["Ciclo menstrual regular", "Grávida ou amamentando", "Pós-parto (até 12 meses)", "Menopausa ou perimenopausa / anticoncepcional hormonal"]},
        {"id": "q2", "text": "Mudança no volume da queda ou na textura do fio nos últimos meses?", "type": "single", "options": ["Não notei", "Leve", "Moderada", "Forte"]},
        {"id": "q3", "text": "Já conversou com médica ou médico sobre hormônios, tireoide ou anemia?", "type": "single", "options": ["Sim, recentemente", "Há um tempo", "Ainda não", "Prefiro falar na consulta"]},
        {"id": "q4", "text": "Você espera que a terapeuta capilar resolva sozinha o que pode ser interno?", "type": "single", "options": ["Não — quero encaixe certo entre profissionais", "Espero orientação geral", "Acho que shampoo resolve", "Não sei — quero clareza"]},
        {"id": "q5", "text": "O que você quer levar da primeira conversa na clínica capilar?", "type": "single", "options": ["Só apoio ao fio e ao couro", "Rotina em casa segura na fase", "Texto para conversar com médico se precisar", "Plano capilar + honestidade sobre limites"]}
      ],
      "results": [
        {"id": "r4", "label": "Encaixe amplo", "minScore": 12, "headline": "Mudança hormonal forte no relato pede conversa capilar + saúde geral quando fizer sentido", "description": "O cabelo reage ao contexto; a terapia capilar organiza cuidado externo e continuidade. Exames e ajustes hormonais são com profissional de saúde — sem culpa, com time."},
        {"id": "r3", "label": "Apoio capilar claro", "minScore": 9, "headline": "Há bom espaço para protocolo gentil e realista na sua fase", "description": "Suas respostas cabem em frequência de sessões e produtos adequados. Mande o resultado no WhatsApp."},
        {"id": "r2", "label": "Observação", "minScore": 5, "headline": "Ainda leve, mas vale registrar evolução mês a mês", "description": "Fotos na mesma luz e anotação de ciclo ajudam a ver padrão — útil na consulta."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa educativa sobre hormônios e cabelo", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar o que é cuidado capilar com o que é acompanhamento de saúde — com linguagem acessível."}
      ],
      "ctaDefault": "Quero orientação sobre hormônios e meu cabelo",
      "resultIntro": "Seu resultado:"
    }
    $c184$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000185-0185-4000-8000-000000000185',
    'quiz_capilar_tres_sinais_atencao_couro',
    'diagnostico',
    $c185$
    {
      "title": "Três sinais de que o couro cabeludo pede atenção antes do fio \"avisar\" demais",
      "introTitle": "Coceira leve, oleosidade estranha ou sensação de peso: será que você só olha para o comprimento e esquece a raiz?",
      "introSubtitle": "Cinco perguntas rápidas para um check-in honesto; na presencial a profissional confirma o que é rotina e o que merece outro olhar — conteúdo para compartilhar e gerar conversa no WhatsApp.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Você nota diferença de sensação na raiz entre um dia e outro?", "type": "single", "options": ["Quase nunca", "Às vezes", "Frequentemente", "Sempre — inquieta"]},
        {"id": "q2", "text": "O cabelo \"embola\" na nuca ou na raiz com facilidade mesmo limpo?", "type": "single", "options": ["Não", "Leve", "Moderado", "Muito"]},
        {"id": "q3", "text": "Cheiro, oleosidade ou sensação de calor no couro fora do comum?", "type": "single", "options": ["Não", "Raro", "Às vezes", "Frequente"]},
        {"id": "q4", "text": "Você costuma tratar só pontas e máscaras, raramente o couro?", "type": "single", "options": ["Cuido do couro também", "Metade do tempo", "Quase só pontas", "Só couro quando coça"]},
        {"id": "q5", "text": "Se um amigo perguntasse \"seu couro tá ok?\", você responderia…", "type": "single", "options": ["Tranquilo", "Mais ou menos", "Hoje não", "Não sei — por isso quero avaliação"]}
      ],
      "results": [
        {"id": "r4", "label": "Sinais somando", "minScore": 12, "headline": "Vários sinais leves juntos costumam ser o couro pedindo ordem na rotina", "description": "Não precisa ser drama para merecer avaliação. Na clínica dá para simplificar produtos e encaixar terapia de couro com critério — antes do fio piorar."},
        {"id": "r3", "label": "Atenção moderada", "minScore": 9, "headline": "Vale uma consulta de check-in e ajuste de hábito", "description": "Suas respostas cabem em orientação de lavagem e talvez uma sessão focada no couro. Mande o resultado no WhatsApp."},
        {"id": "r2", "label": "Observar", "minScore": 5, "headline": "Ainda leve; dá para educar e prevenir", "description": "Compartilhar este quiz com amiga já ajuda a normalizar cuidar da raiz — e marca avaliação quando fizer sentido."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa leve sobre couro", "description": "Com base nas suas respostas, o próximo passo costuma ser mostrar na consulta como massagear, enxaguar e escolher shampoo sem guerra."}
      ],
      "ctaDefault": "Quero avaliar meu couro cabeludo",
      "resultIntro": "Seu resultado:"
    }
    $c185$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  schema_json = EXCLUDED.schema_json,
  allowed_vars_json = EXCLUDED.allowed_vars_json,
  version = EXCLUDED.version,
  active = EXCLUDED.active,
  updated_at = NOW();

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Mitos sobre queda de cabelo', 'Alinha expectativa com prática — conteúdo para compartilhar.', 'Crenças que atrasam solução', 'Educação e avaliação', 'custom', 'b1000178-0178-4000-8000-000000000178'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_mitos_queda", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 440, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000178-0178-4000-8000-000000000178');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Erros comuns na rotina capilar', 'Pentear molhado, calor e toalha — ajustes rápidos.', 'Rotina que quebra fio', 'Técnica e hábitos', 'custom', 'b1000179-0179-4000-8000-000000000179'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_erros_rotina", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 441, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000179-0179-4000-8000-000000000179');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Produtos: uso errado ou excesso', 'Ordem, quantidade e raiz vs pontas.', 'Cabelo pesado ou sem resultado', 'Simplificar o kit', 'custom', 'b1000180-0180-4000-8000-000000000180'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_produtos_uso_errado", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 442, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000180-0180-4000-8000-000000000180');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Frequência de lavagem e equilíbrio do couro', 'Lavar demais ou de menos — ritmo pessoal.', 'Oleosidade ou repuxar', 'Lavagem adequada', 'custom', 'b1000181-0181-4000-8000-000000000181'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_frequencia_lavagem", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 443, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000181-0181-4000-8000-000000000181');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Hábitos que prejudicam fios e brilho', 'Sono, sol, elástico e estresse — contexto.', 'Queda ou fio sem vida', 'Ajustar ambiente e rotina', 'custom', 'b1000182-0182-4000-8000-000000000182'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_habitos_prejudicam_fios", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 444, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000182-0182-4000-8000-000000000182');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Inflamação no couro: quando conversar com profissional', 'Educacional — sem diagnóstico por quiz.', 'Sinais persistentes no couro', 'Avaliação e encaminhamento', 'custom', 'b1000183-0183-4000-8000-000000000183'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_inflamacao_couro_educativo", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 445, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000183-0183-4000-8000-000000000183');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Hormônios e cabelo (educativo)', 'Ciclo, gestação, menopausa — sem autodiagnóstico.', 'Mudança corporal e fio', 'Apoio capilar + saúde', 'custom', 'b1000184-0184-4000-8000-000000000184'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_hormonios_cabelo_educativo", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 446, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000184-0184-4000-8000-000000000184');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', '3 sinais de que o couro pede atenção', 'Check-in raiz — bom para stories e compartilhar.', 'Raiz negligenciada', 'Check-in e avaliacao', 'custom', 'b1000185-0185-4000-8000-000000000185'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_tres_sinais_atencao_couro", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 447, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000185-0185-4000-8000-000000000185');
