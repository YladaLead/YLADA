-- 445 — Lote 1 (Caminho 2): devolutiva AFIADA COMPARTILHADA do recrutamento Pró-Líderes.
--
-- Os 17 fluxos de recrutamento compartilham as MESMAS 5 perguntas (raio-X financeiro +
-- 1 reflexiva). Logo, a leitura é a mesma → uma única devolutiva afiada serve a todos.
-- O que muda por fluxo é só a ABERTURA (o gancho), que vive na instância do contrato,
-- não nos outcomes. Ver Chat5_Fase2_Molde_GanhosProsperidade.md (decisão Caminho 2).
--
-- Este 445 cobre os 16 OUTROS flow_ids (14 aberturas situacionais + 2 quizzes).
-- O `quiz-recrut-ganhos-prosperidade` já está no 444 com a MESMA leitura (prefill próprio).
-- Copy afiada pela Régua: espelho → causa → consequência → 1º passo → CTA; popular, frase curta,
-- "você"; SEM promessa de renda, SEM diagnóstico médico, SEM pressão; CTA ancorado em falar
-- com quem enviou o link. Prefill genérico (serve a qualquer entrada temática).
--
-- Eixo desta tabela = DOR (RISK): archetype_code leve/moderado/urgente = TOM.
-- Prontidão (pronta × ainda-não) NÃO mora aqui — é o handoff/porPerfil do contrato (runtime).
-- Mesmo schema da 397/444 (RISK_DIAGNOSIS, diagnosis_vertical NULL).

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'renda-extra-imediata',
    'transformar-consumo-renda',
    'maes-trabalhar-casa',
    'ja-consome-bem-estar',
    'ja-usa-energia-acelera',
    'perderam-emprego-transicao',
    'cansadas-trabalho-atual',
    'trabalhar-apenas-links',
    'ja-tentaram-outros-negocios',
    'querem-trabalhar-digital',
    'ja-empreendem',
    'querem-emagrecer-renda',
    'boas-venda-comercial',
    'jovens-empreendedores',
    'quiz-recrut-proposito-equilibrio',
    'quiz-recrut-potencial-crescimento'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
SELECT f.flow_id, 'RISK_DIAGNOSIS', a.archetype_code, NULL, a.content_json
FROM (
  VALUES
    ('renda-extra-imediata'),
    ('transformar-consumo-renda'),
    ('maes-trabalhar-casa'),
    ('ja-consome-bem-estar'),
    ('ja-usa-energia-acelera'),
    ('perderam-emprego-transicao'),
    ('cansadas-trabalho-atual'),
    ('trabalhar-apenas-links'),
    ('ja-tentaram-outros-negocios'),
    ('querem-trabalhar-digital'),
    ('ja-empreendem'),
    ('querem-emagrecer-renda'),
    ('boas-venda-comercial'),
    ('jovens-empreendedores'),
    ('quiz-recrut-proposito-equilibrio'),
    ('quiz-recrut-potencial-crescimento')
) AS f(flow_id)
CROSS JOIN (
  VALUES
    (
      'leve',
      jsonb_build_object(
        'profile_title', 'Você está num momento mais tranquilo com o dinheiro',
        'profile_summary', 'Pelas respostas, sobra um pouco e você não vive no aperto. É justamente nesse momento de calma que dá pra construir algo a mais, sem pressa e sem risco.',
        'frase_identificacao', 'Se você se identifica: hoje dá pra respirar, mas você sabe que depender de uma renda só sempre tem um limite.',
        'main_blocker', 'O que segura não é falta de dinheiro agora. É que quase tudo ainda vem de uma fonte só, e fonte única um dia aperta.',
        'consequence', 'Esperar não custa o seu sustento hoje. Custa o tempo, que é o que faz uma segunda fonte crescer.',
        'growth_potential', 'Dá pra começar pequeno, no conforto, sem largar nada do que você já faz. Um passo só.',
        'dica_rapida', 'Aproveite a calma de agora pra olhar isso com a cabeça fria, antes de virar urgência.',
        'cta_text', 'Quero falar com quem me enviou isso',
        'whatsapp_prefill', 'Oi! Respondi o que você me mandou. Tô num momento tranquilo, mas queria entender como criar uma segunda fonte com calma. Por onde eu começo?'
      )
    ),
    (
      'moderado',
      jsonb_build_object(
        'profile_title', 'Você ganha, mas o dinheiro escorrega',
        'profile_summary', 'Você se vira, mas tá tudo amarrado numa fonte de renda só, e é isso que prende o resto. No fim do mês some e você nem vê pra onde foi.',
        'frase_identificacao', 'Se você se identifica: não falta esforço. Falta o dinheiro parar de escorregar pelas mãos.',
        'main_blocker', 'O problema não é falta de trabalho. É que quase tudo depende de uma renda só.',
        'consequence', 'Enquanto for assim, o ano que vem tende a ser igual a esse.',
        'growth_potential', 'Dá pra começar pequeno, sem largar o que você já faz. Um passo só, no seu tempo.',
        'dica_rapida', 'Antes de falar, pense numa coisa: quanto tempo por semana você teria pra algo seu.',
        'cta_text', 'Quero dar o primeiro passo',
        'whatsapp_prefill', 'Oi! Respondi o que você me mandou e queria entender como dar o primeiro passo pra não depender de uma renda só, sem largar o que já faço.'
      )
    ),
    (
      'urgente',
      jsonb_build_object(
        'profile_title', 'O mês inteiro de trabalho e mesmo assim não fecha',
        'profile_summary', 'Pelas respostas, o aperto é real e vem todo mês. Não é que você faz pouco. É que tudo depende de uma renda só, e ela não tá dando conta.',
        'frase_identificacao', 'Se você se identifica: você não quer conversa enrolada, quer um caminho que caiba na sua vida.',
        'main_blocker', 'Não é você. É depender de uma fonte só. Quando ela aperta, aperta tudo junto.',
        'consequence', 'Cada mês assim é um mês que não volta. E sozinho, no mesmo caminho, ele tende a se repetir.',
        'growth_potential', 'O primeiro passo é uma conversa curta com quem te enviou isso, pra montar algo do seu jeito, sem promessa mágica.',
        'dica_rapida', 'Leve suas duas maiores dúvidas pra conversa. Em cinco minutos já dá pra ver se faz sentido.',
        'cta_text', 'Quero falar agora com quem me enviou',
        'whatsapp_prefill', 'Oi! Respondi o que você me mandou e o aperto tá real. Quero falar pra entender um próximo passo que caiba na minha vida.'
      )
    )
) AS a(archetype_code, content_json);
