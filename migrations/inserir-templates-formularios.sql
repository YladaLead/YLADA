-- =====================================================
-- MIGRAÇÃO: Inserir Templates de Formulários
-- Data: 2025-01-18
-- =====================================================
-- Templates pré-definidos para nutricionistas:
-- 1. Anamnese Básica
-- 2. Recordatório Alimentar 24h
-- =====================================================

-- Primeiro, vamos verificar se já existem templates com estes nomes
-- e deletar se existirem (para evitar duplicação)
DELETE FROM custom_forms 
WHERE is_template = true 
AND name IN ('Anamnese Nutricional Básica', 'Recordatório Alimentar 24h');

-- =====================================================
-- TEMPLATE 1: ANAMNESE NUTRICIONAL BÁSICA
-- =====================================================
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
  (SELECT id FROM auth.users LIMIT 1), -- User padrão do sistema (primeiro usuário)
  'Anamnese Nutricional Básica',
  'Template completo de anamnese nutricional com dados pessoais, histórico de saúde, hábitos alimentares e objetivo nutricional.',
  'anamnese',
  '{
    "fields": [
      {
        "id": "nome_completo",
        "type": "text",
        "label": "Nome Completo",
        "placeholder": "Digite seu nome completo",
        "required": true
      },
      {
        "id": "email",
        "type": "email",
        "label": "E-mail",
        "placeholder": "seu@email.com",
        "required": true
      },
      {
        "id": "telefone",
        "type": "tel",
        "label": "Telefone / WhatsApp",
        "placeholder": "(00) 00000-0000",
        "required": true
      },
      {
        "id": "data_nascimento",
        "type": "date",
        "label": "Data de Nascimento",
        "required": true
      },
      {
        "id": "sexo",
        "type": "radio",
        "label": "Sexo",
        "options": ["Feminino", "Masculino", "Outro"],
        "required": true
      },
      {
        "id": "objetivo_principal",
        "type": "select",
        "label": "Qual seu principal objetivo?",
        "options": [
          "Emagrecimento",
          "Ganho de massa muscular",
          "Melhora da saúde",
          "Tratamento de doença específica",
          "Melhora da performance esportiva",
          "Outro"
        ],
        "required": true
      },
      {
        "id": "peso_atual",
        "type": "text",
        "label": "Peso Atual (kg)",
        "placeholder": "Ex: 70",
        "required": true
      },
      {
        "id": "altura",
        "type": "text",
        "label": "Altura (cm)",
        "placeholder": "Ex: 170",
        "required": true
      },
      {
        "id": "tem_doenca",
        "type": "yesno",
        "label": "Possui alguma doença diagnosticada?",
        "required": true
      },
      {
        "id": "quais_doencas",
        "type": "textarea",
        "label": "Se sim, quais doenças?",
        "placeholder": "Descreva as doenças diagnosticadas",
        "required": false
      },
      {
        "id": "usa_medicamento",
        "type": "yesno",
        "label": "Usa algum medicamento regularmente?",
        "required": true
      },
      {
        "id": "quais_medicamentos",
        "type": "textarea",
        "label": "Se sim, quais medicamentos?",
        "placeholder": "Liste os medicamentos e dosagens",
        "required": false
      },
      {
        "id": "alergia_intolerancia",
        "type": "yesno",
        "label": "Possui alguma alergia ou intolerância alimentar?",
        "required": true
      },
      {
        "id": "quais_alergias",
        "type": "textarea",
        "label": "Se sim, quais alergias/intolerâncias?",
        "placeholder": "Ex: lactose, glúten, frutos do mar",
        "required": false
      },
      {
        "id": "restricoes_alimentares",
        "type": "checkbox",
        "label": "Possui alguma restrição alimentar?",
        "options": [
          "Vegetariano",
          "Vegano",
          "Sem lactose",
          "Sem glúten",
          "Sem açúcar",
          "Religiosa (halal, kosher, etc)",
          "Outra"
        ],
        "required": false
      },
      {
        "id": "pratica_exercicio",
        "type": "yesno",
        "label": "Pratica atividade física regularmente?",
        "required": true
      },
      {
        "id": "tipo_exercicio",
        "type": "textarea",
        "label": "Se sim, qual tipo de exercício e frequência?",
        "placeholder": "Ex: Musculação 3x/semana, Corrida 2x/semana",
        "required": false
      },
      {
        "id": "habitos_intestinais",
        "type": "radio",
        "label": "Como está seu hábito intestinal?",
        "options": [
          "Regular (todos os dias)",
          "Às vezes constipado",
          "Às vezes com diarreia",
          "Irregular"
        ],
        "required": true
      },
      {
        "id": "consumo_agua",
        "type": "radio",
        "label": "Quanto de água você bebe por dia?",
        "options": [
          "Menos de 1 litro",
          "1 a 2 litros",
          "Mais de 2 litros"
        ],
        "required": true
      },
      {
        "id": "habito_cafe_manha",
        "type": "yesno",
        "label": "Você toma café da manhã?",
        "required": true
      },
      {
        "id": "come_fora_casa",
        "type": "radio",
        "label": "Com que frequência você come fora de casa?",
        "options": [
          "Raramente",
          "1-2 vezes por semana",
          "3-4 vezes por semana",
          "Diariamente"
        ],
        "required": true
      },
      {
        "id": "come_ansiedade",
        "type": "yesno",
        "label": "Você come quando está ansioso(a) ou estressado(a)?",
        "required": true
      },
      {
        "id": "tentativas_anteriores",
        "type": "textarea",
        "label": "Já tentou fazer dieta antes? Como foi a experiência?",
        "placeholder": "Descreva suas experiências anteriores com dietas",
        "required": false
      },
      {
        "id": "observacoes",
        "type": "textarea",
        "label": "Observações Adicionais",
        "placeholder": "Qualquer informação que você considere importante",
        "required": false
      }
    ]
  }'::jsonb,
  true,
  true,
  'anamnese-nutricional-basica',
  NOW(),
  NOW()
);

