-- Terapia capilar — Bloco 2: TRANSFORMAÇÃO / PREVENÇÃO / PERFORMANCE (antes da dor grave).
-- Templates b1000161–b1000168. Mesmo padrão do bloco 1 (mig. 376): intro + 5 perguntas + minScore 12/9/5/0.
-- @see src/config/pro-estetica-capilar-biblioteca.ts

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000161-0161-4000-8000-000000000161',
    'quiz_capilar_potencial_crescimento',
    'diagnostico',
    $c161$
    {
      "title": "Seu cabelo está crescendo no ritmo que poderia?",
      "introTitle": "Comprimento, queda leve e rotina: será que o fio está \"segurando\" tudo que você pede?",
      "introSubtitle": "Cinco perguntas sobre hábitos e expectativa; na avaliação presencial a profissional alinha o que é genética, o que é rotina e o que terapia capilar melhora de verdade — sem promessa de centímetros garantidos.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Nas últimas semanas, você sente que o comprimento evolui?", "type": "single", "options": ["Sim, noto crescimento", "Um pouco", "Quase parado", "Não sei — só quero avaliar"]},
        {"id": "q2", "text": "Queda no pentear ou no banho (fora de fase aguda)?", "type": "single", "options": ["Pouca", "Moderada", "Alta", "Não percebo queda"]},
        {"id": "q3", "text": "Pontas duplas ou quebra no comprimento?", "type": "single", "options": ["Quase nada", "Leve", "Moderado", "Muito — corto e volta"]},
        {"id": "q4", "text": "Com que frequência você faz ajuste de pontas ou manutenção de comprimento?", "type": "single", "options": ["Regular (a cada 2–3 meses)", "Raro", "Só quando quebra muito", "Evito cortar"]},
        {"id": "q5", "text": "O que você quer ganhar com um plano capilar?", "type": "single", "options": ["Só dicas rápidas", "Rotina em casa que eu consiga manter", "Sessões no salão com calendário", "Entender limite realista + melhor versão do meu fio"]}
      ],
      "results": [
        {"id": "r4", "label": "Retenção de comprimento", "minScore": 12, "headline": "Muito do \"não cresce\" pode ser quebra disfarçada", "description": "Quando a quebra e as pontas pesam, o comprimento não aparece mesmo com raiz saudável. Na consulta dá para combinar corte de manutenção, fortalecimento e terapias que ajudem o fio a aguentar o comprimento."},
        {"id": "r3", "label": "Bom encaixe de plano", "minScore": 9, "headline": "Há espaço para otimizar rotina e salão juntos", "description": "Suas respostas pedem continuidade: o que fazer em casa entre uma sessão e outra. Leve o resultado no WhatsApp para a profissional sugerir ritmo e produtos sem exagero."},
        {"id": "r2", "label": "Exploratório", "minScore": 5, "headline": "Ainda dá para alinhar expectativa com a realidade do seu fio", "description": "Cabelo tem ritmo; comparar com redes sociais frustra. Uma conversa honesta ajuda a definir meta possível em 60 a 90 dias."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para primeira avaliação de comprimento", "description": "Com base no que você marcou, o próximo passo costuma ser revisar pontas, química recente e hidratação — para ver se o gargalo é retenção ou outra coisa."}
      ],
      "ctaDefault": "Quero avaliar meu potencial de crescimento",
      "resultIntro": "Seu resultado:"
    }
    $c161$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000162-0162-4000-8000-000000000162',
    'quiz_capilar_fortalecimento_preventivo',
    'diagnostico',
    $c162$
    {
      "title": "Fortalecimento dos fios: você está no preventivo ou só remendando?",
      "introTitle": "Fio fino ou sem vida: faz sentido fortalecer antes de nova química ou chapinha todo dia?",
      "introSubtitle": "Cinco perguntas sobre calor, química e tratamentos; na presencial a profissional monta fortalecimento em fases — força de fio combina hábito + continuidade, não milagre em uma sessão.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Hoje o seu foco é mais…", "type": "single", "options": ["Só manter como está", "Evitar piorar", "Recuperar o que perdi", "Preparar o fio para próximo processo"]},
        {"id": "q2", "text": "Calor (secador, chapinha, babyliss) na semana?", "type": "single", "options": ["Raramente", "1 a 2 vezes", "3 a 5 vezes", "Quase todo dia"]},
        {"id": "q3", "text": "Você intercala tratamento reconstrutor ou nutrição no salão?", "type": "single", "options": ["Sim, com regularidade", "Às vezes", "Raramente", "Nunca organizei isso"]},
        {"id": "q4", "text": "O fio quebra na escova ou elástico?", "type": "single", "options": ["Quase nunca", "Às vezes", "Frequentemente", "Tenho medo de pentear"]},
        {"id": "q5", "text": "Próximo passo desejado:", "type": "single", "options": ["Check-up simples", "Cronograma leve em casa", "Protocolo no salão + casa", "Plano antes de mudar cor ou forma"]}
      ],
      "results": [
        {"id": "r4", "label": "Fortalecimento prioritário", "minScore": 12, "headline": "O fio parece pedir pausa de agressão antes de mais estímulo", "description": "Calor frequente ou quebra alta pedem reconstrução e técnica de penteado. Na avaliação dá para definir o que entra já e o que espera — com transparência de prazo."},
        {"id": "r3", "label": "Preventivo ativo", "minScore": 9, "headline": "Você ainda está a tempo de evitar emergência", "description": "Suas respostas cabem em fortalecimento contínuo: menos atrito, produto certo e sessões espaçadas com objetivo. Bom perfil para combinar com a profissional no WhatsApp."},
        {"id": "r2", "label": "Ajuste de base", "minScore": 5, "headline": "Pequenas mudanças em casa costumam dar retorno rápido", "description": "Às vezes falta só finalização adequada ou reduzir uma etapa que pesa. Use o resultado para pedir uma lista simples na consulta."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom momento para conversa sobre fortalecimento", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar o que você faz em casa com o que faz sentido no salão — sem empilhar máscaras iguais."}
      ],
      "ctaDefault": "Quero fortalecer meus fios com plano",
      "resultIntro": "Seu resultado:"
    }
    $c162$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000163-0163-4000-8000-000000000163',
    'quiz_capilar_terapia_preventiva',
    'diagnostico',
    $c163$
    {
      "title": "Terapia capilar preventiva: faz sentido para a sua rotina agora?",
      "introTitle": "Ainda não é \"emergência\", mas você sente que o cabelo pede organização antes que piore?",
      "introSubtitle": "Cinco perguntas sobre histórico familiar, sol, química e estresse; na avaliação presencial a profissional indica frequência de sessões e foco — prevenção é constância, não luxo ocasional.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Na família, queda cedo ou couro sensível aparecem?", "type": "single", "options": ["Não sei", "Pouco", "Em alguns casos", "Sim, bem presente"]},
        {"id": "q2", "text": "Exposição a sol, piscina, mar ou cloro com frequência?", "type": "single", "options": ["Quase nunca", "Às vezes no verão", "Várias vezes no mês", "Trabalho ou esporte com exposição constante"]},
        {"id": "q3", "text": "Química ou coloração é parte da sua vida?", "type": "single", "options": ["Não", "Raro", "A cada poucos meses", "Quase sempre em manutenção"]},
        {"id": "q4", "text": "Estresse ou noite mal dormida nos últimos meses?", "type": "single", "options": ["Tranquilo", "Oscilante", "Alto em algumas semanas", "Alto há bastante tempo"]},
        {"id": "q5", "text": "O que \"prevenção\" significa para você?", "type": "single", "options": ["Ir ao salão quando lembrar", "Uma vez por mês sem meta", "Calendário com a profissional", "Combinar casa + salão com critério"]}
      ],
      "results": [
        {"id": "r4", "label": "Perfil preventivo forte", "minScore": 12, "headline": "Vários sinais pedem plano antes da crise", "description": "Histórico, sol ou química constante somam risco. Terapia preventiva costuma ser calendário claro + o que fazer entre sessões. Na consulta isso vira proposta realista."},
        {"id": "r3", "label": "Boa janela", "minScore": 9, "headline": "Agora é barato organizar; depois custa mais caro em tempo e fio", "description": "Suas respostas cabem em acompanhamento leve com metas de 30 em 30 dias. Leve o resultado para alinhar frequência e investimento sem pressão de fechar tudo de uma vez."},
        {"id": "r2", "label": "Ainda opcional", "minScore": 5, "headline": "Dá para começar com check-up e revisão de hábitos", "description": "Nem todo mundo precisa de pacote grande. Às vezes uma avaliação e dois ajustes já trazem segurança por meses."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre prevenção", "description": "Com base no que você marcou, o próximo passo costuma ser definir o que monitorar em casa até a próxima visita ao salão."}
      ],
      "ctaDefault": "Quero montar terapia capilar preventiva",
      "resultIntro": "Seu resultado:"
    }
    $c163$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000164-0164-4000-8000-000000000164',
    'quiz_capilar_saude_couro_checkin',
    'diagnostico',
    $c164$
    {
      "title": "Saúde do couro cabeludo: como está o seu hoje (mesmo sem coceira forte)?",
      "introTitle": "Couro equilibrado sustenta brilho e força: vale um check-in antes de focar só no comprimento?",
      "introSubtitle": "Cinco perguntas sobre sensação, lavagem e produtos; na presencial a profissional observa o que imagem e relato não mostram — quiz orienta conversa, não substitui exame.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Depois de lavar, o couro fica…", "type": "single", "options": ["Confortável até o próximo banho", "Oleoso cedo demais", "Repuxando ou seco", "Ardendo ou sensível às vezes"]},
        {"id": "q2", "text": "Você massageia o couro na lavagem ou só \"espuma e sai\"?", "type": "single", "options": ["Massageio com calma", "Depende do dia", "Rápido demais", "Evito encostar muito"]},
        {"id": "q3", "text": "Tônicos, exfoliantes ou \"pré-shampoo\" entram na rotina?", "type": "single", "options": ["Sim, com orientação", "Experimentei sozinha", "Quase nunca", "Não sei o que usar"]},
        {"id": "q4", "text": "Brilho e corpo na raiz (volume saudável) — como você percebe?", "type": "single", "options": ["Bom", "Médio", "Fraco", "Muito oleoso ou muito fino"]},
        {"id": "q5", "text": "O que você quer deste check-in?", "type": "single", "options": ["Só curiosidade", "Validar se minha rotina faz sentido", "Preparar próxima química com segurança", "Montar ritual de couro com a profissional"]}
      ],
      "results": [
        {"id": "r4", "label": "Couro merece foco", "minScore": 12, "headline": "Há sinais de desequilíbrio mesmo sem você chamar de \"doença\"", "description": "Oleosidade cedo, repuxar ou ardor pedem avaliação capilar direcionada ao couro. Na consulta dá para simplificar produtos e frequência — muitas vezes menos é mais."},
        {"id": "r3", "label": "Manutenção inteligente", "minScore": 9, "headline": "Pequenos ajustes no ritual de lavagem costumam abrir espaço para brilho", "description": "Suas respostas cabem em orientação de técnica e escolha de shampoo. Bom perfil para levar no WhatsApp e pedir sugestão de frequência de terapia de couro."},
        {"id": "r2", "label": "Estável com ressalvas", "minScore": 5, "headline": "Um acompanhamento de tempos em tempos já ajuda", "description": "Nem tudo precisa de protocolo pesado. Às vezes revisar a cada estação (verão, pós-praia) evita surpresa."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom ponto de partida para conversa sobre raiz", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar o que você sente ao toque com o que a profissional vê na lupa — figurando de forma simples."}
      ],
      "ctaDefault": "Quero check-up da saúde do meu couro",
      "resultIntro": "Seu resultado:"
    }
    $c164$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000165-0165-4000-8000-000000000165',
    'quiz_capilar_pos_quimica_recuperacao',
    'diagnostico',
    $c165$
    {
      "title": "Pós-química: como voltar a confiar no fio sem parar a cor ou o liso?",
      "introTitle": "Depois de luzes, progressiva ou coloração: será que sua rotina em casa sustenta o que o salão fez?",
      "introSubtitle": "Cinco perguntas sobre intervalo entre processos e sensação do fio; na presencial a profissional encaixa reconstrução e datas — recuperação é continuidade, não um banho de máscara único.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Seu último processo forte (luzes, descoloração, alisamento, progressiva) foi há…", "type": "single", "options": ["Não fiz recentemente", "Mais de 3 meses", "1 a 3 meses", "Menos de 1 mês"]},
        {"id": "q2", "text": "Em casa você mantém linha para cabelo químico (shampoo, máscara, leave-in)?", "type": "single", "options": ["Sim, indicada pela profissional", "Uso o que compro", "Misturo vários", "Quase nada específico"]},
        {"id": "q3", "text": "O fio está áspero, emborrachado ou quebrando mais que o normal?", "type": "single", "options": ["Não", "Leve", "Moderado", "Bastante"]},
        {"id": "q4", "text": "Próximo retoque ou novo processo está…", "type": "single", "options": ["Sem pressa", "Planejado daqui a semanas", "Já marquei", "Quero mudar visual logo"]},
        {"id": "q5", "text": "O que você mais quer desta fase?", "type": "single", "options": ["Só não piorar", "Brilho e maciez de volta", "Agendar recuperação entre um processo e outro", "Plano claro com a profissional"]}
      ],
      "results": [
        {"id": "r4", "label": "Recuperação em primeiro lugar", "minScore": 12, "headline": "Processo recente + fio reativo pedem sequência antes de novo choque", "description": "Empilhar química sem fase de nutrição/reconstrução costuma afinar o córtex. Na avaliação dá para combinar datas e produtos — com honestidade sobre o que dá para salvar no tempo que você tem."},
        {"id": "r3", "label": "Sincronizar salão e casa", "minScore": 9, "headline": "Dá para manter o visual com menos trauma diário", "description": "Suas respostas pedem alinhamento: o que a profissional aplica no salão precisa de par em casa. Leve o resultado no WhatsApp para fechar kit e frequência."},
        {"id": "r2", "label": "Ainda equilibrado", "minScore": 5, "headline": "Um ajuste de leave-in ou secagem pode fazer diferença", "description": "Às vezes o dano vem mais do calor diário do que da última tinta. Vale conversar sobre técnica e pausas."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa pós-química", "description": "Com base nas suas respostas, o próximo passo costuma ser revisar intervalo entre processos e o mínimo de cuidado em casa para não jogar o investimento do salão fora."}
      ],
      "ctaDefault": "Quero plano de recuperação pós-química",
      "resultIntro": "Seu resultado:"
    }
    $c165$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000166-0166-4000-8000-000000000166',
    'quiz_capilar_rotina_ideal_salao_casa',
    'diagnostico',
    $c166$
    {
      "title": "Rotina capilar: o que fazer em casa para o resultado do salão durar mais?",
      "introTitle": "Sessão boa no salão e em casa tudo diferente: será que falta um roteiro simples que você consiga cumprir?",
      "introSubtitle": "Cinco perguntas sobre tempo, produtos e frequência; na presencial a profissional fecha um roteiro por fases — rotina boa é a que entra na sua vida, não a do vídeo da internet.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Quanto tempo você consegue dedicar ao cabelo no banho (em média)?", "type": "single", "options": ["Menos de 5 min", "5 a 10 min", "10 a 20 min", "Mais de 20 min quando dá"]},
        {"id": "q2", "text": "Quantos passos você topa em casa (lavagem + hidratação + finalização)?", "type": "single", "options": ["O mínimo possível", "Até 2 passos", "Até 3 passos", "Topo protocolo maior se explicarem bem"]},
        {"id": "q3", "text": "Você repete o que a profissional indicou ou improvisa?", "type": "single", "options": ["Sigo a orientação", "Misturo com o que já tenho", "Esqueço metade", "Quase sempre improviso"]},
        {"id": "q4", "text": "Secagem natural ou secador?", "type": "single", "options": ["Quase sempre natural", "Secador no frio", "Secador quase sempre", "Chapinha ou babyliss quase sempre"]},
        {"id": "q5", "text": "O que mais te trava em casa?", "type": "single", "options": ["Falta de tempo", "Falta de produto certo", "Preguiça honesta", "Não sei a ordem dos passos"]}
      ],
      "results": [
        {"id": "r4", "label": "Roteiro sob medida", "minScore": 12, "headline": "Seu perfil pede poucos passos, mas certeiros", "description": "Rotina fraca em casa costuma apagar o efeito do salão. Na consulta dá para condensar em 2 ou 3 atos que você realmente faça — com produto e técnica alinhados ao seu tempo."},
        {"id": "r3", "label": "Ajuste fino", "minScore": 9, "headline": "Você já tem base; falta sincronizar com o que foi feito na cadeira", "description": "Suas respostas cabem em pequenas mudanças de ordem, temperatura do secador ou tipo de leave-in. Mande o resultado no WhatsApp para a profissional sugerir ajuste sem trocar tudo."},
        {"id": "r2", "label": "Exploratório", "minScore": 5, "headline": "Ainda dá para experimentar um roteiro curto por 21 dias", "description": "Hábito precisa de prazo curto e meta clara. Peça na consulta um \"teste de adesão\" antes de comprar linha inteira."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom começo de conversa sobre rotina", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar o que é essencial e o que é extra — para não desistir na primeira semana."}
      ],
      "ctaDefault": "Quero uma rotina capilar que eu consiga manter",
      "resultIntro": "Seu resultado:"
    }
    $c166$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000167-0167-4000-8000-000000000167',
    'quiz_capilar_detox_expectativa',
    'diagnostico',
    $c167$
    {
      "title": "Detox capilar: o que você espera limpar — e o que dá para fazer com segurança?",
      "introTitle": "Acúmulo de produto, oleosidade ou sensação de \"cabelo pesado\": detox resolve tudo ou precisa de critério?",
      "introSubtitle": "Cinco perguntas sobre limpeza, frequência e sensação; na presencial a profissional indica se faz sentido esfoliação, clarifying ou protocolo — detox não é sinônimo de agredir o couro.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "O que mais te incomoda hoje?", "type": "single", "options": ["Raiz oleosa com comprimento seco", "Cabelo sem movimento ou \"duro\"", "Coceira leve com peso no couro", "Só quero sensação de limpo"]},
        {"id": "q2", "text": "Você usa leave-in, óleo, cera ou finalizador com frequência?", "type": "single", "options": ["Quase nunca", "Alguns dias na semana", "Quase todo dia", "Várias camadas no mesmo dia"]},
        {"id": "q3", "text": "Já tentou shampoo \"antirresíduo\" ou detox em casa?", "type": "single", "options": ["Nunca", "Uma vez", "Várias vezes", "Uso sempre — e o couro reclama"]},
        {"id": "q4", "text": "Depois de lavar, o cabelo fica…", "type": "single", "options": ["Leve e solto", "Ainda pesado", "Ressecado demais", "Depende do shampoo"]},
        {"id": "q5", "text": "O que você espera de um detox no salão?", "type": "single", "options": ["Só sensação de limpeza", "Preparar para coloração", "Reduzir oleosidade de verdade", "Orientação do que fazer em casa depois"]}
      ],
      "results": [
        {"id": "r4", "label": "Detox com supervisão", "minScore": 12, "headline": "Acúmulo e sintomas no couro pedem avaliação antes de esfoliar em casa", "description": "Quando o couro já reagiu a produto forte, repetir \"detox\" pode piorar. Na consulta dá para separar o que é build-up do que é desequilíbrio — e propor protocolo seguro."},
        {"id": "r3", "label": "Boa candidatura", "minScore": 9, "headline": "Há espaço para limpeza profunda com intervalo certo", "description": "Suas respostas cabem em clarifying esporádico ou protocolo no salão + manutenção leve em casa. Leve o resultado para alinhar frequência."},
        {"id": "r2", "label": "Ajuste suave", "minScore": 5, "headline": "Às vezes basta mudar finalização, não o shampoo", "description": "Muito óleo e leave-in pesam sem ser \"sujeira\". Vale conversar sobre quantidade e aplicação só nas pontas."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre detox", "description": "Com base nas suas respostas, o próximo passo costuma ser definir o que você quer limpar de verdade — para não trocar um problema por outro."}
      ],
      "ctaDefault": "Quero saber se detox capilar faz sentido pra mim",
      "resultIntro": "Seu resultado:"
    }
    $c167$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000168-0168-4000-8000-000000000168',
    'quiz_capilar_saude_real_fios',
    'diagnostico',
    $c168$
    {
      "title": "Como está a saúde real dos seus fios (além do brilho do dia)?",
      "introTitle": "Brilho de finalizador esconde fio ressecado: vale um raio-x honesto antes de investir em mais produto?",
      "introSubtitle": "Cinco perguntas sobre elasticidade, pontas, química e calor; na avaliação presencial a profissional cruza o que você sente com o que o fio aguenta — saúde real é resistência no dia a dia, não só foto.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Molhado, o fio estica e volta fácil ou fica \"elástico demais\"?", "type": "single", "options": ["Volta normal", "Um pouco elástico", "Muito elástico ou emborrachado", "Não observo"]},
        {"id": "q2", "text": "Pontas: espigadas, finas ou espessura uniforme até o fim?", "type": "single", "options": ["Uniforme", "Leve diferença", "Pontas bem mais finas", "Preciso cortar direto"]},
        {"id": "q3", "text": "Brilho sem finalizador (só seco natural)?", "type": "single", "options": ["Ainda tem brilho", "Médio", "Opaco", "Só brilha com óleo ou spray"]},
        {"id": "q4", "text": "Últimos meses: química ou calor intenso?", "type": "single", "options": ["Nada forte", "Um processo", "Vários ou calor diário", "Os dois"]},
        {"id": "q5", "text": "O que você quer entender melhor?", "type": "single", "options": ["Se meu fio está \"saudável\"", "O que priorizar no cronograma", "Se posso fazer novo processo logo", "Como medir evolução em 60 dias"]}
      ],
      "results": [
        {"id": "r4", "label": "Fio pede recuperação", "minScore": 12, "headline": "Sinais de porosidade ou dano estrutural aparecem no seu relato", "description": "Elasticidade estranha, pontas muito finas e dependência de finalizador pedem plano de reconstrução/nutrição com pausa de agressão. Na consulta isso vira fases claras."},
        {"id": "r3", "label": "Manutenção de performance", "minScore": 9, "headline": "Dá para subir nível com cronograma e técnica", "description": "Seu fio não está em emergência, mas há margem para uniformizar textura e brilho natural. Bom perfil para combinar sessões espaçadas com rotina em casa."},
        {"id": "r2", "label": "Equilíbrio", "minScore": 5, "headline": "Um ajuste de corte ou de máscara pode refrescar o espelho", "description": "Às vezes o que falta é tirar peso das pontas ou trocar uma etapa do cronograma. Peça sugestão objetiva na avaliação."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre saúde do fio", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar o que é estética imediata e o que é estrutura — para investir no produto e no tratamento certos."}
      ],
      "ctaDefault": "Quero avaliar a saúde real dos meus fios",
      "resultIntro": "Seu resultado:"
    }
    $c168$::jsonb,
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
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Potencial de crescimento e retenção de comprimento', 'Hábitos, queda leve e pontas — expectativa realista.', 'Comprimento estagnado', 'Plano de crescimento saudável', 'custom', 'b1000161-0161-4000-8000-000000000161'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_potencial_crescimento", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 420, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000161-0161-4000-8000-000000000161');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Fortalecimento preventivo dos fios', 'Calor, química e quebra — antes da emergência.', 'Fio enfraquecendo', 'Fortalecimento contínuo', 'custom', 'b1000162-0162-4000-8000-000000000162'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_fortalecimento_preventivo", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 421, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000162-0162-4000-8000-000000000162');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Terapia capilar preventiva', 'Histórico, sol, química e estresse — constância.', 'Risco futuro sem crise hoje', 'Prevenção e calendário', 'custom', 'b1000163-0163-4000-8000-000000000163'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_terapia_preventiva", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 422, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000163-0163-4000-8000-000000000163');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Check-in: saúde do couro cabeludo', 'Lavagem, sensação e raiz — além da coceira forte.', 'Desequilíbrio leve do couro', 'Rotina de couro equilibrada', 'custom', 'b1000164-0164-4000-8000-000000000164'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_saude_couro_checkin", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 423, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000164-0164-4000-8000-000000000164');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Recuperação pós-química (com continuidade)', 'Intervalo entre processos e cuidado em casa.', 'Manter cor/liso sem destruir o fio', 'Recuperação faseada', 'custom', 'b1000165-0165-4000-8000-000000000165'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_pos_quimica_recuperacao", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 424, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000165-0165-4000-8000-000000000165');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Rotina em casa alinhada ao salão', 'Tempo, passos e adesão — roteiro realista.', 'Resultado do salão não dura', 'Rotina sustentável', 'custom', 'b1000166-0166-4000-8000-000000000166'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_rotina_ideal_salao_casa", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 425, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000166-0166-4000-8000-000000000166');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Detox capilar: expectativa e segurança', 'Acúmulo, oleosidade e frequência — sem agredir o couro.', 'Cabelo pesado ou confusão com detox', 'Detox adequado ao caso', 'custom', 'b1000167-0167-4000-8000-000000000167'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_detox_expectativa", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 426, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000167-0167-4000-8000-000000000167');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Saúde real dos fios (além do brilho do dia)', 'Elasticidade, pontas e dependência de finalizador.', 'Aparência vs estrutura do fio', 'Diagnóstico visual e tátil na consulta', 'custom', 'b1000168-0168-4000-8000-000000000168'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_saude_real_fios", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 427, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000168-0168-4000-8000-000000000168');
