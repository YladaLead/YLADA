-- =====================================================
-- SETUP: nutri1@ylada.com - AMBIENTE COMPLETO
-- =====================================================
-- Cenário: Nutricionista já usando há tempo
-- - Perfil completo
-- - Formulários criados
-- - Respostas de clientes
-- - Algumas não visualizadas (para badge)
-- - Clientes cadastrados
-- =====================================================

-- =====================================================
-- PARTE 1: CRIAR/VERIFICAR USUÁRIO
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_nutri_profile_id UUID;
  v_form_anamnese_id UUID;
  v_form_recordatorio_id UUID;
  v_form_custom_id UUID;
  v_cliente1_id UUID;
  v_cliente2_id UUID;
  v_cliente3_id UUID;
BEGIN

  -- Buscar ou criar usuário nutri1@ylada.com
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'nutri1@ylada.com';

  IF v_user_id IS NULL THEN
    -- Criar usuário (caso não exista)
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'nutri1@ylada.com',
      crypt('Ylada2025!', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"nome_completo":"Nutricionista Teste Completo"}',
      false,
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO v_user_id;
    
    RAISE NOTICE '✅ Usuário nutri1@ylada.com criado: %', v_user_id;
  ELSE
    RAISE NOTICE '✅ Usuário nutri1@ylada.com já existe: %', v_user_id;
  END IF;

  -- =====================================================
  -- PARTE 2: CRIAR PERFIL DE NUTRICIONISTA
  -- =====================================================

  -- Deletar perfil anterior se existir
  DELETE FROM nutri_profiles WHERE user_id = v_user_id;

  -- Criar perfil completo
  INSERT INTO nutri_profiles (
    user_id,
    nome_completo,
    email,
    telefone,
    crn,
    crn_estado,
    especialidades,
    bio,
    foto_url,
    instagram,
    website,
    user_slug,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'Dra. Mariana Silva',
    'nutri1@ylada.com',
    '(11) 98765-4321',
    '12345',
    'SP',
    ARRAY['Emagrecimento', 'Nutrição Esportiva', 'Gestantes'],
    'Nutricionista com 10 anos de experiência, especializada em emagrecimento saudável e nutrição esportiva. Apaixonada por ajudar pessoas a transformarem sua relação com a comida.',
    'https://i.pravatar.cc/300?img=47',
    '@dramariana.nutri',
    'https://marianasilva.com.br',
    'dramariana',
    NOW(),
    NOW()
  )
  RETURNING id INTO v_nutri_profile_id;

  RAISE NOTICE '✅ Perfil nutri criado: %', v_nutri_profile_id;

  -- =====================================================
  -- PARTE 3: CRIAR CLIENTES (LEADS)
  -- =====================================================

  -- Cliente 1: Ana Paula
  INSERT INTO leads (
    user_id,
    name,
    email,
    phone,
    source,
    status,
    notes,
    tags,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'Ana Paula Costa',
    'ana.costa@email.com',
    '(11) 99123-4567',
    'formulario',
    'active',
    'Cliente engajada, já perdeu 5kg nas primeiras 4 semanas',
    ARRAY['Emagrecimento', 'Compulsão Alimentar'],
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '2 days'
  )
  RETURNING id INTO v_cliente1_id;

  -- Cliente 2: Roberto Santos
  INSERT INTO leads (
    user_id,
    name,
    email,
    phone,
    source,
    status,
    notes,
    tags,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'Roberto Santos',
    'roberto.santos@email.com',
    '(11) 98234-5678',
    'formulario',
    'active',
    'Atleta amador, treina 5x por semana',
    ARRAY['Performance Esportiva', 'Hipertrofia'],
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '5 days'
  )
  RETURNING id INTO v_cliente2_id;

  -- Cliente 3: Júlia Mendes
  INSERT INTO leads (
    user_id,
    name,
    email,
    phone,
    source,
    status,
    notes,
    tags,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'Júlia Mendes',
    'julia.mendes@email.com',
    '(11) 97345-6789',
    'formulario',
    'lead',
    'Preencheu anamnese hoje, aguardando primeira consulta',
    ARRAY['Emagrecimento', 'Ansiedade'],
    NOW() - INTERVAL '1 day',
    NOW()
  )
  RETURNING id INTO v_cliente3_id;

  RAISE NOTICE '✅ Clientes criados: Ana (%), Roberto (%), Júlia (%)', v_cliente1_id, v_cliente2_id, v_cliente3_id;

  -- =====================================================
  -- PARTE 4: CRIAR FORMULÁRIOS
  -- =====================================================

  -- Formulário 1: Anamnese Inicial (baseado no template)
  INSERT INTO custom_forms (
    id,
    user_id,
    name,
    description,
    form_type,
    structure,
    is_active,
    is_template,
    slug,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_user_id,
    'Anamnese Inicial - Novos Clientes',
    'Anamnese completa para primeira consulta. Coleta dados pessoais, histórico de saúde, objetivos e hábitos alimentares.',
    'anamnese',
    '[
      {"id":"1","type":"text","label":"Nome Completo","required":true,"placeholder":"Seu nome completo"},
      {"id":"2","type":"email","label":"E-mail","required":true,"placeholder":"seu@email.com"},
      {"id":"3","type":"tel","label":"Telefone/WhatsApp","required":true,"placeholder":"(00) 00000-0000"},
      {"id":"4","type":"number","label":"Idade","required":true},
      {"id":"5","type":"radio","label":"Sexo","required":true,"options":["Feminino","Masculino","Outro"]},
      {"id":"6","type":"number","label":"Peso Atual (kg)","required":true,"step":"0.1"},
      {"id":"7","type":"number","label":"Altura (cm)","required":true},
      {"id":"8","type":"select","label":"Objetivo Principal","required":true,"options":["Emagrecimento","Ganho de massa muscular","Melhora da saúde","Controle de doença","Performance esportiva","Outro"]},
      {"id":"9","type":"textarea","label":"Descreva seu objetivo com mais detalhes","required":false},
      {"id":"10","type":"checkbox","label":"Restrições Alimentares","required":false,"options":["Lactose","Glúten","Vegetariano/Vegano","Alergia a frutos do mar","Alergia a oleaginosas","Nenhuma"]},
      {"id":"11","type":"textarea","label":"Tem alguma doença ou condição de saúde?","required":false,"placeholder":"Diabetes, hipertensão, etc."},
      {"id":"12","type":"radio","label":"Pratica atividade física?","required":true,"options":["Não pratico","1-2x por semana","3-4x por semana","5+ por semana"]},
      {"id":"13","type":"textarea","label":"Descreva sua rotina alimentar (café, almoço, jantar, lanches)","required":true},
      {"id":"14","type":"radio","label":"Como é seu apetite normalmente?","required":false,"options":["Muito baixo","Normal","Alto","Muito alto"]},
      {"id":"15","type":"checkbox","label":"Você tem algum desses comportamentos?","required":false,"options":["Beliscar entre refeições","Comer por ansiedade/estresse","Pular refeições","Exagerar em finais de semana","Comer rápido demais","Comer vendo TV/celular"]}
    ]'::jsonb,
    true,
    false,
    'anamnese-inicial-novos-clientes',
    NOW() - INTERVAL '60 days',
    NOW() - INTERVAL '60 days'
  )
  RETURNING id INTO v_form_anamnese_id;

  RAISE NOTICE '✅ Formulário Anamnese criado: %', v_form_anamnese_id;

  -- Formulário 2: Recordatório Alimentar 24h
  INSERT INTO custom_forms (
    id,
    user_id,
    name,
    description,
    form_type,
    structure,
    is_active,
    is_template,
    slug,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_user_id,
    'Recordatório 24h - Acompanhamento',
    'Registro do que foi consumido nas últimas 24 horas',
    'recordatorio',
    '[
      {"id":"1","type":"text","label":"Nome","required":true},
      {"id":"2","type":"date","label":"Data de Referência","required":true},
      {"id":"3","type":"time","label":"Café da Manhã - Horário","required":false},
      {"id":"4","type":"textarea","label":"Café da Manhã - O que você comeu/bebeu?","required":false},
      {"id":"5","type":"time","label":"Lanche da Manhã - Horário","required":false},
      {"id":"6","type":"textarea","label":"Lanche da Manhã - O que você comeu/bebeu?","required":false},
      {"id":"7","type":"time","label":"Almoço - Horário","required":false},
      {"id":"8","type":"textarea","label":"Almoço - O que você comeu/bebeu?","required":false},
      {"id":"9","type":"time","label":"Lanche da Tarde - Horário","required":false},
      {"id":"10","type":"textarea","label":"Lanche da Tarde - O que você comeu/bebeu?","required":false},
      {"id":"11","type":"time","label":"Jantar - Horário","required":false},
      {"id":"12","type":"textarea","label":"Jantar - O que você comeu/bebeu?","required":false},
      {"id":"13","type":"time","label":"Ceia - Horário","required":false},
      {"id":"14","type":"textarea","label":"Ceia - O que você comeu/bebeu?","required":false},
      {"id":"15","type":"number","label":"Quantos copos de água você bebeu?","required":false,"min":"0"}
    ]'::jsonb,
    true,
    false,
    'recordatorio-24h-acompanhamento',
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '45 days'
  )
  RETURNING id INTO v_form_recordatorio_id;

  RAISE NOTICE '✅ Formulário Recordatório criado: %', v_form_recordatorio_id;

  -- Formulário 3: Avaliação Semanal (personalizado)
  INSERT INTO custom_forms (
    id,
    user_id,
    name,
    description,
    form_type,
    structure,
    is_active,
    is_template,
    slug,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_user_id,
    'Check-in Semanal',
    'Acompanhamento semanal para clientes em atendimento',
    'acompanhamento',
    '[
      {"id":"1","type":"text","label":"Nome","required":true},
      {"id":"2","type":"number","label":"Peso desta semana (kg)","required":true,"step":"0.1"},
      {"id":"3","type":"radio","label":"Como foi a aderência ao plano alimentar?","required":true,"options":["Ótima (segui 90-100%)","Boa (segui 70-89%)","Regular (segui 50-69%)","Difícil (menos de 50%)"]},
      {"id":"4","type":"checkbox","label":"Quais foram os principais desafios?","required":false,"options":["Trabalho corrido","Eventos sociais","Ansiedade","Compulsão alimentar","Falta de planejamento","Falta de tempo para cozinhar","Nenhum"]},
      {"id":"5","type":"radio","label":"Como está se sentindo?","required":true,"options":["Muito bem","Bem","Normal","Cansado(a)","Estressado(a)"]},
      {"id":"6","type":"textarea","label":"Observações ou dúvidas","required":false}
    ]'::jsonb,
    true,
    false,
    'checkin-semanal',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days'
  )
  RETURNING id INTO v_form_custom_id;

  RAISE NOTICE '✅ Formulário Check-in criado: %', v_form_custom_id;

  -- =====================================================
  -- PARTE 5: CRIAR RESPOSTAS DOS FORMULÁRIOS
  -- =====================================================

  -- Respostas da Ana Paula (3 respostas)
  
  -- Resposta 1: Anamnese da Ana (há 45 dias) - VISUALIZADA
  INSERT INTO form_responses (
    form_id,
    user_id,
    client_id,
    respondent_name,
    respondent_email,
    respondent_phone,
    responses,
    ip_address,
    user_agent,
    viewed,
    viewed_at,
    created_at
  ) VALUES (
    v_form_anamnese_id,
    v_user_id,
    v_cliente1_id,
    'Ana Paula Costa',
    'ana.costa@email.com',
    '(11) 99123-4567',
    '{
      "1": "Ana Paula Costa",
      "2": "ana.costa@email.com",
      "3": "(11) 99123-4567",
      "4": "32",
      "5": "Feminino",
      "6": "78.5",
      "7": "165",
      "8": "Emagrecimento",
      "9": "Quero perder 15kg de forma saudável e aprender a me alimentar melhor. Já tentei várias dietas mas sempre volto a engordar.",
      "10": ["Lactose"],
      "11": "Nenhuma doença diagnosticada",
      "12": "3-4x por semana",
      "13": "Café: Pão com margarina e café com leite. Almoço: Arroz, feijão, carne e salada. Jantar: Similar ao almoço. Lanches: Frutas ou biscoitos.",
      "14": "Alto",
      "15": ["Comer por ansiedade/estresse", "Beliscar entre refeições", "Exagerar em finais de semana"]
    }'::jsonb,
    '192.168.1.1',
    'Mozilla/5.0',
    true,
    NOW() - INTERVAL '44 days',
    NOW() - INTERVAL '45 days'
  );

  -- Resposta 2: Check-in semanal Ana (há 7 dias) - VISUALIZADA
  INSERT INTO form_responses (
    form_id,
    user_id,
    client_id,
    respondent_name,
    respondent_email,
    respondent_phone,
    responses,
    viewed,
    viewed_at,
    created_at
  ) VALUES (
    v_form_custom_id,
    v_user_id,
    v_cliente1_id,
    'Ana Paula Costa',
    'ana.costa@email.com',
    '(11) 99123-4567',
    '{
      "1": "Ana Paula Costa",
      "2": "73.5",
      "3": "Ótima (segui 90-100%)",
      "4": ["Nenhum"],
      "5": "Muito bem",
      "6": "Estou adorando as receitas! Me sentindo mais disposta."
    }'::jsonb,
    true,
    NOW() - INTERVAL '6 days',
    NOW() - INTERVAL '7 days'
  );

  -- Resposta 3: Check-in Ana (ONTEM) - NÃO VISUALIZADA ⭐
  INSERT INTO form_responses (
    form_id,
    user_id,
    client_id,
    respondent_name,
    respondent_email,
    respondent_phone,
    responses,
    viewed,
    created_at
  ) VALUES (
    v_form_custom_id,
    v_user_id,
    v_cliente1_id,
    'Ana Paula Costa',
    'ana.costa@email.com',
    '(11) 99123-4567',
    '{
      "1": "Ana Paula Costa",
      "2": "72.8",
      "3": "Boa (segui 70-89%)",
      "4": ["Eventos sociais"],
      "5": "Bem",
      "6": "Tive um almoço de família no domingo, mas consegui fazer boas escolhas!"
    }'::jsonb,
    false,
    NOW() - INTERVAL '1 day'
  );

  -- Respostas do Roberto (2 respostas)
  
  -- Resposta 4: Anamnese Roberto (há 30 dias) - VISUALIZADA
  INSERT INTO form_responses (
    form_id,
    user_id,
    client_id,
    respondent_name,
    respondent_email,
    respondent_phone,
    responses,
    viewed,
    viewed_at,
    created_at
  ) VALUES (
    v_form_anamnese_id,
    v_user_id,
    v_cliente2_id,
    'Roberto Santos',
    'roberto.santos@email.com',
    '(11) 98234-5678',
    '{
      "1": "Roberto Santos",
      "2": "roberto.santos@email.com",
      "3": "(11) 98234-5678",
      "4": "28",
      "5": "Masculino",
      "6": "75",
      "7": "178",
      "8": "Ganho de massa muscular",
      "9": "Quero aumentar massa muscular e melhorar performance na corrida. Treino musculação 4x e corro 2x por semana.",
      "10": ["Nenhuma"],
      "11": "Nenhuma",
      "12": "5+ por semana",
      "13": "Como bastante proteína. Café: Ovos e aveia. Almoço e jantar: Frango/carne, arroz integral, batata doce, salada. Lanches pré e pós treino.",
      "14": "Muito alto",
      "15": ["Comer rápido demais"]
    }'::jsonb,
    true,
    NOW() - INTERVAL '29 days',
    NOW() - INTERVAL '30 days'
  );

  -- Resposta 5: Recordatório Roberto (há 5 dias) - VISUALIZADA
  INSERT INTO form_responses (
    form_id,
    user_id,
    client_id,
    respondent_name,
    respondent_email,
    respondent_phone,
    responses,
    viewed,
    viewed_at,
    created_at
  ) VALUES (
    v_form_recordatorio_id,
    v_user_id,
    v_cliente2_id,
    'Roberto Santos',
    'roberto.santos@email.com',
    '(11) 98234-5678',
    '{
      "1": "Roberto Santos",
      "2": "2024-12-13",
      "3": "06:30",
      "4": "4 ovos mexidos, 2 fatias pão integral, 1 banana, whey protein",
      "5": "10:00",
      "6": "Pasta de amendoim com tapioca",
      "7": "13:00",
      "8": "Peito de frango grelhado (200g), arroz integral (150g), batata doce (200g), brócolis",
      "9": "16:30",
      "10": "Shake de whey com banana e aveia",
      "11": "20:00",
      "12": "Salmão grelhado (180g), quinoa, legumes no vapor",
      "13": "22:30",
      "14": "Iogurte grego com granola",
      "15": "3"
    }'::jsonb,
    true,
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '5 days'
  );

  -- Respostas da Júlia (2 respostas recentes)
  
  -- Resposta 6: Anamnese Júlia (HOJE) - NÃO VISUALIZADA ⭐
  INSERT INTO form_responses (
    form_id,
    user_id,
    client_id,
    respondent_name,
    respondent_email,
    respondent_phone,
    responses,
    viewed,
    created_at
  ) VALUES (
    v_form_anamnese_id,
    v_user_id,
    v_cliente3_id,
    'Júlia Mendes',
    'julia.mendes@email.com',
    '(11) 97345-6789',
    '{
      "1": "Júlia Mendes",
      "2": "julia.mendes@email.com",
      "3": "(11) 97345-6789",
      "4": "35",
      "5": "Feminino",
      "6": "85",
      "7": "160",
      "8": "Emagrecimento",
      "9": "Preciso emagrecer 20kg. Tenho muita compulsão alimentar, principalmente à noite. Trabalho home office e acabo beliscando o dia todo.",
      "10": ["Nenhuma"],
      "11": "Ansiedade (faço acompanhamento psicológico)",
      "12": "Não pratico",
      "13": "Pulo o café da manhã. Almoço o que tem em casa (geralmente massa ou arroz com alguma coisa). Jantar: pizza, lanches ou delivery. Belisco muito entre as refeições.",
      "14": "Alto",
      "15": ["Beliscar entre refeições", "Comer por ansiedade/estresse", "Pular refeições", "Exagerar em finais de semana", "Comer vendo TV/celular"]
    }'::jsonb,
    false,
    NOW() - INTERVAL '3 hours'
  );

  -- Resposta 7: Recordatório Júlia (HOJE - 1 hora atrás) - NÃO VISUALIZADA ⭐
  INSERT INTO form_responses (
    form_id,
    user_id,
    client_id,
    respondent_name,
    respondent_email,
    respondent_phone,
    responses,
    viewed,
    created_at
  ) VALUES (
    v_form_recordatorio_id,
    v_user_id,
    v_cliente3_id,
    'Júlia Mendes',
    'julia.mendes@email.com',
    '(11) 97345-6789',
    '{
      "1": "Júlia Mendes",
      "2": "2024-12-17",
      "3": "",
      "4": "Não tomei café",
      "5": "11:00",
      "6": "Biscoitos recheados (uns 5)",
      "7": "14:30",
      "8": "Macarrão instantâneo e refrigerante",
      "9": "17:00",
      "10": "Chocolate e mais biscoitos",
      "11": "21:00",
      "12": "Pizza (4 pedaços) e sorvete",
      "13": "",
      "14": "",
      "15": "2"
    }'::jsonb,
    false,
    NOW() - INTERVAL '1 hour'
  );

  RAISE NOTICE '✅ 7 respostas criadas (3 não visualizadas para badge aparecer)';

  -- =====================================================
  -- RESUMO FINAL
  -- =====================================================
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ SETUP COMPLETO: nutri1@ylada.com';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Email: nutri1@ylada.com';
  RAISE NOTICE 'Senha: Ylada2025!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Dados Criados:';
  RAISE NOTICE '  - 1 perfil completo (Dra. Mariana Silva)';
  RAISE NOTICE '  - 3 clientes cadastrados';
  RAISE NOTICE '  - 3 formulários ativos';
  RAISE NOTICE '  - 7 respostas (3 NÃO VISUALIZADAS)';
  RAISE NOTICE '';
  RAISE NOTICE '🔔 Badge aparecerá com: 3 respostas não lidas';
  RAISE NOTICE '';
  RAISE NOTICE 'Pronto para demonstração do ambiente COMPLETO!';
  RAISE NOTICE '========================================';

END $$;
