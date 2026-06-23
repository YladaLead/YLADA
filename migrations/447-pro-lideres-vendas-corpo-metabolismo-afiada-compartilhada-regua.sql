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
-- pela Régua (Regua_Qualidade_Diagnosticos.md): espelho → causa → consequência → 1º passo → CTA;
-- popular, frase curta, "você". Governança VENDAS health-adjacent (régua §6):
--   SEM promessa de saúde, SEM "desincha/emagrece/elimina toxina", SEM diagnóstico, SEM termo
--   de produto/Herbalife, SEM salvaguarda clínica (esfriaria). CTA = falar com quem enviou o link.
-- Prefill genérico (serve a qualquer entrada temática do bloco).
--
-- Eixo desta tabela = DOR (RISK): archetype_code leve/moderado/urgente = TOM.
-- Prontidão (pronta × ainda-não) NÃO mora aqui — é o handoff/porPerfil do contrato (runtime).
-- Mesmo schema da 445 (RISK_DIAGNOSIS, diagnosis_vertical NULL).
--
-- NOTA: rodar este 447 já melhora a devolutiva mesmo no render LEGADO (lookup é por flow_id ×
-- archetype). O questionário unificado novo só aparece quando o render nativo do YladaFlow
-- for ligado para o bloco (atrás da flag YLADA_FLOW_NATIVE_PILOT / meta.use_ylada_flow_native).

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
        'profile_title', 'Você anda com o corpo meio pesado, mas ainda dá pra ajustar',
        'profile_summary', 'Pelas respostas, o peso e o inchaço aparecem de vez em quando, não o tempo todo. É justo nesse começo que dá pra cuidar com calma, antes de virar rotina.',
        'frase_identificacao', 'Se você se identifica: dá pra tocar o dia, mas você sente que poderia se sentir bem mais leve.',
        'main_blocker', 'O que pesa ainda não é nada grave. São pequenos hábitos do dia a dia que vão deixando o corpo travado.',
        'consequence', 'Deixar correr não custa caro hoje. Mas o que é de vez em quando tende a virar todo dia se ninguém mexe.',
        'growth_potential', 'Dá pra começar pequeno, sem dieta radical, sem virar a rotina de cabeça pra baixo. Um passo só.',
        'dica_rapida', 'Repare na água que você bebe e em quanto tempo fica parada: dois ajustes simples que já mudam a sensação de leveza.',
        'cta_text', 'Quero me sentir mais leve',
        'whatsapp_prefill', 'Oi! Respondi o que você me mandou. Meu corpo anda meio pesado de vez em quando e queria entender como me sentir mais leve, sem nada radical. Por onde eu começo?'
      )
    ),
    (
      'moderado',
      jsonb_build_object(
        'profile_title', 'O peso e o inchaço já incomodam quase todo dia',
        'profile_summary', 'Você se vira, mas o corpo vive pesado, estufado, e isso vai puxando a sua disposição pra baixo. Não é só impressão, é um padrão que se repete.',
        'frase_identificacao', 'Se você se identifica: não falta esforço. Falta um jeito que funcione no seu dia sem virar mais um peso.',
        'main_blocker', 'O problema não é você. São hábitos do dia a dia somados, e o corpo paga a conta em forma de peso e cansaço.',
        'consequence', 'Enquanto for assim, o ano que vem tende a ser igual a esse, com a mesma sensação de estar sempre devendo a você mesma.',
        'growth_potential', 'Dá pra começar pequeno, sem largar o que você já faz. Um passo só, no seu tempo.',
        'dica_rapida', 'Antes de falar, pensa numa coisa: em que horário do dia o peso mais te incomoda. Já ajuda a conversa a ir direto ao ponto.',
        'cta_text', 'Quero dar o primeiro passo',
        'whatsapp_prefill', 'Oi! Respondi o que você me mandou. Meu corpo vive pesado e isso atrapalha minha disposição. Quero entender como dar o primeiro passo pra me sentir mais leve.'
      )
    ),
    (
      'urgente',
      jsonb_build_object(
        'profile_title', 'O corpo pesado e travado já está atrapalhando o seu dia inteiro',
        'profile_summary', 'Pelas respostas, o peso, o inchaço e o cansaço aparecem o tempo todo. Não é frescura. É o corpo pedindo um cuidado que ficou pra depois tempo demais.',
        'frase_identificacao', 'Se você se identifica: você não quer conversa enrolada, quer um caminho simples que caiba na sua vida.',
        'main_blocker', 'Não é falta de vontade. É que o corpo travado puxa tudo junto: a energia, o humor, a vontade de fazer as coisas.',
        'consequence', 'Cada dia assim é um dia em que você rende menos do que podia. E sozinha, no mesmo caminho, ele tende a se repetir.',
        'growth_potential', 'O primeiro passo é uma conversa curta com quem te enviou isso, pra montar algo simples do seu jeito, sem promessa mágica.',
        'dica_rapida', 'Leva suas duas maiores queixas pra conversa. Em cinco minutos já dá pra ver um caminho que faça sentido pra você.',
        'cta_text', 'Quero falar agora com quem me enviou',
        'whatsapp_prefill', 'Oi! Respondi o que você me mandou e o peso no corpo tá atrapalhando meu dia todo. Quero falar pra entender um próximo passo simples que caiba na minha vida.'
      )
    )
) AS a(archetype_code, content_json);
