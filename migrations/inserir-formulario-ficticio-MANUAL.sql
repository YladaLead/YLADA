-- Script para inserir formulário fictício de teste (VERSÃO MANUAL)
-- Use este script se o automático não funcionar
-- 
-- INSTRUÇÕES:
-- 1. Execute este comando no Supabase SQL Editor para descobrir seu user_id:
--    SELECT id, email FROM auth.users WHERE id IN (SELECT user_id FROM user_profiles WHERE perfil = 'nutri');
--
-- 2. Substitua 'SEU_USER_ID_AQUI' abaixo pelo seu user_id real
-- 3. Execute o script completo

DO $$
DECLARE
  v_user_id UUID := 'SEU_USER_ID_AQUI'::UUID;  -- SUBSTITUA AQUI pelo seu user_id
  v_form_id UUID;
BEGIN
  -- Verificar se o user_id é válido
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_id) THEN
    RAISE EXCEPTION 'User ID inválido. Execute primeiro: SELECT id, email FROM auth.users WHERE id IN (SELECT user_id FROM user_profiles WHERE perfil = ''nutri'');';
  END IF;

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

  RAISE NOTICE 'Formulário fictício criado com sucesso! ID: %', v_form_id;

END $$;

