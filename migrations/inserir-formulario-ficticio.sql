-- Script para inserir formulário fictício de teste
-- Execute este script no Supabase SQL Editor
-- Depois de testar, execute o script de remoção: remover-formularios-ficticios.sql
-- 
-- IMPORTANTE: Este script cria o formulário para o primeiro usuário nutri encontrado.
-- Se você não estiver vendo o formulário, verifique se está logado com o mesmo usuário.

DO $$
DECLARE
  v_user_id UUID;
  v_form_id UUID;
  v_user_email TEXT;
BEGIN
  -- Buscar o primeiro usuário nutri disponível
  SELECT u.id, u.email INTO v_user_id, v_user_email
  FROM auth.users u
  WHERE u.id IN (
    SELECT user_id FROM user_profiles WHERE perfil = 'nutri'
    LIMIT 1
  )
  LIMIT 1;

  -- Se não encontrar, tentar qualquer usuário
  IF v_user_id IS NULL THEN
    SELECT id, email INTO v_user_id, v_user_email
    FROM auth.users
    LIMIT 1;
  END IF;

  -- Verificar se encontrou um usuário
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum usuário encontrado. Faça login primeiro para criar um usuário.';
  END IF;

  RAISE NOTICE 'Criando formulário para o usuário: % (ID: %)', v_user_email, v_user_id;

  -- Inserir formulário de Anamnese Completa
  INSERT INTO custom_forms (
    user_id,
    name,
    description,
    form_type,
    structure,
    is_active,
    is_template,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'Anamnese Completa - Exemplo',
    'Formulário de exemplo com todos os tipos de campos disponíveis para teste',
    'anamnese',
    '{
      "fields": [
        {
          "id": "field_1",
          "type": "text",
          "label": "Nome Completo",
          "placeholder": "Digite seu nome completo",
          "required": true,
          "helpText": "Digite seu nome completo como aparece no documento"
        },
        {
          "id": "field_2",
          "type": "date",
          "label": "Data de Nascimento",
          "required": true,
          "helpText": "Selecione sua data de nascimento no calendário"
        },
        {
          "id": "field_3",
          "type": "email",
          "label": "E-mail",
          "placeholder": "seu@email.com",
          "required": true,
          "helpText": "E-mail para contato e envio de informações"
        },
        {
          "id": "field_4",
          "type": "tel",
          "label": "Telefone",
          "placeholder": "(11) 99999-9999",
          "required": true,
          "helpText": "Telefone com DDD para contato"
        },
        {
          "id": "field_5",
          "type": "select",
          "label": "Objetivo Principal",
          "required": true,
          "options": [
            "Emagrecer",
            "Ganhar massa muscular",
            "Manter peso atual",
            "Melhorar performance esportiva",
            "Melhorar saúde geral",
            "Tratamento de condição específica"
          ],
          "helpText": "Escolha o objetivo principal que você deseja alcançar"
        },
        {
          "id": "field_6",
          "type": "number",
          "label": "Peso Atual",
          "placeholder": "70",
          "required": true,
          "min": 30,
          "max": 300,
          "unit": "kg",
          "helpText": "Digite seu peso atual em quilogramas"
        },
        {
          "id": "field_7",
          "type": "number",
          "label": "Altura",
          "placeholder": "165",
          "required": true,
          "min": 100,
          "max": 250,
          "unit": "cm",
          "helpText": "Digite sua altura em centímetros"
        },
        {
          "id": "field_8",
          "type": "yesno",
          "label": "Pratica exercícios regularmente?",
          "required": true,
          "helpText": "Responda Sim ou Não"
        },
        {
          "id": "field_9",
          "type": "radio",
          "label": "Nível de Atividade Física",
          "required": false,
          "options": [
            "Sedentário (pouco ou nenhum exercício)",
            "Leve (exercício leve 1-3 dias/semana)",
            "Moderado (exercício moderado 3-5 dias/semana)",
            "Intenso (exercício intenso 6-7 dias/semana)",
            "Muito intenso (exercício muito intenso, trabalho físico)"
          ],
          "helpText": "Selecione o nível que melhor descreve sua rotina"
        },
        {
          "id": "field_10",
          "type": "checkbox",
          "label": "Sintomas Apresentados",
          "required": false,
          "options": [
            "Dor de cabeça frequente",
            "Cansaço excessivo",
            "Insônia",
            "Ansiedade",
            "Depressão",
            "Problemas digestivos",
            "Dores articulares",
            "Nenhum dos acima"
          ],
          "helpText": "Marque todas as opções que se aplicam a você"
        },
        {
          "id": "field_11",
          "type": "range",
          "label": "Nível de Energia (1-10)",
          "required": false,
          "min": 1,
          "max": 10,
          "step": 1,
          "helpText": "Arraste o indicador para escolher seu nível de energia atual"
        },
        {
          "id": "field_12",
          "type": "time",
          "label": "Horário do Café da Manhã",
          "required": false,
          "helpText": "Selecione o horário que você costuma tomar café da manhã"
        },
        {
          "id": "field_13",
          "type": "textarea",
          "label": "Histórico de Dietas Anteriores",
          "placeholder": "Descreva suas experiências com dietas anteriores...",
          "required": false,
          "helpText": "Conte sobre dietas que você já tentou, o que funcionou e o que não funcionou"
        },
        {
          "id": "field_14",
          "type": "textarea",
          "label": "Alergias e Intolerâncias Alimentares",
          "placeholder": "Liste suas alergias e intolerâncias...",
          "required": false,
          "helpText": "Informe todas as alergias e intolerâncias alimentares conhecidas"
        },
        {
          "id": "field_15",
          "type": "textarea",
          "label": "Medicamentos em Uso",
          "placeholder": "Liste os medicamentos que você toma regularmente...",
          "required": false,
          "helpText": "Informe medicamentos, suplementos ou vitaminas que você toma"
        },
        {
          "id": "field_16",
          "type": "range",
          "label": "Nível de Satisfação com Alimentação Atual (1-10)",
          "required": false,
          "min": 1,
          "max": 10,
          "step": 1,
          "helpText": "Como você avalia sua satisfação com sua alimentação atual?"
        },
        {
          "id": "field_17",
          "type": "yesno",
          "label": "Tem restrições alimentares por religião ou cultura?",
          "required": false,
          "helpText": "Responda Sim ou Não"
        },
        {
          "id": "field_18",
          "type": "textarea",
          "label": "Observações Adicionais",
          "placeholder": "Alguma informação adicional que gostaria de compartilhar?",
          "required": false,
          "helpText": "Use este espaço para compartilhar qualquer informação relevante"
        }
      ]
    }'::jsonb,
    true,
    false,
    NOW(),
    NOW()
  ) RETURNING id INTO v_form_id;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Formulário fictício criado com sucesso!';
  RAISE NOTICE 'ID do Formulário: %', v_form_id;
  RAISE NOTICE 'Usuário: % (ID: %)', v_user_email, v_user_id;
  RAISE NOTICE '========================================';
  RAISE NOTICE 'IMPORTANTE: Certifique-se de estar logado com o usuário acima para ver o formulário.';
  RAISE NOTICE 'Para remover, execute: remover-formularios-ficticios.sql';

END $$;

