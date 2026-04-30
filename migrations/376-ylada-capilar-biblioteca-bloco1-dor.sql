-- Terapia capilar — Bloco 1: fluxos de DOR / problema imediato (captação).
-- Templates b1000152–b1000160: capa introTitle/introSubtitle/introMicro (padrão mig. 353),
-- 5 perguntas, 4 faixas de resultado (minScore 12 / 9 / 5 / 0 — soma dos índices das opções 0–3).
-- Idempotente: ON CONFLICT em ylada_link_templates; INSERT … WHERE NOT EXISTS nos itens.
-- @see src/config/pro-estetica-capilar-biblioteca.ts

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000152-0152-4000-8000-000000000152',
    'quiz_capilar_alopecia_falhas',
    'diagnostico',
    $c152$
    {
      "title": "Falhas no cabelo ou entradas: o que você percebe hoje?",
      "introTitle": "Falhas ou entradas mais evidentes: vale organizar o que você sente antes de fechar qualquer tratamento?",
      "introSubtitle": "Cinco perguntas sobre tempo e rotina; na avaliação presencial a profissional encaixa o melhor caminho para o seu caso — sem promessa de resultado e sem diagnóstico médico por quiz.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Há quanto tempo você nota as falhas ou as entradas mais evidentes?", "type": "single", "options": ["Menos de 2 meses", "Entre 2 e 6 meses", "Entre 6 meses e 1 ano", "Há mais de 1 ano"]},
        {"id": "q2", "text": "O que mais te incomoda no dia a dia?", "type": "single", "options": ["Só quando olho com atenção", "Quando penteio ou prendo o cabelo", "Já me incomoda em fotos e vídeo", "Afeta minha confiança com frequência"]},
        {"id": "q3", "text": "Você já tentou algo sozinha (tônicos, trocas de shampoo, suplementos) sem acompanhamento capilar?", "type": "single", "options": ["Nada ainda", "Pouca coisa", "Várias tentativas", "Já gastei tempo e dinheiro sem clareza"]},
        {"id": "q4", "text": "Na sua família, há histórico de entradas ou rarefação capilar cedo?", "type": "single", "options": ["Não sei", "Não parece", "Em alguns parentes", "Sim, bem presente"]},
        {"id": "q5", "text": "O que você espera de um primeiro passo com uma profissional de terapia capilar?", "type": "single", "options": ["Só entender o que pode ser", "Orientação de rotina em casa", "Saber se meu caso pede avaliação mais ampla", "Plano claro com próximos passos realistas"]}
      ],
      "results": [
        {"id": "r4", "label": "Prioridade alta de conversa", "minScore": 12, "headline": "Seu relato pede clareza com calma e critério", "description": "Você junta tempo de evolução, impacto no dia a dia e tentativas sem direção. Isso é comum. Na avaliação presencial dá para separar o que é cuidado capilar estruturado do que precisa de outro tipo de avaliação — sempre com linguagem honesta e sem milagre."},
        {"id": "r3", "label": "Boa hora para avaliação guiada", "minScore": 9, "headline": "Já dá para ver um fio condutor", "description": "Há sinais de que um plano em etapas faz sentido: primeiro entender padrão e couro cabeludo, depois combinar terapias com intervalo seguro. Leve este resultado no WhatsApp para a profissional contextualizar sua chegada."},
        {"id": "r2", "label": "Ainda exploratório", "minScore": 5, "headline": "Um mapa simples ajuda antes de decidir", "description": "Você ainda está juntando informações — normal. Use o resultado para pedir uma conversa objetiva: o que observar em casa até a consulta e quais perguntas fazer no primeiro atendimento."},
        {"id": "r1", "label": "Entrada suave", "minScore": 0, "headline": "Bom momento para alinhar expectativa", "description": "Com base nas suas respostas, o próximo passo costuma ser uma avaliação que une o que você vê no espelho ao que a profissional observa no couro e nos fios — para montar continuidade com segurança."}
      ],
      "ctaDefault": "Quero falar no WhatsApp sobre falhas ou entradas",
      "resultIntro": "Seu resultado:"
    }
    $c152$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000153-0153-4000-8000-000000000153',
    'quiz_capilar_caspa_dermatite',
    'diagnostico',
    $c153$
    {
      "title": "Caspa, crostas ou coceira: o que está incomodando mais o seu couro?",
      "introTitle": "Caspa ou coceira que não melhora: será que sua rotina está mascarando o que o couro pede?",
      "introSubtitle": "Cinco perguntas sobre o que você sente no dia a dia; na presencial a profissional indica caminhos seguros e adequados — este quiz não substitui avaliação clínica quando houver suspeita de dermatite grave.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Com que frequência aparece caspa ou descamação visível?", "type": "single", "options": ["Quase nunca", "Em algumas semanas", "Na maior parte dos dias", "Quase sempre"]},
        {"id": "q2", "text": "A coceira atrapalha sono, trabalho ou concentração?", "type": "single", "options": ["Não coça", "Coça pouco", "Coça várias vezes ao dia", "Coça forte e frequentemente"]},
        {"id": "q3", "text": "Você nota vermelhidão, ardor ou sensação de \"couro apertado\"?", "type": "single", "options": ["Não", "Leve e rara", "Às vezes", "Com frequência"]},
        {"id": "q4", "text": "O que você costuma fazer quando piora?", "type": "single", "options": ["Só troco o shampoo", "Compro o que aparece na farmácia", "Já fui em especialista antes", "Evito tratar por medo de piorar"]},
        {"id": "q5", "text": "Há quanto tempo isso vem te incomodando?", "type": "single", "options": ["Menos de 1 mês", "1 a 3 meses", "3 a 12 meses", "Mais de 1 ano"]}
      ],
      "results": [
        {"id": "r4", "label": "Couro pede prioridade", "minScore": 12, "headline": "O desconforto parece central no seu relato", "description": "Quando coceira, descamação ou irritação aparecem com frequência, o melhor é não ficar trocando produto no escuro. Na avaliação capilar dá para organizar higiene, frequência e o que faz sentido como terapia — com honestidade sobre limites do automedicamento."},
        {"id": "r3", "label": "Há espaço para ajuste profissional", "minScore": 9, "headline": "Rotina e técnica de lavagem costumam contar muito", "description": "Suas respostas sugerem que pequenos erros de rotina ou produto errado podem manter o ciclo. Uma consulta orientada costuma trazer alívio mais rápido do que mais um frasco genérico."},
        {"id": "r2", "label": "Ainda dá para educar antes de tratar forte", "minScore": 5, "headline": "Um passo de cada vez costuma ser mais seguro", "description": "O quadro parece oscilar. Vale conversar sobre gatilhos (secador muito quente, química, estresse) e montar um plano leve antes de protocolos intensos."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para primeira conversa", "description": "Com base no que você marcou, o próximo passo costuma ser alinhar o que é couro cabeludo e o que é fio — para não misturar tratamentos que se anulam."}
      ],
      "ctaDefault": "Quero conversar sobre caspa ou coceira no couro",
      "resultIntro": "Seu resultado:"
    }
    $c153$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000154-0154-4000-8000-000000000154',
    'quiz_capilar_oleosidade_excesso',
    'diagnostico',
    $c154$
    {
      "title": "Oleosidade no couro ou nos fios: até onde isso te incomoda?",
      "introTitle": "Cabelo oleoso de novo no mesmo dia: será que a limpeza está ajudando ou apertando o ciclo?",
      "introSubtitle": "Cinco perguntas sobre lavagem, sensação e produtos; na avaliação presencial a profissional ajusta rotina e tratamentos com critério — sem promessa de \"fim da oleosidade\" da noite para o dia.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Em quanto tempo após lavar o couro já fica oleoso de novo?", "type": "single", "options": ["Só depois de vários dias", "No segundo dia", "No mesmo dia ainda seco", "Em poucas horas"]},
        {"id": "q2", "text": "Você lava com mais frequência para \"compensar\" a oleosidade?", "type": "single", "options": ["Não", "Um pouco mais", "Quase todo dia", "Várias vezes ao dia"]},
        {"id": "q3", "text": "Sente couro sensível, ardido ou repuxando depois da lavagem?", "type": "single", "options": ["Não", "Às vezes", "Frequentemente", "Quase sempre"]},
        {"id": "q4", "text": "Na raiz, você percebe cheiro forte, desconforto ou caspa junto com a oleosidade?", "type": "single", "options": ["Não", "Leve", "Moderado", "Bem presente"]},
        {"id": "q5", "text": "O que você mais quer resolver primeiro?", "type": "single", "options": ["Só melhorar a aparência", "Conseguir espaçar a lavagem", "Parar de sentir repuxar ou coceira", "Entender se o problema é couro, fio ou os dois"]}
      ],
      "results": [
        {"id": "r4", "label": "Ciclo apertado", "minScore": 12, "headline": "Parece que o couro está em alerta constante", "description": "Lavar demais com produto agressivo costuma manter a oleosidade e ainda sensibilizar. Na consulta dá para desenhar limpeza respeitosa e tratamentos que equilibram — sem guerra contra o seu couro cabeludo."},
        {"id": "r3", "label": "Ajuste fino de rotina", "minScore": 9, "headline": "Há margem para melhorar com técnica e produto certos", "description": "Suas respostas apontam que frequência e escolha de shampoo/máscara fazem diferença. Um plano capilar costuma trazer alívio mais rápido do que trocar de marca por impulso."},
        {"id": "r2", "label": "Exploratório", "minScore": 5, "headline": "Vale separar oleosidade \"normal\" de sinal de desequilíbrio", "description": "Às vezes o que parece oleosidade pura mistura ressecamento ou acúmulo de produto. A avaliação presencial ajuda a nomear o que está acontecendo."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom ponto de partida para conversa", "description": "Com base nas suas respostas, o próximo passo costuma ser revisar lavagem, finalização e o que você usa na raiz — com orientação profissional."}
      ],
      "ctaDefault": "Quero ajuda com oleosidade no couro ou nos fios",
      "resultIntro": "Seu resultado:"
    }
    $c154$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000155-0155-4000-8000-000000000155',
    'quiz_capilar_fracos_quebradicos',
    'diagnostico',
    $c155$
    {
      "title": "Fios fracos ou quebradiços: onde está o maior estrago?",
      "introTitle": "Pontas espigadas, quebra na escova ou fio fino: será que sua rotina está fortalecendo ou só \"embelando\"?",
      "introSubtitle": "Cinco perguntas sobre química, calor e quebra; na presencial a profissional propõe fortalecimento e continuidade com expectativa realista — fio saudável exige tempo e critério.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "A quebra aparece mais…", "type": "single", "options": ["Nas pontas", "No comprimento", "Na raiz junto com queda", "Em tudo ao mesmo tempo"]},
        {"id": "q2", "text": "Nos últimos 6 meses você fez química (coloração, descoloração, alisamento, progressiva)?", "type": "single", "options": ["Não", "Uma vez leve", "Mais de uma ou processo forte", "Estou sempre retocando"]},
        {"id": "q3", "text": "Secador, chapinha ou babyliss entram na rotina?", "type": "single", "options": ["Quase nunca", "Às vezes", "Várias vezes por semana", "Quase todo dia"]},
        {"id": "q4", "text": "Ao pentear, quantos fios quebrados você percebe?", "type": "single", "options": ["Poucos", "Moderado", "Muitos", "Tenho medo de pentear"]},
        {"id": "q5", "text": "O que você mais quer recuperar?", "type": "single", "options": ["Só aparência", "Resistência ao pentear", "Menos queda junto com quebra", "Um plano claro de fortalecimento"]}
      ],
      "results": [
        {"id": "r4", "label": "Cuidado urgente de rotina", "minScore": 12, "headline": "Química ou calor parecem pesar no seu relato", "description": "Quando quebra e processo químico andam juntos, o risco é ir afinando o fio sem perceber. Na avaliação dá para pausar o que agride e entrar com fortalecimento em fases — sempre com transparência sobre prazo."},
        {"id": "r3", "label": "Plano em camadas", "minScore": 9, "headline": "Dá para fortalecer sem parar a vida", "description": "Há espaço para ajustar térmico, frequência de química e tratamentos no salão. Leve este resultado para a profissional montar prioridade: o que entra primeiro no seu bolso e na sua agenda."},
        {"id": "r2", "label": "Ainda equilibrando", "minScore": 5, "headline": "Um foco por vez costuma render mais", "description": "Quebra nas pontas com pouco calor costuma pedir hidratação e corte de manutenção; quebra no comprimento pede revisão de penteado e produto. A consulta ajuda a não misturar tudo."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar o que é quebra mecânica e o que é fragilidade do fio — para escolher tratamento certo."}
      ],
      "ctaDefault": "Quero fortalecer fios fracos ou quebradiços",
      "resultIntro": "Seu resultado:"
    }
    $c155$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000156-0156-4000-8000-000000000156',
    'quiz_capilar_crescimento_lento',
    'diagnostico',
    $c156$
    {
      "title": "Crescimento capilar lento: expectativa realista ou sinal de travas?",
      "introTitle": "Seu cabelo demora a crescer ou \"para no mesmo tamanho\": será que o foco certo é raiz, fio ou rotina?",
      "introSubtitle": "Cinco perguntas sobre comprimento, queda e hábitos; na avaliação presencial a profissional explica o que é mitado e o que dá para melhorar com continuidade — sem promessa de centímetros garantidos.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Há quanto tempo você sente que o comprimento estagnou?", "type": "single", "options": ["Menos de 3 meses", "3 a 6 meses", "6 a 12 meses", "Mais de 1 ano"]},
        {"id": "q2", "text": "Você percebe queda junto com a sensação de que não cresce?", "type": "single", "options": ["Não", "Leve", "Moderada", "Forte"]},
        {"id": "q3", "text": "Pontas duplas, ressecamento ou quebra no comprimento?", "type": "single", "options": ["Quase nada", "Leve", "Moderado", "Muito — preciso cortar direto"]},
        {"id": "q4", "text": "Estresse, noite mal dormida ou mudança de peso nos últimos meses?", "type": "single", "options": ["Nada disso", "Um pouco", "Moderado", "Bastante"]},
        {"id": "q5", "text": "O que você espera de um acompanhamento capilar?", "type": "single", "options": ["Só dicas rápidas", "Rotina em casa clara", "Terapias no salão com calendário", "Entender raiz, fio e expectativa real"]}
      ],
      "results": [
        {"id": "r4", "label": "Várias frentes", "minScore": 12, "headline": "Crescimento pede olhar para o conjunto", "description": "Queda, quebra e estresse no mesmo quadro confundem a leitura em casa. Na consulta dá para separar o que é retenção de comprimento por quebra do que merece outro olhar — com linguagem clara e sem milagre."},
        {"id": "r3", "label": "Foco em retenção de comprimento", "minScore": 9, "headline": "Muitas vezes \"não cresce\" é quebra disfarçada", "description": "Fortalecer fio e reduzir quebra costuma aparecer como comprimento novo no espelho. Um plano capilar ajuda a medir isso com critério."},
        {"id": "r2", "label": "Exploratório", "minScore": 5, "headline": "Ainda dá para alinhar expectativa", "description": "Cabelo tem ritmo; comparar com internet gera frustração. Use o resultado para pedir uma conversa honesta sobre o que muda com tratamento e o que depende de genética e saúde geral."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom começo de conversa", "description": "Com base nas suas respostas, o próximo passo costuma ser revisar pontas, frequência de corte e cuidado na raiz — com um plano que você consiga manter."}
      ],
      "ctaDefault": "Quero entender meu crescimento capilar",
      "resultIntro": "Seu resultado:"
    }
    $c156$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000157-0157-4000-8000-000000000157',
    'quiz_capilar_pos_parto_hormonal',
    'diagnostico',
    $c157$
    {
      "title": "Mudança hormonal ou pós-parto: seu cabelo mudou junto?",
      "introTitle": "Depois de bebê ou mudança hormonal o cabelo caiu ou ficou diferente: vale nomear o que você percebe antes da consulta?",
      "introSubtitle": "Cinco perguntas sobre tempo e sintomas; na presencial a profissional encaixa terapia capilar e indica quando faz sentido buscar avaliação médica — este quiz não substitui acompanhamento de saúde.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Há quanto tempo começou a mudança perceptível no cabelo?", "type": "single", "options": ["Menos de 6 semanas", "6 semanas a 3 meses", "3 a 9 meses", "Mais de 9 meses"]},
        {"id": "q2", "text": "A queda vem em fios cheios (tipo \"tufos\") ou espalhada?", "type": "single", "options": ["Não notei queda forte", "Espalhada ao pentear", "Tufos no banho ou travesseiro", "Os dois"]},
        {"id": "q3", "text": "Textura ou volume do fio mudou (mais fino, sem vida, oleoso demais ou seco demais)?", "type": "single", "options": ["Quase nada", "Leve", "Moderado", "Muito"]},
        {"id": "q4", "text": "Você já conversou com profissional de saúde sobre hormônios, tireoide ou anemia?", "type": "single", "options": ["Não", "Só com terapeuta capilar", "Já fiz exames recentes", "Preciso marcar isso"]},
        {"id": "q5", "text": "O que você mais precisa agora?", "type": "single", "options": ["Só acalmar a ansiedade com informação", "Rotina gentil em casa", "Terapia capilar no salão", "Entender se é fase ou precisa de outro olhar"]}
      ],
      "results": [
        {"id": "r4", "label": "Atenção redobrada", "minScore": 12, "headline": "Seu relato mistura tempo, volume e possível sinal de saúde", "description": "Queda intensa com outros sintomas merece calma e critério. A terapia capilar ajuda no cuidado do couro e dos fios; em paralelo, pode fazer sentido alinhar com saúde geral quando a profissional indicar. Nada de culpa — só organização."},
        {"id": "r3", "label": "Fase comum, acompanhada", "minScore": 9, "headline": "Muitas mudanças hormonais refletem no cabelo com atraso", "description": "O que você descreve costuma conversar bem com suporte capilar + rotina realista. Na consulta dá para combinar frequência de sessões e o que fazer em casa sem sobrecarregar."},
        {"id": "r2", "label": "Ainda observando", "minScore": 5, "headline": "Vale registrar o que mudou mês a mês", "description": "Às vezes o pior passa sozinho; às vezes o couro pede ajuda. Use o resultado para pedir um plano leve e revisão em 30 a 60 dias."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para primeira conversa", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar expectativa de fase com o que dá para tratar no salão com segurança e carinho."}
      ],
      "ctaDefault": "Quero conversar sobre cabelo pós-parto ou hormonal",
      "resultIntro": "Seu resultado:"
    }
    $c157$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000158-0158-4000-8000-000000000158',
    'quiz_capilar_estresse_queda',
    'diagnostico',
    $c158$
    {
      "title": "Estresse e queda: será que seu corpo está \"avisando\" pelo cabelo?",
      "introTitle": "Fase estressante e cabelo no ralo: vale separar o que é ciclo do que pede plano capilar?",
      "introSubtitle": "Cinco perguntas sobre sono, rotina e queda; na avaliação presencial a profissional orienta cuidado do fio e do couro — sem substituir apoio em saúde mental ou médica quando necessário.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Em uma semana típica, como está seu sono?", "type": "single", "options": ["Regular ou bom", "Curto mas recupero", "Ruim várias noites", "Muito ruim há semanas"]},
        {"id": "q2", "text": "A queda piorou depois de um evento claro (prova, luto, mudança de emprego, doença na família)?", "type": "single", "options": ["Não relaciono", "Talvez", "Sim, com poucos meses de diferença", "Sim, bem na mesma época"]},
        {"id": "q3", "text": "Você percebe enfraquecimento dos fios ou só mais fios caindo?", "type": "single", "options": ["Só volume de queda", "Fios mais finos", "Os dois", "Não sei dizer"]},
        {"id": "q4", "text": "Há quanto tempo a queda está mais evidente?", "type": "single", "options": ["Menos de 1 mês", "1 a 3 meses", "3 a 6 meses", "Mais de 6 meses"]},
        {"id": "q5", "text": "O que você espera de um primeiro contato com a clínica?", "type": "single", "options": ["Só entender se é \"normal\"", "Dicas de rotina para diminuir queda", "Terapia capilar e acompanhamento", "Orientação honesta sobre próximos passos"]}
      ],
      "results": [
        {"id": "r4", "label": "Sobrecarga visível", "minScore": 12, "headline": "Estresse e queda aparecem ligados no seu relato", "description": "Quando o sono vai embora e a queda acompanha, o melhor é tratar o cabelo com gentileza e buscar apoio amplo se precisar. Na terapia capilar você organiza couro e fio para não agravar com produto errado ou excesso de calor."},
        {"id": "r3", "label": "Janela de cuidado", "minScore": 9, "headline": "Fase difícil, mas dá para não deixar o fio no abandono", "description": "Suas respostas cabem em um plano que respeita seu ritmo: menos agressão mecânica, hidratação adequada e sessões que acalmam o couro. Leve isso no WhatsApp para contextualizar."},
        {"id": "r2", "label": "Ainda incerto", "minScore": 5, "headline": "Vale observar mais um ciclo com critério", "description": "Queda pode ter várias causas ao mesmo tempo. Uma consulta ajuda a listar o que observar em casa até a próxima avaliação."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom começo de conversa", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar rotina leve com o que a profissional vê no couro e na densidade — sempre com honestidade."}
      ],
      "ctaDefault": "Quero falar sobre estresse e queda de cabelo",
      "resultIntro": "Seu resultado:"
    }
    $c158$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000159-0159-4000-8000-000000000159',
    'quiz_capilar_danos_quimicos',
    'diagnostico',
    $c159$
    {
      "title": "Química no cabelo: será que o fio ainda aguenta do jeito que você trata hoje?",
      "introTitle": "Luzes, coloração ou alisamento: seu fio está pedindo pausa ou reconstrução antes do próximo passo?",
      "introSubtitle": "Cinco perguntas sobre frequência de química e sensação do fio; na presencial a profissional monta continuidade segura — sem prometer recuperação instantânea.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Nos últimos 4 meses, o que você fez no cabelo?", "type": "single", "options": ["Nada de química forte", "Só raiz ou tonalização", "Luzes ou mechas", "Mais de um processo forte"]},
        {"id": "q2", "text": "O fio está elástico, emborrachado ou quebrando na escova?", "type": "single", "options": ["Não", "Leve", "Moderado", "Muito"]},
        {"id": "q3", "text": "A cor ou o liso \"não seguram\" como antes?", "type": "single", "options": ["Seguram bem", "Um pouco menos", "Desbotam ou saem rápido", "Muito rápido"]},
        {"id": "q4", "text": "Você intercala tratamento no salão com cuidado em casa?", "type": "single", "options": ["Sim, com regularidade", "Às vezes", "Raramente", "Quase nunca"]},
        {"id": "q5", "text": "Próximo passo desejado:", "type": "single", "options": ["Só recuperar saúde", "Manter cor/luzes com menos dano", "Mudar de visual com segurança", "Não sei — preciso de orientação"]}
      ],
      "results": [
        {"id": "r4", "label": "Freio técnico", "minScore": 12, "headline": "O fio parece saturado de processo", "description": "Empilhar química sem fase de recuperação costuma finar e quebrar. Na avaliação dá para combinar pausa, reconstrução e só depois novo desejo de cor ou forma — com transparência total."},
        {"id": "r3", "label": "Recuperação em fases", "minScore": 9, "headline": "Dá para alinhar beleza e saúde do fio", "description": "Suas respostas pedem cronograma e talvez espaçar retouches. Um plano capilar ajuda a manter o visual sem sacrificar o couro e o córtex."},
        {"id": "r2", "label": "Ajuste de rotina", "minScore": 5, "headline": "Ainda dá para educar antes de novo processo", "description": "Reforçar em casa o que se faz no salão costuma segurar cor e textura. Use o resultado para pedir lista simples de produtos e frequência."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa", "description": "Com base nas suas respostas, o próximo passo costuma ser revisar histórico de química e definir o que é prioridade agora — brilho, resistência ou novo visual."}
      ],
      "ctaDefault": "Quero recuperar fio danificado por química",
      "resultIntro": "Seu resultado:"
    }
    $c159$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000160-0160-4000-8000-000000000160',
    'quiz_capilar_couro_sensivel_inflamacao',
    'diagnostico',
    $c160$
    {
      "title": "Couro cabeludo sensível ou \"ardendo\": o que está acontecendo com mais frequência?",
      "introTitle": "Sensação de couro quente, ardido ou sensível ao toque: vale mapear antes de sair trocando de shampoo?",
      "introSubtitle": "Cinco perguntas sobre sintomas e produtos; na avaliação presencial a profissional indica cuidados suaves e quando encaminhar para dermatologista — sem diagnóstico por mensagem.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Ardor, calor ou dor no couro aparecem…", "type": "single", "options": ["Quase nunca", "Só depois de algum produto", "Várias vezes por semana", "Quase sempre"]},
        {"id": "q2", "text": "Vermelhidão ou pontos sensíveis visíveis?", "type": "single", "options": ["Não", "Leve", "Moderado", "Bem evidente"]},
        {"id": "q3", "text": "Recentemente usou tintura, descoloração ou loção forte no couro?", "type": "single", "options": ["Não", "Há mais de 2 meses", "Nas últimas semanas", "Sim, e desde então piorou"]},
        {"id": "q4", "text": "Coceira ou descamação vêm junto com a sensibilidade?", "type": "single", "options": ["Não", "Às vezes", "Frequentemente", "Sempre juntos"]},
        {"id": "q5", "text": "O que você mais quer na primeira conversa?", "type": "single", "options": ["Saber se é grave", "Lista do que evitar em casa", "Terapia capilar calmante", "Orientação se preciso ir ao dermatologista"]}
      ],
      "results": [
        {"id": "r4", "label": "Sinal de pausa", "minScore": 12, "headline": "Seu couro parece reativo demais para \"testar\" produto em casa", "description": "Ardor forte com vermelhidão ou piora pós-química pede cuidado imediato e, em muitos casos, avaliação médica. A terapia capilar entra para apoiar o que for seguro — sem competir com dermatologia."},
        {"id": "r3", "label": "Protocolo suave", "minScore": 9, "headline": "Dá para acalmar com rotina e sessões específicas", "description": "Suas respostas cabem em limpeza gentil, menos atrito na toalha e tratamentos que respeitam a barreira do couro. Na consulta isso vira plano fechado."},
        {"id": "r2", "label": "Investigar gatilhos", "minScore": 5, "headline": "Às vezes o culpado é combinação de produtos", "description": "Frasco novo + sol + suor podem irritar sem ser \"alergia grave\". Vale anotar o que mudou na semana da crise e levar na conversa."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para primeira conversa", "description": "Com base nas suas respostas, o próximo passo costuma ser revisar o que encosta no couro (shampoo, tônico, secagem) e definir terapia calmante com critério."}
      ],
      "ctaDefault": "Quero ajuda com couro sensível ou irritado",
      "resultIntro": "Seu resultado:"
    }
    $c160$::jsonb,
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
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Falhas ou entradas: o que você percebe hoje?', 'Mapeia tempo, impacto e expectativa antes da avaliação capilar.', 'Alopecia ou falhas visíveis', 'Clarear próximo passo sem promessa', 'custom', 'b1000152-0152-4000-8000-000000000152'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_alopecia_falhas", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 410, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000152-0152-4000-8000-000000000152');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Caspa, crostas ou coceira no couro', 'Organiza sintomas e rotina antes da consulta.', 'Caspa ou dermatite percebida', 'Rotina e terapia seguras', 'custom', 'b1000153-0153-4000-8000-000000000153'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_caspa_dermatite", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 411, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000153-0153-4000-8000-000000000153');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Oleosidade que volta rápido demais', 'Lavagem, produtos e sensação do couro em cinco perguntas.', 'Oleosidade excessiva', 'Equilibrar couro e rotina', 'custom', 'b1000154-0154-4000-8000-000000000154'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_oleosidade_excesso", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 412, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000154-0154-4000-8000-000000000154');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Fios fracos ou quebradiços', 'Química, calor e quebra — perfil para fortalecimento.', 'Fragilidade e quebra', 'Plano de fortalecimento', 'custom', 'b1000155-0155-4000-8000-000000000155'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_fracos_quebradicos", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 413, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000155-0155-4000-8000-000000000155');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Crescimento lento ou comprimento parado', 'Queda, quebra e expectativa — linguagem realista.', 'Crescimento lento', 'Retenção de comprimento e plano', 'custom', 'b1000156-0156-4000-8000-000000000156'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_crescimento_lento", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 414, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000156-0156-4000-8000-000000000156');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Pós-parto ou mudança hormonal no cabelo', 'Tempo, queda e textura — com respeito à fase.', 'Mudança hormonal / pós-parto', 'Acompanhamento capilar seguro', 'custom', 'b1000157-0157-4000-8000-000000000157'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_pos_parto_hormonal", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 415, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000157-0157-4000-8000-000000000157');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Estresse e queda de cabelo', 'Sono, evento e intensidade — contexto para o WhatsApp.', 'Estresse e queda', 'Acalmar rotina e orientar', 'custom', 'b1000158-0158-4000-8000-000000000158'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_estresse_queda", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 416, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000158-0158-4000-8000-000000000158');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Danos de química no cabelo', 'Frequência de processos e estado do fio.', 'Danos químicos', 'Recuperação faseada', 'custom', 'b1000159-0159-4000-8000-000000000159'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_danos_quimicos", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 417, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000159-0159-4000-8000-000000000159');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Couro sensível, ardor ou inflamação leve', 'Sintomas, produtos e química recente.', 'Sensibilidade do couro cabeludo', 'Protocolo suave e encaminhamento', 'custom', 'b1000160-0160-4000-8000-000000000160'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_couro_sensivel_inflamacao", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 418, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000160-0160-4000-8000-000000000160');
