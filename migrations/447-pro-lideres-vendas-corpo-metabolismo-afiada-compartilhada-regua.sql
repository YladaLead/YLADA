-- 447 — Lote 3 (vendas) PILOTO: devolutiva AFIADA COMPARTILHADA do bloco Corpo & Metabolismo.
--
-- Modelo Caminho 2 (mesmo do recrutamento 444/445): os 5 fluxos do bloco medem a MESMA
-- coisa (corpo pesado / inchaço / sedentarismo) → uma única devolutiva afiada serve a todos.
-- O que muda por fluxo é só a ABERTURA (gancho), que vive na instância do contrato YladaFlow
-- (src/lib/ylada-flow/bibliotecas/vendas/blocos/corpo-metabolismo.ts), não nos outcomes.
--
-- Cobre os 5 flow_ids do bloco (ATENÇÃO às cedilhas em retencao-inchaço e inchaço-manha):
--   barriga-pesada · retencao-inchaço · desconforto-pos-refeicao · inchaço-manha · sedentarismo
-- FORA: ansiedade-doce (leitura diferente: fome emocional) · avaliacao-perfil-metabolico (especial)
--       · metabolismo-lento (arquivado, migration 437).
--
-- SUBSTITUI a copy morna anterior destes flow_ids (migrations 388/389/390) pela versão afiada
-- pela Régua + gatilhos mentais ÉTICOS (aprovado 22/06): identificação (espelho), curiosidade,
-- aversão à perda HONESTA (o corpo "só acumula"), compromisso/agora ("um passo só, hoje").
--   → SEM escassez falsa, SEM promessa ("desincha/emagrece/elimina toxina"), SEM diagnóstico,
--     SEM termo de produto/Herbalife, SEM salvaguarda clínica (esfriaria). Linguagem de bem-estar.
-- CTA = falar com quem enviou o link. Prefill genérico (serve a qualquer entrada temática).
--
-- Eixo desta tabela = DOR (RISK): archetype_code leve/moderado/urgente = TOM.
-- Prontidão (pronta × ainda-não) NÃO mora aqui — é o handoff/porPerfil do contrato (runtime).
-- Mesmo schema da 445 (RISK_DIAGNOSIS, diagnosis_vertical NULL).
--
-- NOTA: rodar este 447 já melhora a devolutiva mesmo no render LEGADO (lookup por flow_id ×
-- archetype). O questionário unificado novo e as aberturas só aparecem quando o render nativo
-- do YladaFlow for ligado para o bloco (atrás da flag YLADA_FLOW_NATIVE_PILOT / meta.use_ylada_flow_native).

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'barriga-pesada',
    'retencao-inchaço',
    'desconforto-pos-refeicao',
    'inchaço-manha',
    'sedentarismo'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
SELECT f.flow_id, 'RISK_DIAGNOSIS', a.archetype_code, NULL, a.content_json
FROM (
  VALUES
    ('barriga-pesada'),
    ('retencao-inchaço'),
    ('desconforto-pos-refeicao'),
    ('inchaço-manha'),
    ('sedentarismo')
) AS f(flow_id)
CROSS JOIN (
  VALUES
    (
      'leve',
      jsonb_build_object(
        'profile_title', 'Seu corpo ainda dá só sinais leves, e dá tempo de virar',
        'profile_summary', 'Pelas respostas, o peso e o inchaço aparecem de vez em quando, não o tempo todo. É bem nesse começo que dá pra cuidar com calma, antes de virar rotina.',
        'frase_identificacao', 'Se isso é você: dá pra tocar o dia, mas no fundo você sente que poderia se sentir bem mais leve.',
        'main_blocker', 'O que pesa ainda não é nada grave. São pequenos hábitos do dia a dia que já começam a deixar o corpo travado.',
        'consequence', 'Ignorar não custa caro hoje. Mas o que é "de vez em quando" vira "todo dia" quando ninguém mexe, e aí é mais difícil de virar.',
        'growth_potential', 'Dá pra resolver começando pequeno, sem dieta radical e sem virar a rotina de cabeça pra baixo. Um passo só, hoje.',
        'dica_rapida', 'Repara na água que você bebe e em quanto tempo fica parada: dois ajustes simples que já mudam a sensação de leveza.',
        'cta_text', 'Quero virar isso enquanto é simples',
        'whatsapp_prefill', 'Oi! Respondi o que você me mandou. Meu corpo dá uns sinais de peso de vez em quando e queria virar isso enquanto ainda é simples. Por onde eu começo?'
      )
    ),
    (
      'moderado',
      jsonb_build_object(
        'profile_title', 'Seu corpo já te avisa todo dia, e você foi se acostumando',
        'profile_summary', 'Você toca o dia, mas o corpo vive pesado e estufado, roubando a sua disposição sem você perceber. Não é frescura nem impressão: é um padrão que se repete.',
        'frase_identificacao', 'Se isso é você: o problema nunca foi falta de esforço. É não ter um jeito que caiba no seu dia sem virar mais um peso.',
        'main_blocker', 'A causa nunca foi você. São pequenas coisas do dia a dia que vão se somando, e quem paga a conta é o seu corpo, em peso e cansaço.',
        'consequence', 'Do jeito que está, daqui a um ano você reclama exatamente do mesmo. O corpo não melhora sozinho; ele só acumula.',
        'growth_potential', 'Dá pra virar isso começando pequeno, sem dieta radical e sem largar nada do que você já faz. Um passo só, hoje.',
        'dica_rapida', 'Antes de chamar, repara: em que horário o peso mais aperta? Esse detalhe sozinho já encurta a conversa.',
        'cta_text', 'Quero dar o meu primeiro passo',
        'whatsapp_prefill', 'Oi! Respondi o que você me mandou. Meu corpo vive pesado e isso atrapalha minha disposição todo dia. Quero dar o primeiro passo pra me sentir mais leve.'
      )
    ),
    (
      'urgente',
      jsonb_build_object(
        'profile_title', 'O peso no corpo já manda no seu dia, e você sente o tempo todo',
        'profile_summary', 'Pelas respostas, o peso, o inchaço e o cansaço aparecem o tempo todo. Não é frescura. É o corpo cobrando um cuidado que ficou pra depois tempo demais.',
        'frase_identificacao', 'Se isso é você: você não quer conversa enrolada. Quer um caminho simples que caiba na sua vida, e quer começar logo.',
        'main_blocker', 'Não é falta de vontade. É que o corpo travado puxa tudo junto: a energia, o humor, a vontade de fazer qualquer coisa.',
        'consequence', 'Cada dia assim é um dia em que você rende menos do que podia. E sozinha, no mesmo caminho, amanhã é igual a hoje.',
        'growth_potential', 'O primeiro passo é uma conversa curta com quem te enviou isso, pra montar algo simples do seu jeito, sem promessa mágica. Dá pra começar hoje.',
        'dica_rapida', 'Leva as suas duas maiores queixas pra conversa. Em cinco minutos já dá pra enxergar um caminho que faça sentido pra você.',
        'cta_text', 'Quero começar agora',
        'whatsapp_prefill', 'Oi! Respondi o que você me mandou e o peso no corpo tá atrapalhando meu dia todo. Quero começar logo, com um passo simples que caiba na minha vida.'
      )
    )
) AS a(archetype_code, content_json);
