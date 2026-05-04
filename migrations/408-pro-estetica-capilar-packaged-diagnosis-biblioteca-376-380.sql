-- Pro Estética Capilar — lote 2 (único): biblioteca mig. 376–380 (b1000152–191).
-- RISK_DIAGNOSIS × leve | moderado | urgente × diagnosis_vertical = capilar.
-- Tom: avaliação presencial; sem promessa nem diagnóstico médico.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical = 'capilar'
  AND template_id IN (
    'b1000152-0152-4000-8000-000000000152'::uuid,
    'b1000153-0153-4000-8000-000000000153'::uuid,
    'b1000154-0154-4000-8000-000000000154'::uuid,
    'b1000155-0155-4000-8000-000000000155'::uuid,
    'b1000156-0156-4000-8000-000000000156'::uuid,
    'b1000157-0157-4000-8000-000000000157'::uuid,
    'b1000158-0158-4000-8000-000000000158'::uuid,
    'b1000159-0159-4000-8000-000000000159'::uuid,
    'b1000160-0160-4000-8000-000000000160'::uuid,
    'b1000161-0161-4000-8000-000000000161'::uuid,
    'b1000162-0162-4000-8000-000000000162'::uuid,
    'b1000163-0163-4000-8000-000000000163'::uuid,
    'b1000164-0164-4000-8000-000000000164'::uuid,
    'b1000165-0165-4000-8000-000000000165'::uuid,
    'b1000166-0166-4000-8000-000000000166'::uuid,
    'b1000167-0167-4000-8000-000000000167'::uuid,
    'b1000168-0168-4000-8000-000000000168'::uuid,
    'b1000169-0169-4000-8000-000000000169'::uuid,
    'b1000170-0170-4000-8000-000000000170'::uuid,
    'b1000171-0171-4000-8000-000000000171'::uuid,
    'b1000172-0172-4000-8000-000000000172'::uuid,
    'b1000173-0173-4000-8000-000000000173'::uuid,
    'b1000174-0174-4000-8000-000000000174'::uuid,
    'b1000175-0175-4000-8000-000000000175'::uuid,
    'b1000176-0176-4000-8000-000000000176'::uuid,
    'b1000177-0177-4000-8000-000000000177'::uuid,
    'b1000178-0178-4000-8000-000000000178'::uuid,
    'b1000179-0179-4000-8000-000000000179'::uuid,
    'b1000180-0180-4000-8000-000000000180'::uuid,
    'b1000181-0181-4000-8000-000000000181'::uuid,
    'b1000182-0182-4000-8000-000000000182'::uuid,
    'b1000183-0183-4000-8000-000000000183'::uuid,
    'b1000184-0184-4000-8000-000000000184'::uuid,
    'b1000185-0185-4000-8000-000000000185'::uuid,
    'b1000186-0186-4000-8000-000000000186'::uuid,
    'b1000187-0187-4000-8000-000000000187'::uuid,
    'b1000188-0188-4000-8000-000000000188'::uuid,
    'b1000189-0189-4000-8000-000000000189'::uuid,
    'b1000190-0190-4000-8000-000000000190'::uuid,
    'b1000191-0191-4000-8000-000000000191'::uuid
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (template_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  (
    'b1000152-0152-4000-8000-000000000152',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Falhas ou entradas — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre falhas ou entradas no cabelo. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre falhas ou entradas no cabelo antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre falhas ou entradas no cabelo.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (falhas entradas)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre falhas ou entradas no cabelo. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000152-0152-4000-8000-000000000152',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Falhas ou entradas — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que falhas ou entradas no cabelo já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — falhas entradas',
      'whatsapp_prefill', 'Oi! O quiz sobre falhas ou entradas no cabelo saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000152-0152-4000-8000-000000000152',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Falhas ou entradas — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em falhas ou entradas no cabelo. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — falhas entradas',
      'whatsapp_prefill', 'Oi! O questionário sobre falhas ou entradas no cabelo saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000153-0153-4000-8000-000000000153',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Caspa, crostas ou coceira — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre caspa, crostas ou coceira no couro. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre caspa, crostas ou coceira no couro antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre caspa, crostas ou coceira no couro.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (caspa coceira)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre caspa, crostas ou coceira no couro. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000153-0153-4000-8000-000000000153',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Caspa, crostas ou coceira — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que caspa, crostas ou coceira no couro já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — caspa coceira',
      'whatsapp_prefill', 'Oi! O quiz sobre caspa, crostas ou coceira no couro saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000153-0153-4000-8000-000000000153',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Caspa, crostas ou coceira — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em caspa, crostas ou coceira no couro. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — caspa coceira',
      'whatsapp_prefill', 'Oi! O questionário sobre caspa, crostas ou coceira no couro saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000154-0154-4000-8000-000000000154',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Oleosidade que volta rápido — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre oleosidade que volta rápido demais. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre oleosidade que volta rápido demais antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre oleosidade que volta rápido demais.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (oleosidade)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre oleosidade que volta rápido demais. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000154-0154-4000-8000-000000000154',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Oleosidade que volta rápido — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que oleosidade que volta rápido demais já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — oleosidade',
      'whatsapp_prefill', 'Oi! O quiz sobre oleosidade que volta rápido demais saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000154-0154-4000-8000-000000000154',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Oleosidade que volta rápido — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em oleosidade que volta rápido demais. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — oleosidade',
      'whatsapp_prefill', 'Oi! O questionário sobre oleosidade que volta rápido demais saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000155-0155-4000-8000-000000000155',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Fios fracos ou quebradiços — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre fios fracos, quebradiços ou quebra. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre fios fracos, quebradiços ou quebra antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre fios fracos, quebradiços ou quebra.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (fios fracos)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre fios fracos, quebradiços ou quebra. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000155-0155-4000-8000-000000000155',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Fios fracos ou quebradiços — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que fios fracos, quebradiços ou quebra já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — fios fracos',
      'whatsapp_prefill', 'Oi! O quiz sobre fios fracos, quebradiços ou quebra saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000155-0155-4000-8000-000000000155',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Fios fracos ou quebradiços — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em fios fracos, quebradiços ou quebra. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — fios fracos',
      'whatsapp_prefill', 'Oi! O questionário sobre fios fracos, quebradiços ou quebra saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000156-0156-4000-8000-000000000156',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Crescimento lento ou comprimento parado — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre crescimento lento ou comprimento parado. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre crescimento lento ou comprimento parado antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre crescimento lento ou comprimento parado.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (crescimento comprimento)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre crescimento lento ou comprimento parado. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000156-0156-4000-8000-000000000156',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Crescimento lento ou comprimento parado — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que crescimento lento ou comprimento parado já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — crescimento comprimento',
      'whatsapp_prefill', 'Oi! O quiz sobre crescimento lento ou comprimento parado saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000156-0156-4000-8000-000000000156',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Crescimento lento ou comprimento parado — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em crescimento lento ou comprimento parado. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — crescimento comprimento',
      'whatsapp_prefill', 'Oi! O questionário sobre crescimento lento ou comprimento parado saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000157-0157-4000-8000-000000000157',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Pós-parto ou mudança hormonal — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre pós-parto ou mudança hormonal no cabelo. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre pós-parto ou mudança hormonal no cabelo antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre pós-parto ou mudança hormonal no cabelo.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (hormonal pos parto)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre pós-parto ou mudança hormonal no cabelo. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000157-0157-4000-8000-000000000157',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Pós-parto ou mudança hormonal — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que pós-parto ou mudança hormonal no cabelo já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — hormonal pos parto',
      'whatsapp_prefill', 'Oi! O quiz sobre pós-parto ou mudança hormonal no cabelo saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000157-0157-4000-8000-000000000157',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Pós-parto ou mudança hormonal — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em pós-parto ou mudança hormonal no cabelo. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — hormonal pos parto',
      'whatsapp_prefill', 'Oi! O questionário sobre pós-parto ou mudança hormonal no cabelo saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000158-0158-4000-8000-000000000158',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Estresse e queda — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre estresse e queda de cabelo. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre estresse e queda de cabelo antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre estresse e queda de cabelo.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (estresse queda)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre estresse e queda de cabelo. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000158-0158-4000-8000-000000000158',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Estresse e queda — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que estresse e queda de cabelo já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — estresse queda',
      'whatsapp_prefill', 'Oi! O quiz sobre estresse e queda de cabelo saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000158-0158-4000-8000-000000000158',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Estresse e queda — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em estresse e queda de cabelo. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — estresse queda',
      'whatsapp_prefill', 'Oi! O questionário sobre estresse e queda de cabelo saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000159-0159-4000-8000-000000000159',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Danos de química — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre danos de química no cabelo. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre danos de química no cabelo antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre danos de química no cabelo.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (danos quimicos)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre danos de química no cabelo. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000159-0159-4000-8000-000000000159',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Danos de química — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que danos de química no cabelo já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — danos quimicos',
      'whatsapp_prefill', 'Oi! O quiz sobre danos de química no cabelo saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000159-0159-4000-8000-000000000159',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Danos de química — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em danos de química no cabelo. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — danos quimicos',
      'whatsapp_prefill', 'Oi! O questionário sobre danos de química no cabelo saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000160-0160-4000-8000-000000000160',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Couro sensível ou inflamação leve — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre couro sensível, ardor ou inflamação leve. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre couro sensível, ardor ou inflamação leve antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre couro sensível, ardor ou inflamação leve.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (couro sensivel)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre couro sensível, ardor ou inflamação leve. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000160-0160-4000-8000-000000000160',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Couro sensível ou inflamação leve — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que couro sensível, ardor ou inflamação leve já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — couro sensivel',
      'whatsapp_prefill', 'Oi! O quiz sobre couro sensível, ardor ou inflamação leve saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000160-0160-4000-8000-000000000160',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Couro sensível ou inflamação leve — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em couro sensível, ardor ou inflamação leve. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — couro sensivel',
      'whatsapp_prefill', 'Oi! O questionário sobre couro sensível, ardor ou inflamação leve saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000161-0161-4000-8000-000000000161',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Potencial de crescimento e comprimento — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre potencial de crescimento e retenção de comprimento. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre potencial de crescimento e retenção de comprimento antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre potencial de crescimento e retenção de comprimento.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (pote crescimento)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre potencial de crescimento e retenção de comprimento. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000161-0161-4000-8000-000000000161',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Potencial de crescimento e comprimento — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que potencial de crescimento e retenção de comprimento já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — pote crescimento',
      'whatsapp_prefill', 'Oi! O quiz sobre potencial de crescimento e retenção de comprimento saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000161-0161-4000-8000-000000000161',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Potencial de crescimento e comprimento — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em potencial de crescimento e retenção de comprimento. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — pote crescimento',
      'whatsapp_prefill', 'Oi! O questionário sobre potencial de crescimento e retenção de comprimento saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000162-0162-4000-8000-000000000162',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Fortalecimento preventivo — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre fortalecimento preventivo dos fios. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre fortalecimento preventivo dos fios antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre fortalecimento preventivo dos fios.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (fortalecimento)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre fortalecimento preventivo dos fios. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000162-0162-4000-8000-000000000162',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Fortalecimento preventivo — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que fortalecimento preventivo dos fios já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — fortalecimento',
      'whatsapp_prefill', 'Oi! O quiz sobre fortalecimento preventivo dos fios saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000162-0162-4000-8000-000000000162',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Fortalecimento preventivo — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em fortalecimento preventivo dos fios. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — fortalecimento',
      'whatsapp_prefill', 'Oi! O questionário sobre fortalecimento preventivo dos fios saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000163-0163-4000-8000-000000000163',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Terapia capilar preventiva — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre terapia capilar preventiva e calendário. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre terapia capilar preventiva e calendário antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre terapia capilar preventiva e calendário.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (terapia preventiva)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre terapia capilar preventiva e calendário. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000163-0163-4000-8000-000000000163',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Terapia capilar preventiva — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que terapia capilar preventiva e calendário já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — terapia preventiva',
      'whatsapp_prefill', 'Oi! O quiz sobre terapia capilar preventiva e calendário saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000163-0163-4000-8000-000000000163',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Terapia capilar preventiva — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em terapia capilar preventiva e calendário. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — terapia preventiva',
      'whatsapp_prefill', 'Oi! O questionário sobre terapia capilar preventiva e calendário saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000164-0164-4000-8000-000000000164',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Check-in: saúde do couro — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre saúde do couro além da coceira forte. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre saúde do couro além da coceira forte antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre saúde do couro além da coceira forte.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (checkin couro)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre saúde do couro além da coceira forte. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000164-0164-4000-8000-000000000164',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Check-in: saúde do couro — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que saúde do couro além da coceira forte já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — checkin couro',
      'whatsapp_prefill', 'Oi! O quiz sobre saúde do couro além da coceira forte saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000164-0164-4000-8000-000000000164',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Check-in: saúde do couro — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em saúde do couro além da coceira forte. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — checkin couro',
      'whatsapp_prefill', 'Oi! O questionário sobre saúde do couro além da coceira forte saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000165-0165-4000-8000-000000000165',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Recuperação pós-química — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre recuperação pós-química com continuidade. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre recuperação pós-química com continuidade antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre recuperação pós-química com continuidade.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (pos quimica)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre recuperação pós-química com continuidade. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000165-0165-4000-8000-000000000165',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Recuperação pós-química — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que recuperação pós-química com continuidade já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — pos quimica',
      'whatsapp_prefill', 'Oi! O quiz sobre recuperação pós-química com continuidade saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000165-0165-4000-8000-000000000165',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Recuperação pós-química — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em recuperação pós-química com continuidade. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — pos quimica',
      'whatsapp_prefill', 'Oi! O questionário sobre recuperação pós-química com continuidade saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000166-0166-4000-8000-000000000166',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Rotina em casa e salão — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre rotina em casa alinhada ao salão. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre rotina em casa alinhada ao salão antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre rotina em casa alinhada ao salão.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (rotina casa salao)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre rotina em casa alinhada ao salão. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000166-0166-4000-8000-000000000166',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Rotina em casa e salão — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que rotina em casa alinhada ao salão já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — rotina casa salao',
      'whatsapp_prefill', 'Oi! O quiz sobre rotina em casa alinhada ao salão saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000166-0166-4000-8000-000000000166',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Rotina em casa e salão — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em rotina em casa alinhada ao salão. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — rotina casa salao',
      'whatsapp_prefill', 'Oi! O questionário sobre rotina em casa alinhada ao salão saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000167-0167-4000-8000-000000000167',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Detox capilar em casa — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre detox capilar, expectativa e segurança. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre detox capilar, expectativa e segurança antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre detox capilar, expectativa e segurança.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (detox casa)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre detox capilar, expectativa e segurança. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000167-0167-4000-8000-000000000167',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Detox capilar em casa — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que detox capilar, expectativa e segurança já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — detox casa',
      'whatsapp_prefill', 'Oi! O quiz sobre detox capilar, expectativa e segurança saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000167-0167-4000-8000-000000000167',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Detox capilar em casa — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em detox capilar, expectativa e segurança. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — detox casa',
      'whatsapp_prefill', 'Oi! O questionário sobre detox capilar, expectativa e segurança saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000168-0168-4000-8000-000000000168',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Saúde real dos fios — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre saúde real dos fios além do brilho do dia. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre saúde real dos fios além do brilho do dia antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre saúde real dos fios além do brilho do dia.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (saude real fios)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre saúde real dos fios além do brilho do dia. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000168-0168-4000-8000-000000000168',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Saúde real dos fios — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que saúde real dos fios além do brilho do dia já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — saude real fios',
      'whatsapp_prefill', 'Oi! O quiz sobre saúde real dos fios além do brilho do dia saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000168-0168-4000-8000-000000000168',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Saúde real dos fios — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em saúde real dos fios além do brilho do dia. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — saude real fios',
      'whatsapp_prefill', 'Oi! O questionário sobre saúde real dos fios além do brilho do dia saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000169-0169-4000-8000-000000000169',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Qual terapia capilar faz sentido — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre qual terapia capilar faz sentido para mim. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre qual terapia capilar faz sentido para mim antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre qual terapia capilar faz sentido para mim.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Leve dúvidas sobre sensibilidade, medicamentos e tempo disponível para sessões.',
      'cta_text', 'Quero avaliação capilar (escolha terapia)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre qual terapia capilar faz sentido para mim. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000169-0169-4000-8000-000000000169',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Qual terapia capilar faz sentido — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas mostram indecisão entre procedimentos. A consulta costuma fechar prioridade, intervalo e o que combina com o seu couro — sem promessa vazia.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — escolha terapia',
      'whatsapp_prefill', 'Oi! O quiz sobre qual terapia capilar faz sentido para mim saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000169-0169-4000-8000-000000000169',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Qual terapia capilar faz sentido — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em qual terapia capilar faz sentido para mim. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — escolha terapia',
      'whatsapp_prefill', 'Oi! O questionário sobre qual terapia capilar faz sentido para mim saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000170-0170-4000-8000-000000000170',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Microagulhamento capilar — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre microagulhamento capilar e indicações. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre microagulhamento capilar e indicações antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre microagulhamento capilar e indicações.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (microagulhamento)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre microagulhamento capilar e indicações. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000170-0170-4000-8000-000000000170',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Microagulhamento capilar — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que microagulhamento capilar e indicações já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — microagulhamento',
      'whatsapp_prefill', 'Oi! O quiz sobre microagulhamento capilar e indicações saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000170-0170-4000-8000-000000000170',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Microagulhamento capilar — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em microagulhamento capilar e indicações. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Agendar micro sem triagem de couro ativo ou medicação pode contraindicar sessão.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — microagulhamento',
      'whatsapp_prefill', 'Oi! O questionário sobre microagulhamento capilar e indicações saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000171-0171-4000-8000-000000000171',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Laser capilar — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre laser capilar e expectativa. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre laser capilar e expectativa antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre laser capilar e expectativa.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (laser)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre laser capilar e expectativa. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000171-0171-4000-8000-000000000171',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Laser capilar — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que laser capilar e expectativa já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — laser',
      'whatsapp_prefill', 'Oi! O quiz sobre laser capilar e expectativa saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000171-0171-4000-8000-000000000171',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Laser capilar — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em laser capilar e expectativa. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — laser',
      'whatsapp_prefill', 'Oi! O questionário sobre laser capilar e expectativa saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000172-0172-4000-8000-000000000172',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'LED capilar — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre LED capilar e sensibilidade. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre LED capilar e sensibilidade antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre LED capilar e sensibilidade.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (led)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre LED capilar e sensibilidade. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000172-0172-4000-8000-000000000172',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'LED capilar — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que LED capilar e sensibilidade já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — led',
      'whatsapp_prefill', 'Oi! O quiz sobre LED capilar e sensibilidade saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000172-0172-4000-8000-000000000172',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'LED capilar — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em LED capilar e sensibilidade. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — led',
      'whatsapp_prefill', 'Oi! O questionário sobre LED capilar e sensibilidade saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000173-0173-4000-8000-000000000173',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Ozonioterapia capilar — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre ozonioterapia capilar e contexto de saúde. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre ozonioterapia capilar e contexto de saúde antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre ozonioterapia capilar e contexto de saúde.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (ozonio)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre ozonioterapia capilar e contexto de saúde. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000173-0173-4000-8000-000000000173',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Ozonioterapia capilar — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que ozonioterapia capilar e contexto de saúde já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — ozonio',
      'whatsapp_prefill', 'Oi! O quiz sobre ozonioterapia capilar e contexto de saúde saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000173-0173-4000-8000-000000000173',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Ozonioterapia capilar — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em ozonioterapia capilar e contexto de saúde. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — ozonio',
      'whatsapp_prefill', 'Oi! O questionário sobre ozonioterapia capilar e contexto de saúde saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000174-0174-4000-8000-000000000174',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Argilaterapia e óleos — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre argilaterapia e blend de óleos. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre argilaterapia e blend de óleos antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre argilaterapia e blend de óleos.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (argila oleos)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre argilaterapia e blend de óleos. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000174-0174-4000-8000-000000000174',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Argilaterapia e óleos — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que argilaterapia e blend de óleos já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — argila oleos',
      'whatsapp_prefill', 'Oi! O quiz sobre argilaterapia e blend de óleos saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000174-0174-4000-8000-000000000174',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Argilaterapia e óleos — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em argilaterapia e blend de óleos. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — argila oleos',
      'whatsapp_prefill', 'Oi! O questionário sobre argilaterapia e blend de óleos saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000175-0175-4000-8000-000000000175',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Alta frequência capilar — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre alta frequência capilar e segurança. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre alta frequência capilar e segurança antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre alta frequência capilar e segurança.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (alta frequencia)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre alta frequência capilar e segurança. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000175-0175-4000-8000-000000000175',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Alta frequência capilar — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que alta frequência capilar e segurança já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — alta frequencia',
      'whatsapp_prefill', 'Oi! O quiz sobre alta frequência capilar e segurança saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000175-0175-4000-8000-000000000175',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Alta frequência capilar — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em alta frequência capilar e segurança. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — alta frequencia',
      'whatsapp_prefill', 'Oi! O questionário sobre alta frequência capilar e segurança saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000176-0176-4000-8000-000000000176',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Detox profundo no salão — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre detox profundo no salão e build-up. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre detox profundo no salão e build-up antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre detox profundo no salão e build-up.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (detox salao)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre detox profundo no salão e build-up. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000176-0176-4000-8000-000000000176',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Detox profundo no salão — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que detox profundo no salão e build-up já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — detox salao',
      'whatsapp_prefill', 'Oi! O quiz sobre detox profundo no salão e build-up saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000176-0176-4000-8000-000000000176',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Detox profundo no salão — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em detox profundo no salão e build-up. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — detox salao',
      'whatsapp_prefill', 'Oi! O questionário sobre detox profundo no salão e build-up saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000177-0177-4000-8000-000000000177',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Terapia combinada — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre terapia combinada sem sobrecarga. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre terapia combinada sem sobrecarga antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre terapia combinada sem sobrecarga.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (terapia combinada)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre terapia combinada sem sobrecarga. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000177-0177-4000-8000-000000000177',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Terapia combinada — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que terapia combinada sem sobrecarga já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — terapia combinada',
      'whatsapp_prefill', 'Oi! O quiz sobre terapia combinada sem sobrecarga saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000177-0177-4000-8000-000000000177',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Terapia combinada — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em terapia combinada sem sobrecarga. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — terapia combinada',
      'whatsapp_prefill', 'Oi! O questionário sobre terapia combinada sem sobrecarga saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000178-0178-4000-8000-000000000178',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Mitos sobre queda — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, ainda há espaço para alinhar expectativa com prática capilar presencial — educação sem culpa e sem promessa milagrosa.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre mitos sobre queda de cabelo antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre mitos sobre queda de cabelo.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (mitos queda)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre mitos sobre queda de cabelo. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000178-0178-4000-8000-000000000178',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Mitos sobre queda — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que mitos sobre queda de cabelo já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — mitos queda',
      'whatsapp_prefill', 'Oi! O quiz sobre mitos sobre queda de cabelo saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000178-0178-4000-8000-000000000178',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Mitos sobre queda — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em mitos sobre queda de cabelo. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — mitos queda',
      'whatsapp_prefill', 'Oi! O questionário sobre mitos sobre queda de cabelo saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000179-0179-4000-8000-000000000179',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Erros na rotina capilar — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre erros comuns na rotina (pentear, calor, toalha). Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre erros comuns na rotina (pentear, calor, toalha) antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre erros comuns na rotina (pentear, calor, toalha).',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (erros rotina)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre erros comuns na rotina (pentear, calor, toalha). O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000179-0179-4000-8000-000000000179',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Erros na rotina capilar — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que erros comuns na rotina (pentear, calor, toalha) já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — erros rotina',
      'whatsapp_prefill', 'Oi! O quiz sobre erros comuns na rotina (pentear, calor, toalha) saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000179-0179-4000-8000-000000000179',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Erros na rotina capilar — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em erros comuns na rotina (pentear, calor, toalha). A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — erros rotina',
      'whatsapp_prefill', 'Oi! O questionário sobre erros comuns na rotina (pentear, calor, toalha) saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000180-0180-4000-8000-000000000180',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Uso de produtos — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre uso errado ou excesso de produtos. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre uso errado ou excesso de produtos antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre uso errado ou excesso de produtos.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (produtos)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre uso errado ou excesso de produtos. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000180-0180-4000-8000-000000000180',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Uso de produtos — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que uso errado ou excesso de produtos já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — produtos',
      'whatsapp_prefill', 'Oi! O quiz sobre uso errado ou excesso de produtos saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000180-0180-4000-8000-000000000180',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Uso de produtos — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em uso errado ou excesso de produtos. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — produtos',
      'whatsapp_prefill', 'Oi! O questionário sobre uso errado ou excesso de produtos saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000181-0181-4000-8000-000000000181',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Frequência de lavagem — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre frequência de lavagem e equilíbrio do couro. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre frequência de lavagem e equilíbrio do couro antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre frequência de lavagem e equilíbrio do couro.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (lavagem)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre frequência de lavagem e equilíbrio do couro. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000181-0181-4000-8000-000000000181',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Frequência de lavagem — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que frequência de lavagem e equilíbrio do couro já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — lavagem',
      'whatsapp_prefill', 'Oi! O quiz sobre frequência de lavagem e equilíbrio do couro saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000181-0181-4000-8000-000000000181',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Frequência de lavagem — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em frequência de lavagem e equilíbrio do couro. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — lavagem',
      'whatsapp_prefill', 'Oi! O questionário sobre frequência de lavagem e equilíbrio do couro saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000182-0182-4000-8000-000000000182',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Hábitos que prejudicam fios — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre hábitos que prejudicam fios e brilho. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre hábitos que prejudicam fios e brilho antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre hábitos que prejudicam fios e brilho.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (habitos)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre hábitos que prejudicam fios e brilho. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000182-0182-4000-8000-000000000182',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Hábitos que prejudicam fios — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que hábitos que prejudicam fios e brilho já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — habitos',
      'whatsapp_prefill', 'Oi! O quiz sobre hábitos que prejudicam fios e brilho saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000182-0182-4000-8000-000000000182',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Hábitos que prejudicam fios — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em hábitos que prejudicam fios e brilho. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — habitos',
      'whatsapp_prefill', 'Oi! O questionário sobre hábitos que prejudicam fios e brilho saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000183-0183-4000-8000-000000000183',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Inflamação no couro (educativo) — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, vale esclarecer rotina e sinais de alerta — o quiz não diagnostica. Na consulta capilar costuma organizar-se o cuidado e, se necessário, o encaminhamento adequado.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre sinais no couro que pedem conversa profissional antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre sinais no couro que pedem conversa profissional.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (inflamacao couro)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre sinais no couro que pedem conversa profissional. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000183-0183-4000-8000-000000000183',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Inflamação no couro (educativo) — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que sinais no couro que pedem conversa profissional já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — inflamacao couro',
      'whatsapp_prefill', 'Oi! O quiz sobre sinais no couro que pedem conversa profissional saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000183-0183-4000-8000-000000000183',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Inflamação no couro (educativo) — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade que pede avaliação presencial. A clínica apoia cuidado capilar e indica encaminhamento quando fizer sentido — sem substituir médico ou dermatologista.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — inflamacao couro',
      'whatsapp_prefill', 'Oi! O questionário sobre sinais no couro que pedem conversa profissional saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000184-0184-4000-8000-000000000184',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Hormônios e cabelo (educativo) — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, faz sentido alinhar fase da vida, rotina e expectativa — sem autodiagnóstico. A consulta capilar costuma integrar cuidado do fio com orientação sobre quando envolver saúde geral.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre hormônios e mudanças no cabelo antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre hormônios e mudanças no cabelo.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (hormonios)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre hormônios e mudanças no cabelo. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000184-0184-4000-8000-000000000184',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Hormônios e cabelo (educativo) — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que hormônios e mudanças no cabelo já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — hormonios',
      'whatsapp_prefill', 'Oi! O quiz sobre hormônios e mudanças no cabelo saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000184-0184-4000-8000-000000000184',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Hormônios e cabelo (educativo) — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há impacto forte ou mudança rápida que pedem conversa presencial. A equipe capilar organiza próximos passos com honestidade e encaminhamento quando necessário.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — hormonios',
      'whatsapp_prefill', 'Oi! O questionário sobre hormônios e mudanças no cabelo saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000185-0185-4000-8000-000000000185',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', '3 sinais no couro — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre sinais de que o couro pede atenção. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre sinais de que o couro pede atenção antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre sinais de que o couro pede atenção.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (tres sinais couro)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre sinais de que o couro pede atenção. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000185-0185-4000-8000-000000000185',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', '3 sinais no couro — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que sinais de que o couro pede atenção já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — tres sinais couro',
      'whatsapp_prefill', 'Oi! O quiz sobre sinais de que o couro pede atenção saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000185-0185-4000-8000-000000000185',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', '3 sinais no couro — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em sinais de que o couro pede atenção. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — tres sinais couro',
      'whatsapp_prefill', 'Oi! O questionário sobre sinais de que o couro pede atenção saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000186-0186-4000-8000-000000000186',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Queda sazonal — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre queda sazonal ou em época específica. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre queda sazonal ou em época específica antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre queda sazonal ou em época específica.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (queda sazonal)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre queda sazonal ou em época específica. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000186-0186-4000-8000-000000000186',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Queda sazonal — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que queda sazonal ou em época específica já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — queda sazonal',
      'whatsapp_prefill', 'Oi! O quiz sobre queda sazonal ou em época específica saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000186-0186-4000-8000-000000000186',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Queda sazonal — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em queda sazonal ou em época específica. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — queda sazonal',
      'whatsapp_prefill', 'Oi! O questionário sobre queda sazonal ou em época específica saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000187-0187-4000-8000-000000000187',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Pós-verão: sol e piscina — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre cabelo pós-sol, praia ou piscina. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre cabelo pós-sol, praia ou piscina antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre cabelo pós-sol, praia ou piscina.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (pos verao)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre cabelo pós-sol, praia ou piscina. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000187-0187-4000-8000-000000000187',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Pós-verão: sol e piscina — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que cabelo pós-sol, praia ou piscina já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — pos verao',
      'whatsapp_prefill', 'Oi! O quiz sobre cabelo pós-sol, praia ou piscina saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000187-0187-4000-8000-000000000187',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Pós-verão: sol e piscina — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em cabelo pós-sol, praia ou piscina. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — pos verao',
      'whatsapp_prefill', 'Oi! O questionário sobre cabelo pós-sol, praia ou piscina saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000188-0188-4000-8000-000000000188',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Pós-progressiva ou alisamento — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre pós-progressiva ou alisamento e intervalos. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre pós-progressiva ou alisamento e intervalos antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre pós-progressiva ou alisamento e intervalos.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (pos alisamento)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre pós-progressiva ou alisamento e intervalos. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000188-0188-4000-8000-000000000188',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Pós-progressiva ou alisamento — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que pós-progressiva ou alisamento e intervalos já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — pos alisamento',
      'whatsapp_prefill', 'Oi! O quiz sobre pós-progressiva ou alisamento e intervalos saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000188-0188-4000-8000-000000000188',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Pós-progressiva ou alisamento — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em pós-progressiva ou alisamento e intervalos. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — pos alisamento',
      'whatsapp_prefill', 'Oi! O questionário sobre pós-progressiva ou alisamento e intervalos saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000189-0189-4000-8000-000000000189',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Menopausa e o cabelo — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre mudanças no cabelo na menopausa. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre mudanças no cabelo na menopausa antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre mudanças no cabelo na menopausa.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (menopausa)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre mudanças no cabelo na menopausa. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000189-0189-4000-8000-000000000189',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Menopausa e o cabelo — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que mudanças no cabelo na menopausa já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — menopausa',
      'whatsapp_prefill', 'Oi! O quiz sobre mudanças no cabelo na menopausa saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000189-0189-4000-8000-000000000189',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Menopausa e o cabelo — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em mudanças no cabelo na menopausa. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — menopausa',
      'whatsapp_prefill', 'Oi! O questionário sobre mudanças no cabelo na menopausa saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000190-0190-4000-8000-000000000190',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Fim de ano: correria — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre estresse de fim de ano e rotina capilar. Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre estresse de fim de ano e rotina capilar antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre estresse de fim de ano e rotina capilar.',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (fim ano)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre estresse de fim de ano e rotina capilar. O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000190-0190-4000-8000-000000000190',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Fim de ano: correria — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que estresse de fim de ano e rotina capilar já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — fim ano',
      'whatsapp_prefill', 'Oi! O quiz sobre estresse de fim de ano e rotina capilar saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000190-0190-4000-8000-000000000190',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Fim de ano: correria — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em estresse de fim de ano e rotina capilar. A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — fim ano',
      'whatsapp_prefill', 'Oi! O questionário sobre estresse de fim de ano e rotina capilar saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  ),
  (
    'b1000191-0191-4000-8000-000000000191',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Cabelo masculino: entradas e couro — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre entradas, rarefação e couro (cabelo masculino). Na avaliação capilar costuma alinhar-se rotina, produtos e próximo passo com critério — sem alarmismo nem promessa de resultado imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sobre entradas, rarefação e couro (cabelo masculino) antes de acumular mais compra por impulso.',
      'main_blocker', 'Trocar de produto toda semana sem plano presencial atrasa o que poderia ser organizado com orientação.',
      'consequence', 'Adiar conversa mantém a preocupação de fundo sobre entradas, rarefação e couro (cabelo masculino).',
      'growth_potential', 'Leve resumo do que usa há 4–8 semanas e marque avaliação com expectativa realista.',
      'dica_rapida', 'Anotar frequência de lavagem e sensação do couro ajuda na primeira consulta.',
      'cta_text', 'Quero avaliação capilar (masculino)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre entradas, rarefação e couro (cabelo masculino). O resultado saiu exploratório — quero marcar avaliação capilar com vocês.'
    )
  ),
  (
    'b1000191-0191-4000-8000-000000000191',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Cabelo masculino: entradas e couro — impacto na rotina; plano com profissional',
      'profile_summary', 'As respostas indicam que entradas, rarefação e couro (cabelo masculino) já pesa no dia a dia. Um plano capilar presencial costuma unir técnica em salão, hábitos em casa e honestidade sobre prazo e frequência.',
      'frase_identificacao', 'Se isso combina com você, já tentou moda de internet e quer método com acompanhamento.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar gasto solto e frustração.',
      'consequence', 'Sem prioridade, o tema tende a voltar em ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com histórico de química, calor, sono e estresse recente.',
      'dica_rapida', 'Reduzir tração mecânica e excesso de calor até alinhar técnica costuma proteger couro e fio.',
      'cta_text', 'Quero consulta — masculino',
      'whatsapp_prefill', 'Oi! O quiz sobre entradas, rarefação e couro (cabelo masculino) saiu moderado. Quero consulta para protocolo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000191-0191-4000-8000-000000000191',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Cabelo masculino: entradas e couro — priorizar avaliação presencial orientada',
      'profile_summary', 'Pelas respostas, há intensidade ou evolução rápida em entradas, rarefação e couro (cabelo masculino). A equipe capilar organiza cuidado do couro e dos fios e, quando indicado, apoia encaminhamento — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de prioridade e clareza, não de improviso.',
      'main_blocker', 'Postergar quando o desconforto ou a mudança são fortes prolonga impacto em sono e autoimagem.',
      'consequence', 'Continuar sem critério pode somar agressão mecânica ou química inadequada.',
      'growth_potential', 'Peça encaixe prioritário e leve lista de produtos, procedimentos e medicamentos relevantes.',
      'dica_rapida', 'Evite nova química ou procedimento agressivo até a primeira conversa presencial.',
      'cta_text', 'Preciso de avaliação prioritária — masculino',
      'whatsapp_prefill', 'Oi! O questionário sobre entradas, rarefação e couro (cabelo masculino) saiu urgente. Quero avaliação prioritária e orientação segura com vocês.'
    )
  );