-- =====================================================
-- TEMPLATE 2: RECORDATÓRIO ALIMENTAR 24H
-- =====================================================
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
  (SELECT id FROM auth.users LIMIT 1), -- User padrão do sistema
  'Recordatório Alimentar 24h',
  'Template para registro detalhado do consumo alimentar das últimas 24 horas.',
  'questionario',
  '{
    "fields": [
      {
        "id": "nome",
        "type": "text",
        "label": "Nome",
        "placeholder": "Digite seu nome",
        "required": true
      },
      {
        "id": "data_registro",
        "type": "date",
        "label": "Data do Registro",
        "required": true
      },
      {
        "id": "dia_tipico",
        "type": "yesno",
        "label": "Ontem foi um dia típico de alimentação para você?",
        "required": true
      },
      {
        "id": "cafe_manha_horario",
        "type": "time",
        "label": "Café da Manhã - Horário",
        "required": false
      },
      {
        "id": "cafe_manha_alimentos",
        "type": "textarea",
        "label": "Café da Manhã - O que você comeu e bebeu?",
        "placeholder": "Liste todos os alimentos e bebidas, com quantidades aproximadas",
        "required": false
      },
      {
        "id": "lanche_manha_horario",
        "type": "time",
        "label": "Lanche da Manhã - Horário",
        "required": false
      },
      {
        "id": "lanche_manha_alimentos",
        "type": "textarea",
        "label": "Lanche da Manhã - O que você comeu e bebeu?",
        "placeholder": "Liste todos os alimentos e bebidas, com quantidades aproximadas",
        "required": false
      },
      {
        "id": "almoco_horario",
        "type": "time",
        "label": "Almoço - Horário",
        "required": false
      },
      {
        "id": "almoco_alimentos",
        "type": "textarea",
        "label": "Almoço - O que você comeu e bebeu?",
        "placeholder": "Liste todos os alimentos e bebidas, com quantidades aproximadas (ex: 1 prato de arroz, 2 colheres de feijão)",
        "required": false
      },
      {
        "id": "lanche_tarde_horario",
        "type": "time",
        "label": "Lanche da Tarde - Horário",
        "required": false
      },
      {
        "id": "lanche_tarde_alimentos",
        "type": "textarea",
        "label": "Lanche da Tarde - O que você comeu e bebeu?",
        "placeholder": "Liste todos os alimentos e bebidas, com quantidades aproximadas",
        "required": false
      },
      {
        "id": "jantar_horario",
        "type": "time",
        "label": "Jantar - Horário",
        "required": false
      },
      {
        "id": "jantar_alimentos",
        "type": "textarea",
        "label": "Jantar - O que você comeu e bebeu?",
        "placeholder": "Liste todos os alimentos e bebidas, com quantidades aproximadas",
        "required": false
      },
      {
        "id": "ceia_horario",
        "type": "time",
        "label": "Ceia / Lanche Noturno - Horário",
        "required": false
      },
      {
        "id": "ceia_alimentos",
        "type": "textarea",
        "label": "Ceia / Lanche Noturno - O que você comeu e bebeu?",
        "placeholder": "Liste todos os alimentos e bebidas, com quantidades aproximadas",
        "required": false
      },
      {
        "id": "beliscou",
        "type": "yesno",
        "label": "Você beliscou alguma coisa entre as refeições?",
        "required": true
      },
      {
        "id": "beliscos_detalhes",
        "type": "textarea",
        "label": "Se sim, o que você beliscou?",
        "placeholder": "Descreva os beliscos e horários aproximados",
        "required": false
      },
      {
        "id": "consumo_agua_litros",
        "type": "text",
        "label": "Quantos litros de água você bebeu ontem?",
        "placeholder": "Ex: 2",
        "required": false
      },
      {
        "id": "consumo_alcool",
        "type": "yesno",
        "label": "Você consumiu bebida alcoólica?",
        "required": true
      },
      {
        "id": "alcool_detalhes",
        "type": "textarea",
        "label": "Se sim, qual bebida e quantidade?",
        "placeholder": "Ex: 2 taças de vinho",
        "required": false
      },
      {
        "id": "suplementos",
        "type": "textarea",
        "label": "Você tomou algum suplemento ou vitamina ontem?",
        "placeholder": "Liste os suplementos e horários",
        "required": false
      },
      {
        "id": "observacoes",
        "type": "textarea",
        "label": "Observações Adicionais",
        "placeholder": "Qualquer informação adicional que você considere importante (fome, saciedade, sintomas, etc)",
        "required": false
      }
    ]
  }'::jsonb,
  true,
  true,
  'recordatorio-alimentar-24h',
  NOW(),
  NOW()
);

-- Confirmar inserção
SELECT 
  id,
  name,
  form_type,
  is_template,
  slug,
  jsonb_array_length(structure->'fields') as num_campos
FROM custom_forms
WHERE is_template = true
ORDER BY created_at DESC;

-- ✅ MIGRAÇÃO COMPLETA
SELECT '✅ Templates de formulários criados com sucesso!' as status;
