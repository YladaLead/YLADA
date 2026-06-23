-- 449 — Lote 3 (vendas): devolutiva AFIADA COMPARTILHADA do bloco Energia & Foco.
--
-- Modelo Caminho 2 (mesmo do 447/445): os 17 fluxos do bloco medem a MESMA coisa (energia
-- despenca / foco cai / dependência de café) → uma única devolutiva afiada serve a todos.
-- O que muda por fluxo é só a ABERTURA (gancho), que vive na instância do contrato YladaFlow
-- (src/lib/ylada-flow/bibliotecas/vendas/blocos/energia-foco.ts), não nos outcomes.
--
-- Cobre os 17 flow_ids do bloco:
--   ex-hype:  energia-foco · pre-treino · rotina-produtiva · constancia
--   energia:  energia-matinal · energia-tarde · troca-cafe · anti-cansaco · rotina-puxada ·
--             foco-concentracao · motoristas · mente-cansada · falta-disposicao-treinar ·
--             trabalho-noturno · rotina-estressante · maes-ocupadas · fim-tarde-sem-energia
--
-- SUBSTITUI a copy morna anterior (387–390 wellness-vendas + 401 hype) pela versão afiada
-- pela Régua + gatilhos mentais ÉTICOS: identificação, curiosidade, aversão à perda honesta,
-- compromisso+agora. NEUTRALIZA o hype (sem kit/Herbalife). SEM promessa de saúde/cura do
-- cansaço, SEM diagnóstico, SEM pressão, SEM salvaguarda clínica. Linguagem de bem-estar.
-- CTA = falar com quem enviou o link. Prefill genérico (serve a qualquer entrada temática).
--
-- Eixo desta tabela = DOR (RISK): archetype_code leve/moderado/urgente = TOM.
-- Prontidão (pronta × ainda-não) NÃO mora aqui — é o handoff/porPerfil do contrato (runtime).
-- Mesmo schema da 447 (RISK_DIAGNOSIS, diagnosis_vertical NULL). Idempotente: pode re-rodar.
--
-- NOTA: rodar já melhora a devolutiva no render LEGADO (lookup por flow_id × archetype). O
-- questionário unificado + aberturas só aparecem quando o render nativo for ligado (flag), e
-- depois de registrar FLUXOS_VENDAS_ENERGIA no QUIZ_MOLD do resolve-native-pilot (Cursor).

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'energia-foco',
    'pre-treino',
    'rotina-produtiva',
    'constancia',
    'energia-matinal',
    'energia-tarde',
    'troca-cafe',
    'anti-cansaco',
    'rotina-puxada',
    'foco-concentracao',
    'motoristas',
    'mente-cansada',
    'falta-disposicao-treinar',
    'trabalho-noturno',
    'rotina-estressante',
    'maes-ocupadas',
    'fim-tarde-sem-energia'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
SELECT f.flow_id, 'RISK_DIAGNOSIS', a.archetype_code, NULL, a.content_json
FROM (
  VALUES
    ('energia-foco'),
    ('pre-treino'),
    ('rotina-produtiva'),
    ('constancia'),
    ('energia-matinal'),
    ('energia-tarde'),
    ('troca-cafe'),
    ('anti-cansaco'),
    ('rotina-puxada'),
    ('foco-concentracao'),
    ('motoristas'),
    ('mente-cansada'),
    ('falta-disposicao-treinar'),
    ('trabalho-noturno'),
    ('rotina-estressante'),
    ('maes-ocupadas'),
    ('fim-tarde-sem-energia')
) AS f(flow_id)
CROSS JOIN (
  VALUES
    (
      'leve',
      jsonb_build_object(
        'profile_title', 'Sua energia ainda segura, mas já dá uns apagões',
        'profile_summary', 'Pelas respostas, a energia oscila em algum horário, mas ainda não te derruba o dia todo. É o melhor momento pra ajustar, antes de virar cansaço de todo dia.',
        'frase_identificacao', 'Se isso é você: dá pra tocar o dia, mas você sente que podia render bem mais sem ficar no esforço.',
        'main_blocker', 'O que pesa ainda não é grave. São hábitos do dia a dia que já começam a drenar a sua energia.',
        'consequence', 'Ignorar não custa caro hoje. Mas o apagão de um horário vira o dia inteiro quando ninguém mexe.',
        'growth_potential', 'Dá pra resolver começando pequeno, sem revolução na rotina. Um ajuste só, hoje.',
        'dica_rapida', 'Repara na água e no sono: dois fatores que derrubam a energia mais do que a gente imagina, antes de qualquer suplemento.',
        'cta_text', 'Quero ter mais energia enquanto é simples',
        'whatsapp_prefill', 'Oi! Respondi o que você me mandou. Minha energia dá uns apagões em certos horários e queria ajustar isso enquanto é simples. Por onde eu começo?'
      )
    ),
    (
      'moderado',
      jsonb_build_object(
        'profile_title', 'A queda de energia já cobra um preço no seu dia',
        'profile_summary', 'Você se vira, mas a energia despenca no meio do dia e o foco vai junto. Empurrar com café virou rotina, e isso vai te desgastando sem você perceber.',
        'frase_identificacao', 'Se isso é você: o problema nunca foi falta de esforço. É não ter uma base que segure a sua energia o dia todo.',
        'main_blocker', 'A causa não é você. É o corpo sem base, funcionando no limite e sem tempo de recuperar.',
        'consequence', 'Do jeito que está, você rende menos, se irrita mais, e a sensação de estar sempre devendo ao próprio dia só aumenta.',
        'growth_potential', 'Dá pra virar isso começando pequeno, sem mudar tudo de uma vez. Um passo só, hoje.',
        'dica_rapida', 'Antes de chamar, repara: em que horário a energia mais cai? Esse detalhe já encurta a conversa.',
        'cta_text', 'Quero recuperar minha energia',
        'whatsapp_prefill', 'Oi! Respondi o que você me mandou. Minha energia despenca no meio do dia e o foco vai junto. Quero dar o primeiro passo pra mudar isso.'
      )
    ),
    (
      'urgente',
      jsonb_build_object(
        'profile_title', 'Você vive no modo "aguentar o dia", e o corpo já avisa',
        'profile_summary', 'Pelas respostas, o cansaço é o tempo todo e o foco é difícil de manter. Não é frescura. É o corpo cobrando uma base que ficou pra depois tempo demais.',
        'frase_identificacao', 'Se isso é você: você não quer conversa enrolada, quer um caminho simples que caiba na sua vida, e quer começar logo.',
        'main_blocker', 'Não é falta de vontade. É que sem energia o resto trava junto: o foco, o humor, a vontade de fazer qualquer coisa.',
        'consequence', 'Cada dia no cansaço é um dia em que você rende menos do que podia. E sozinha, no mesmo ritmo, amanhã é igual a hoje.',
        'growth_potential', 'O primeiro passo é uma conversa curta com quem te enviou isso, pra montar algo simples do seu jeito, sem promessa mágica. Dá pra começar hoje.',
        'dica_rapida', 'Leva as suas duas maiores queixas de energia pra conversa. Em cinco minutos já dá pra ver um caminho.',
        'cta_text', 'Quero começar agora',
        'whatsapp_prefill', 'Oi! Respondi o que você me mandou e vivo no cansaço o dia todo. Quero começar logo, com um passo simples que caiba na minha vida.'
      )
    )
) AS a(archetype_code, content_json);
