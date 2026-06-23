-- 451 — Lote 3 (vendas): devolutiva AFIADA do bloco Ansiedade por Doce / Fome Emocional.
--
-- Leitura PRÓPRIA (fome emocional / vontade de doce) — bloco separado de Corpo e Energia.
-- 1 flow_id: ansiedade-doce. A abertura vive no contrato YladaFlow
-- (src/lib/ylada-flow/bibliotecas/vendas/blocos/ansiedade-doce.ts); aqui só os outcomes (DOR).
--
-- SUBSTITUI a copy morna anterior (migration 389) pela versão afiada pela Régua.
--
-- ⚠️ TEMA SENSÍVEL (bem-estar): SEM promessa de emagrecer, SEM diagnóstico (não é transtorno),
-- a causa SEMPRE ALIVIA a culpa (não reforça), SEM restrição ("corte o açúcar"/"força de vontade"),
-- SEM termo de produto/Herbalife, SEM salvaguarda clínica. CTA = falar com uma PESSOA (quem enviou).
--
-- Eixo = DOR (RISK): archetype_code leve/moderado/urgente = TOM. Prontidão fica no contrato (runtime).
-- Mesmo schema da 447/449 (RISK_DIAGNOSIS, diagnosis_vertical NULL). Idempotente.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id = 'ansiedade-doce';

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  (
    'ansiedade-doce',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'A vontade de doce aparece, mas você ainda segura',
      'profile_summary', 'Pelas respostas, a vontade bate em alguns momentos, mas na maior parte do tempo você consegue lidar. É um bom momento pra entender o gatilho com calma.',
      'frase_identificacao', 'Se isso é você: não é um problema grande, mas você sente que podia ter mais equilíbrio.',
      'main_blocker', 'Quase sempre a vontade vem da cabeça (cansaço, ansiedade, tédio), não da fome de verdade. Saber disso já ajuda.',
      'consequence', 'Sem entender o gatilho, o que é ocasional pode ir virando hábito sem você perceber.',
      'growth_potential', 'Dá pra começar pequeno, sem dieta nem corte radical. Reparar quando a vontade vem já é o primeiro passo.',
      'dica_rapida', 'Da próxima vez, antes de ceder, repara: é fome mesmo ou é a cabeça pedindo uma pausa? Sem cobrança, só observar.',
      'cta_text', 'Quero entender minha vontade de doce',
      'whatsapp_prefill', 'Oi! Respondi o que você me mandou. Tenho vontade de doce em alguns momentos e queria entender de onde vem, sem dieta radical. Por onde eu começo?'
    )
  ),
  (
    'ansiedade-doce',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'A vontade de doce já manda mais do que você gostaria',
      'profile_summary', 'A vontade aparece forte em vários momentos e quase sempre ligada ao cansaço ou à ansiedade. Não é fome, é a cabeça pedindo alívio, e isso cansa.',
      'frase_identificacao', 'Se isso é você: não falta força de vontade. Falta entender o que dispara a vontade pra poder lidar com ela.',
      'main_blocker', 'A causa não é fraqueza sua. É o doce virando uma válvula de escape rápida pro estresse e pra queda de energia.',
      'consequence', 'Enquanto o gatilho não for entendido, o ciclo se repete: aperta, cede, incomoda, e volta no dia seguinte.',
      'growth_potential', 'Dá pra começar pequeno, sem corte radical e sem culpa. Um ajuste por vez, no seu ritmo.',
      'dica_rapida', 'Comer com mais regularidade ao longo do dia costuma tirar boa parte da força dessa vontade. Vale conversar sobre isso.',
      'cta_text', 'Quero dar o primeiro passo',
      'whatsapp_prefill', 'Oi! Respondi o que você me mandou. Minha vontade de doce aparece forte e quase sempre no cansaço/ansiedade. Quero entender como lidar com isso.'
    )
  ),
  (
    'ansiedade-doce',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'A vontade de doce está pesando, e você não precisa lidar com isso sozinha',
      'profile_summary', 'A vontade aparece muito forte, difícil de resistir, e depois vem aquele desconforto. Isso costuma estar mais ligado ao que você sente do que ao que você come.',
      'frase_identificacao', 'Se isso é você: você já tentou na força de vontade e cansou. O caminho não é se cobrar mais, é ter apoio.',
      'main_blocker', 'Não é falta de disciplina. Quando a vontade vira o jeito de aliviar a ansiedade e o cansaço, força de vontade sozinha não dá conta, e a culpa só piora.',
      'consequence', 'Carregar isso sozinha e na cobrança costuma alimentar o próprio ciclo. Com apoio, fica bem mais leve de virar.',
      'growth_potential', 'O melhor passo é uma conversa curta com quem te enviou isso, pra começar com algo simples e sem julgamento, no seu tempo.',
      'dica_rapida', 'Repara nos momentos em que a vontade vem mais forte. Levar isso pra conversa ajuda a achar um caminho que caiba em você.',
      'cta_text', 'Quero conversar sobre isso',
      'whatsapp_prefill', 'Oi! Respondi o que você me mandou. A vontade de doce tá pesando e cansei de tentar sozinha. Quero conversar pra achar um caminho mais leve.'
    )
  );
