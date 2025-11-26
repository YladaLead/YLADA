require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Função para criar estrutura de campos
function createField(id, type, label, required = true, options = null, placeholder = '', helpText = '', unit = null, min = null, max = null, step = null) {
  const field = {
    id,
    type,
    label,
    required,
    placeholder: placeholder || undefined,
    helpText: helpText || undefined,
  };

  if (options) {
    field.options = options;
  }

  if (unit) {
    field.unit = unit;
  }

  if (min !== null) {
    field.min = min;
  }

  if (max !== null) {
    field.max = max;
  }

  if (step !== null) {
    field.step = step;
  }

  return field;
}

// Formulários para COACH
const coachForms = [
  {
    name: 'Avaliação Física Inicial',
    description: 'Formulário completo para primeira avaliação física do cliente',
    form_type: 'anamnese',
    structure: {
      fields: [
        createField('nome', 'text', 'Nome completo', true, null, 'Digite seu nome completo'),
        createField('telefone', 'tel', 'Telefone/WhatsApp', true, null, '(00) 00000-0000'),
        createField('email', 'email', 'E-mail', true, null, 'seu@email.com'),
        createField('endereco', 'textarea', 'Endereço completo', false, null, 'Rua, número, bairro, cidade'),
        createField('data_nascimento', 'date', 'Data de nascimento', true),
        createField('objetivo', 'select', 'Qual seu principal objetivo?', true, [
          'Emagrecimento',
          'Ganho de massa muscular',
          'Condicionamento físico',
          'Melhora de performance esportiva',
          'Reabilitação',
          'Saúde e bem-estar geral'
        ]),
        createField('nivel_atividade', 'select', 'Nível de atividade atual', true, [
          'Sedentário (não pratico exercícios)',
          'Iniciante (comecei há menos de 3 meses)',
          'Intermediário (pratico há 3-12 meses)',
          'Avançado (pratico há mais de 1 ano)'
        ]),
        createField('historico_exercicios', 'textarea', 'Histórico de exercícios', false, null, 'Descreva modalidades que já praticou e por quanto tempo'),
        createField('lesoes_limitacoes', 'yesno', 'Possui lesões ou limitações físicas?', true),
        createField('detalhes_lesoes', 'textarea', 'Detalhes das lesões/limitações', false, null, 'Descreva local, tipo e quando ocorreu'),
        createField('peso', 'number', 'Peso atual (kg)', false, null, 'Ex: 70', null, 'kg'),
        createField('altura', 'number', 'Altura (cm)', false, null, 'Ex: 175', null, 'cm'),
        createField('circunferencias', 'textarea', 'Medidas corporais (opcional)', false, null, 'Braço, cintura, quadril, coxa...'),
        createField('disponibilidade', 'select', 'Disponibilidade para treinos', true, [
          'Manhã (6h-12h)',
          'Tarde (12h-18h)',
          'Noite (18h-22h)',
          'Flexível (qualquer horário)'
        ]),
        createField('dias_semana', 'checkbox', 'Dias da semana disponíveis', true, [
          'Segunda-feira',
          'Terça-feira',
          'Quarta-feira',
          'Quinta-feira',
          'Sexta-feira',
          'Sábado',
          'Domingo'
        ]),
        createField('expectativas', 'textarea', 'Expectativas e motivação', false, null, 'O que te motiva? Quais são suas expectativas?')
      ]
    }
  },
  {
    name: 'Anamnese Esportiva',
    description: 'Questionário específico para avaliação esportiva e modalidades',
    form_type: 'anamnese',
    structure: {
      fields: [
        createField('nome', 'text', 'Nome completo', true),
        createField('telefone', 'tel', 'Telefone/WhatsApp', true),
        createField('email', 'email', 'E-mail', true),
        createField('endereco', 'textarea', 'Endereço completo', false),
        createField('modalidades_interesse', 'checkbox', 'Modalidades de interesse', true, [
          'Musculação',
          'Corrida',
          'Ciclismo',
          'Natação',
          'Funcional',
          'CrossFit',
          'Pilates',
          'Yoga',
          'Dança',
          'Artes marciais',
          'Outras'
        ]),
        createField('frequencia_desejada', 'select', 'Frequência semanal desejada', true, [
          '2x por semana',
          '3x por semana',
          '4x por semana',
          '5x por semana',
          '6x por semana',
          'Diário'
        ]),
        createField('experiencia_previa', 'select', 'Experiência prévia com exercícios', true, [
          'Nenhuma',
          'Menos de 6 meses',
          '6 meses a 1 ano',
          '1 a 3 anos',
          'Mais de 3 anos'
        ]),
        createField('objetivo_especifico', 'select', 'Objetivo específico', true, [
          'Correr 5km',
          'Correr 10km',
          'Correr meia maratona',
          'Correr maratona',
          'Hipertrofia',
          'Força',
          'Resistência',
          'Flexibilidade',
          'Perda de peso',
          'Ganho de peso'
        ]),
        createField('restricoes_horario', 'textarea', 'Restrições de horário', false, null, 'Descreva horários que não pode treinar'),
        createField('preferencia_ambiente', 'select', 'Preferência de ambiente', true, [
          'Academia',
          'Casa',
          'Ao ar livre',
          'Estúdio',
          'Sem preferência'
        ])
      ]
    }
  },
  {
    name: 'Avaliação de Condicionamento Físico',
    description: 'Questionário para avaliar nível atual de condicionamento',
    form_type: 'avaliacao',
    structure: {
      fields: [
        createField('nome', 'text', 'Nome completo', true),
        createField('telefone', 'tel', 'Telefone/WhatsApp', true),
        createField('email', 'email', 'E-mail', true),
        createField('endereco', 'textarea', 'Endereço completo', false),
        createField('nivel_condicionamento', 'range', 'Nível de condicionamento atual (1-10)', true, null, null, '1 = muito baixo, 10 = excelente'),
        createField('capacidade_cardio', 'select', 'Capacidade cardiorrespiratória', true, [
          'Consigo subir escadas sem ficar ofegante',
          'Fico ofegante ao subir escadas',
          'Consigo caminhar 30min sem cansaço',
          'Caminhar 10min já me cansa',
          'Consigo correr sem problemas',
          'Não consigo correr'
        ]),
        createField('forca_atual', 'select', 'Força atual', true, [
          'Consigo fazer flexões',
          'Não consigo fazer flexões',
          'Consigo fazer agachamentos',
          'Não consigo fazer agachamentos',
          'Consigo levantar pesos',
          'Não consigo levantar pesos'
        ]),
        createField('flexibilidade', 'select', 'Flexibilidade', true, [
          'Consigo tocar os pés',
          'Não consigo tocar os pés',
          'Tenho boa flexibilidade',
          'Tenho flexibilidade limitada'
        ]),
        createField('frequencia_repouso', 'number', 'Frequência cardíaca de repouso (bpm)', false, null, 'Ex: 70'),
        createField('esforco_percebido', 'select', 'Teste de esforço percebido (escala de Borg)', true, [
          'Muito leve (1-2)',
          'Leve (3-4)',
          'Moderado (5-6)',
          'Forte (7-8)',
          'Muito forte (9-10)'
        ])
      ]
    }
  },
  {
    name: 'Histórico de Lesões e Limitações',
    description: 'Formulário para mapear histórico de lesões e limitações físicas',
    form_type: 'anamnese',
    structure: {
      fields: [
        createField('nome', 'text', 'Nome completo', true),
        createField('telefone', 'tel', 'Telefone/WhatsApp', true),
        createField('email', 'email', 'E-mail', true),
        createField('endereco', 'textarea', 'Endereço completo', false),
        createField('lesoes_anteriores', 'yesno', 'Já teve lesões anteriores?', true),
        createField('local_lesao', 'select', 'Local da lesão (se aplicável)', false, [
          'Joelho',
          'Coluna/Ombro',
          'Tornozelo',
          'Pulso',
          'Cotovelo',
          'Quadril',
          'Outro'
        ]),
        createField('tipo_lesao', 'textarea', 'Tipo de lesão e quando ocorreu', false, null, 'Descreva o tipo e quando aconteceu'),
        createField('limitacoes_atuais', 'yesno', 'Possui limitações atuais?', true),
        createField('detalhes_limitacoes', 'textarea', 'Detalhes das limitações', false, null, 'Descreva quais movimentos ou atividades são limitados'),
        createField('cirurgias', 'yesno', 'Já realizou cirurgias?', true),
        createField('detalhes_cirurgias', 'textarea', 'Detalhes das cirurgias', false, null, 'Tipo, local e quando foi realizada'),
        createField('medicamentos', 'textarea', 'Medicamentos em uso', false, null, 'Liste medicamentos que toma regularmente'),
        createField('acompanhamento_medico', 'yesno', 'Faz acompanhamento médico ou fisioterápico?', false),
        createField('detalhes_acompanhamento', 'textarea', 'Detalhes do acompanhamento', false, null, 'Especialista, frequência, etc.'),
        createField('restricoes_medicas', 'textarea', 'Restrições médicas para exercícios', false, null, 'Alguma restrição específica?')
      ]
    }
  },
  {
    name: 'Questionário de Estilo de Vida',
    description: 'Avaliação completa do estilo de vida do cliente',
    form_type: 'questionario',
    structure: {
      fields: [
        createField('nome', 'text', 'Nome completo', true),
        createField('telefone', 'tel', 'Telefone/WhatsApp', true),
        createField('email', 'email', 'E-mail', true),
        createField('endereco', 'textarea', 'Endereço completo', false),
        createField('horas_sono', 'number', 'Horas de sono por noite', true, null, 'Ex: 7'),
        createField('nivel_estresse', 'range', 'Nível de estresse (1-10)', true, null, null, '1 = sem estresse, 10 = muito estressado'),
        createField('tipo_trabalho', 'select', 'Tipo de trabalho', true, [
          'Sedentário (escritório)',
          'Em pé (comércio, serviços)',
          'Físico (construção, indústria)',
          'Misto',
          'Desempregado/Aposentado'
        ]),
        createField('carga_horaria', 'select', 'Carga horária de trabalho', true, [
          'Até 4 horas',
          '4-6 horas',
          '6-8 horas',
          'Mais de 8 horas'
        ]),
        createField('habitos', 'checkbox', 'Hábitos', false, [
          'Tabagismo',
          'Consumo de álcool',
          'Nenhum dos acima'
        ]),
        createField('alimentacao', 'select', 'Padrão alimentar', true, [
          'Regular (3 refeições principais)',
          'Irregular (pula refeições)',
          'Faz dieta',
          'Não controla'
        ]),
        createField('tempo_disponivel', 'select', 'Tempo disponível para treinos', true, [
          'Menos de 30min',
          '30min-1h',
          '1-2 horas',
          'Mais de 2 horas'
        ]),
        createField('motivacao', 'range', 'Motivação para mudança (1-10)', true, null, null, '1 = baixa, 10 = muito alta')
      ]
    }
  }
];

// Formulários para NUTRI
const nutriForms = [
  {
    name: 'Anamnese Nutricional Completa',
    description: 'Questionário completo para primeira consulta nutricional',
    form_type: 'anamnese',
    structure: {
      fields: [
        createField('nome', 'text', 'Nome completo', true),
        createField('telefone', 'tel', 'Telefone/WhatsApp', true),
        createField('email', 'email', 'E-mail', true),
        createField('endereco', 'textarea', 'Endereço completo', false),
        createField('data_nascimento', 'date', 'Data de nascimento', true),
        createField('objetivo', 'select', 'Objetivo principal', true, [
          'Emagrecimento',
          'Ganho de peso',
          'Reeducação alimentar',
          'Melhora de performance',
          'Saúde geral',
          'Tratamento de patologia'
        ]),
        createField('peso_atual', 'number', 'Peso atual (kg)', true, null, 'Ex: 70', null, 'kg'),
        createField('peso_maximo', 'number', 'Peso máximo já atingido (kg)', false, null, 'Ex: 85'),
        createField('peso_minimo', 'number', 'Peso mínimo já atingido (kg)', false, null, 'Ex: 60'),
        createField('altura', 'number', 'Altura (cm)', true, null, 'Ex: 175', null, 'cm'),
        createField('historico_dietas', 'yesno', 'Já fez dietas anteriormente?', true),
        createField('quantas_dietas', 'number', 'Quantas dietas já fez?', false, null, 'Ex: 3'),
        createField('resultados_dietas', 'textarea', 'Resultados das dietas anteriores', false, null, 'O que funcionou? O que não funcionou?'),
        createField('suplementos', 'textarea', 'Suplementos ou medicamentos em uso', false, null, 'Liste todos'),
        createField('patologias', 'textarea', 'Patologias ou condições de saúde', false, null, 'Diabetes, hipertensão, etc.'),
        createField('cirurgias', 'textarea', 'Cirurgias realizadas', false, null, 'Tipo e quando foi realizada'),
        createField('atividade_fisica', 'select', 'Nível de atividade física', true, [
          'Sedentário',
          'Leve (1-2x/semana)',
          'Moderado (3-4x/semana)',
          'Intenso (5+ vezes/semana)'
        ])
      ]
    }
  },
  {
    name: 'Avaliação de Hábitos Alimentares',
    description: 'Questionário para avaliar padrão alimentar atual',
    form_type: 'questionario',
    structure: {
      fields: [
        createField('nome', 'text', 'Nome completo', true),
        createField('telefone', 'tel', 'Telefone/WhatsApp', true),
        createField('email', 'email', 'E-mail', true),
        createField('endereco', 'textarea', 'Endereço completo', false),
        createField('refeicoes_dia', 'select', 'Quantas refeições faz por dia?', true, [
          '1-2 refeições',
          '3 refeições',
          '4-5 refeições',
          '6 ou mais refeições'
        ]),
        createField('horarios_refeicoes', 'textarea', 'Horários das refeições', false, null, 'Ex: 7h, 12h, 19h'),
        createField('onde_come', 'select', 'Onde faz as refeições?', true, [
          'Em casa',
          'No trabalho',
          'Restaurante',
          'Misto'
        ]),
        createField('quem_prepara', 'select', 'Quem prepara as refeições?', true, [
          'Eu mesmo(a)',
          'Família',
          'Empregada/cozinheira',
          'Restaurante/delivery'
        ]),
        createField('consumo_agua', 'select', 'Consumo de água diário', true, [
          'Menos de 1 litro',
          '1-2 litros',
          '2-3 litros',
          'Mais de 3 litros'
        ]),
        createField('frutas_verduras', 'select', 'Consumo de frutas e verduras', true, [
          'Diariamente',
          '3-4x por semana',
          '1-2x por semana',
          'Raramente'
        ]),
        createField('processados', 'select', 'Consumo de alimentos processados', true, [
          'Diariamente',
          '3-4x por semana',
          '1-2x por semana',
          'Raramente'
        ]),
        createField('padrao_fome', 'select', 'Padrão de fome', true, [
          'Sempre com fome',
          'Fome regular',
          'Raramente sinto fome',
          'Fome específica (doces, salgados)'
        ]),
        createField('compulsao', 'yesno', 'Sente compulsão alimentar?', false),
        createField('frequencia_compulsao', 'select', 'Frequência de compulsão (se aplicável)', false, [
          'Diariamente',
          'Algumas vezes por semana',
          'Raramente'
        ])
      ]
    }
  },
  {
    name: 'Diário Alimentar (3 dias)',
    description: 'Registro detalhado da alimentação por 3 dias',
    form_type: 'questionario',
    structure: {
      fields: [
        createField('nome', 'text', 'Nome completo', true),
        createField('telefone', 'tel', 'Telefone/WhatsApp', true),
        createField('email', 'email', 'E-mail', true),
        createField('endereco', 'textarea', 'Endereço completo', false),
        createField('dia1_cafe', 'textarea', 'Dia 1 - Café da manhã', false, null, 'O que comeu, horário, quantidade'),
        createField('dia1_lanche1', 'textarea', 'Dia 1 - Lanche da manhã', false),
        createField('dia1_almoco', 'textarea', 'Dia 1 - Almoço', false),
        createField('dia1_lanche2', 'textarea', 'Dia 1 - Lanche da tarde', false),
        createField('dia1_jantar', 'textarea', 'Dia 1 - Jantar', false),
        createField('dia1_ceia', 'textarea', 'Dia 1 - Ceia', false),
        createField('dia2_cafe', 'textarea', 'Dia 2 - Café da manhã', false),
        createField('dia2_lanche1', 'textarea', 'Dia 2 - Lanche da manhã', false),
        createField('dia2_almoco', 'textarea', 'Dia 2 - Almoço', false),
        createField('dia2_lanche2', 'textarea', 'Dia 2 - Lanche da tarde', false),
        createField('dia2_jantar', 'textarea', 'Dia 2 - Jantar', false),
        createField('dia2_ceia', 'textarea', 'Dia 2 - Ceia', false),
        createField('dia3_cafe', 'textarea', 'Dia 3 - Café da manhã', false),
        createField('dia3_lanche1', 'textarea', 'Dia 3 - Lanche da manhã', false),
        createField('dia3_almoco', 'textarea', 'Dia 3 - Almoço', false),
        createField('dia3_lanche2', 'textarea', 'Dia 3 - Lanche da tarde', false),
        createField('dia3_jantar', 'textarea', 'Dia 3 - Jantar', false),
        createField('dia3_ceia', 'textarea', 'Dia 3 - Ceia', false)
      ]
    }
  },
  {
    name: 'Avaliação de Intolerâncias e Alergias',
    description: 'Questionário para identificar intolerâncias e alergias alimentares',
    form_type: 'anamnese',
    structure: {
      fields: [
        createField('nome', 'text', 'Nome completo', true),
        createField('telefone', 'tel', 'Telefone/WhatsApp', true),
        createField('email', 'email', 'E-mail', true),
        createField('endereco', 'textarea', 'Endereço completo', false),
        createField('intolerancia_lactose', 'yesno', 'Intolerância à lactose?', true),
        createField('sintomas_lactose', 'textarea', 'Sintomas com lactose (se aplicável)', false, null, 'Gases, inchaço, diarreia, etc.'),
        createField('intolerancia_gluten', 'yesno', 'Intolerância ao glúten?', true),
        createField('sintomas_gluten', 'textarea', 'Sintomas com glúten (se aplicável)', false),
        createField('alergias', 'yesno', 'Possui alergias alimentares?', true),
        createField('alimentos_alergicos', 'textarea', 'Alimentos que causam alergia', false, null, 'Liste os alimentos e as reações'),
        createField('sensibilidade', 'textarea', 'Outras sensibilidades alimentares', false, null, 'Alimentos que causam desconforto'),
        createField('sintomas_digestivos', 'checkbox', 'Sintomas digestivos frequentes', false, [
          'Gases',
          'Inchaço',
          'Azia',
          'Constipação',
          'Diarreia',
          'Náusea',
          'Nenhum'
        ]),
        createField('frequencia_sintomas', 'select', 'Frequência dos sintomas', false, [
          'Diariamente',
          'Algumas vezes por semana',
          'Raramente',
          'Nunca'
        ])
      ]
    }
  },
  {
    name: 'Questionário de Sintomas e Bem-Estar',
    description: 'Avaliação completa de sintomas e qualidade de vida',
    form_type: 'questionario',
    structure: {
      fields: [
        createField('nome', 'text', 'Nome completo', true),
        createField('telefone', 'tel', 'Telefone/WhatsApp', true),
        createField('email', 'email', 'E-mail', true),
        createField('endereco', 'textarea', 'Endereço completo', false),
        createField('energia_manha', 'range', 'Energia pela manhã (1-10)', true, null, null, '1 = sem energia, 10 = muita energia'),
        createField('energia_tarde', 'range', 'Energia à tarde (1-10)', true),
        createField('energia_noite', 'range', 'Energia à noite (1-10)', true),
        createField('qualidade_sono', 'select', 'Qualidade do sono', true, [
          'Acordo descansado',
          'Acordo cansado',
          'Dormir mal é frequente'
        ]),
        createField('horas_sono', 'number', 'Horas de sono por noite', true, null, 'Ex: 7'),
        createField('ronco', 'yesno', 'Ronca durante o sono?', false),
        createField('digestao', 'select', 'Digestão', true, [
          'Regular',
          'Constipação frequente',
          'Diarreia frequente',
          'Gases e inchaço',
          'Variável'
        ]),
        createField('humor', 'select', 'Humor geral', true, [
          'Estável',
          'Variações frequentes',
          'Ansioso',
          'Deprimido',
          'Irritável'
        ]),
        createField('fome', 'select', 'Padrão de fome', true, [
          'Sempre com fome',
          'Fome regular',
          'Raramente sinto fome',
          'Fome específica (doces, salgados)'
        ]),
        createField('desejos', 'textarea', 'Desejos alimentares frequentes', false, null, 'Doces, salgados, específicos?'),
        createField('sintomas_fisicos', 'checkbox', 'Sintomas físicos frequentes', false, [
          'Dor de cabeça',
          'Tontura',
          'Fadiga',
          'Dores musculares',
          'Nenhum'
        ])
      ]
    }
  },
  {
    name: 'Avaliação de Objetivos Nutricionais',
    description: 'Definição clara dos objetivos e expectativas do cliente',
    form_type: 'avaliacao',
    structure: {
      fields: [
        createField('nome', 'text', 'Nome completo', true),
        createField('telefone', 'tel', 'Telefone/WhatsApp', true),
        createField('email', 'email', 'E-mail', true),
        createField('endereco', 'textarea', 'Endereço completo', false),
        createField('objetivo_principal', 'select', 'Objetivo principal', true, [
          'Emagrecer X kg',
          'Ganhar X kg',
          'Manter peso atual',
          'Melhorar saúde geral',
          'Melhorar performance',
          'Tratamento de patologia'
        ]),
        createField('peso_desejado', 'number', 'Peso desejado (kg)', false, null, 'Ex: 65'),
        createField('prazo', 'select', 'Prazo desejado', true, [
          '1 mês',
          '3 meses',
          '6 meses',
          '1 ano',
          'Sem prazo definido'
        ]),
        createField('motivacao', 'range', 'Motivação (1-10)', true, null, null, '1 = baixa, 10 = muito alta'),
        createField('comprometimento', 'range', 'Comprometimento (1-10)', true, null, null, '1 = baixo, 10 = muito alto'),
        createField('expectativas', 'textarea', 'Expectativas realistas', false, null, 'O que você espera alcançar?'),
        createField('obstaculos', 'checkbox', 'Obstáculos percebidos', false, [
          'Falta de tempo',
          'Dificuldade financeira',
          'Falta de motivação',
          'Falta de conhecimento',
          'Ambiente familiar',
          'Nenhum'
        ])
      ]
    }
  },
  {
    name: 'Histórico de Dietas e Tratamentos',
    description: 'Mapeamento completo do histórico nutricional',
    form_type: 'anamnese',
    structure: {
      fields: [
        createField('nome', 'text', 'Nome completo', true),
        createField('telefone', 'tel', 'Telefone/WhatsApp', true),
        createField('email', 'email', 'E-mail', true),
        createField('endereco', 'textarea', 'Endereço completo', false),
        createField('dietas_realizadas', 'yesno', 'Já realizou dietas?', true),
        createField('quais_dietas', 'textarea', 'Quais dietas já fez?', false, null, 'Low carb, cetogênica, Dukan, etc.'),
        createField('duracao_dietas', 'textarea', 'Duração das dietas', false, null, 'Quanto tempo seguiu cada uma?'),
        createField('resultados_dietas', 'textarea', 'Resultados obtidos', false, null, 'O que funcionou? O que não funcionou?'),
        createField('tratamentos_nutricionais', 'textarea', 'Tratamentos nutricionais anteriores', false, null, 'Já fez acompanhamento com outro nutricionista?'),
        createField('medicamentos_emagrecimento', 'yesno', 'Já usou medicamentos para emagrecimento?', false),
        createField('quais_medicamentos', 'textarea', 'Quais medicamentos (se aplicável)', false),
        createField('cirurgias_bariatricas', 'yesno', 'Já realizou cirurgia bariátrica?', false),
        createField('cirurgias_esteticas', 'yesno', 'Já realizou cirurgias estéticas?', false),
        createField('suplementos_utilizados', 'textarea', 'Suplementos já utilizados', false, null, 'Quais, quando, resultados'),
        createField('outros_profissionais', 'textarea', 'Acompanhamento com outros profissionais', false, null, 'Endocrinologista, psicólogo, etc.')
      ]
    }
  },
  {
    name: 'Avaliação de Padrão de Sono e Energia',
    description: 'Questionário sobre sono, energia e relação com alimentação',
    form_type: 'questionario',
    structure: {
      fields: [
        createField('nome', 'text', 'Nome completo', true),
        createField('telefone', 'tel', 'Telefone/WhatsApp', true),
        createField('email', 'email', 'E-mail', true),
        createField('endereco', 'textarea', 'Endereço completo', false),
        createField('horas_sono', 'number', 'Horas de sono por noite', true, null, 'Ex: 7'),
        createField('qualidade_sono', 'select', 'Qualidade do sono', true, [
          'Acordo descansado',
          'Acordo cansado',
          'Dormir mal é frequente'
        ]),
        createField('horario_dormir', 'time', 'Horário de dormir', false),
        createField('horario_acordar', 'time', 'Horário de acordar', false),
        createField('energia_manha', 'range', 'Energia pela manhã (1-10)', true),
        createField('energia_tarde', 'range', 'Energia à tarde (1-10)', true),
        createField('energia_noite', 'range', 'Energia à noite (1-10)', true),
        createField('picos_fome_manha', 'yesno', 'Picos de fome pela manhã?', false),
        createField('picos_fome_tarde', 'yesno', 'Picos de fome à tarde?', false),
        createField('picos_fome_noite', 'yesno', 'Picos de fome à noite?', false),
        createField('relacao_sono_alimentacao', 'textarea', 'Relação entre sono e alimentação', false, null, 'Nota alguma relação?')
      ]
    }
  }
];

async function createFormTemplates() {
  console.log('📋 Criando formulários pré-montados (templates)...\n');

  try {
    // Buscar ou criar usuário "sistema" para templates
    const { data: systemUsers, error: systemUserError } = await supabaseAdmin.auth.admin.listUsers();
    
    let systemUserId = null;
    
    // Tentar encontrar usuário sistema ou criar um
    const systemUser = systemUsers?.users?.find(u => u.email === 'sistema.templates@ylada.com');
    
    if (systemUser) {
      systemUserId = systemUser.id;
      console.log('✅ Usuário sistema encontrado:', systemUserId);
    } else {
      // Criar usuário sistema se não existir
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: 'sistema.templates@ylada.com',
        password: 'sistema_templates_' + Math.random().toString(36).slice(-12),
        email_confirm: true
      });
      
      if (createError) {
        console.error('❌ Erro ao criar usuário sistema:', createError.message);
        // Tentar usar o primeiro usuário admin como fallback
        const adminUser = systemUsers?.users?.find(u => u.email?.includes('admin') || u.email?.includes('demo'));
        if (adminUser) {
          systemUserId = adminUser.id;
          console.log('⚠️ Usando usuário admin como fallback:', systemUserId);
        } else {
          throw new Error('Não foi possível criar ou encontrar usuário para templates');
        }
      } else {
        systemUserId = newUser.user.id;
        console.log('✅ Usuário sistema criado:', systemUserId);
      }
    }

    // Criar formulários COACH
    console.log('\n🏋️ Criando formulários para COACH...');
    for (const form of coachForms) {
      try {
        const { data: existingForm, error: checkError } = await supabaseAdmin
          .from('custom_forms')
          .select('id')
          .eq('name', form.name)
          .eq('is_template', true)
          .limit(1)
          .single();

        if (existingForm && !checkError) {
          console.log(`    ⚠️ Formulário "${form.name}" já existe, pulando...`);
          continue;
        }

        const { data: newForm, error: formError } = await supabaseAdmin
          .from('custom_forms')
          .insert({
            user_id: systemUserId,
            name: form.name,
            description: form.description,
            form_type: form.form_type,
            structure: form.structure,
            is_active: true,
            is_template: true // Marcar como template
          })
          .select()
          .single();

        if (formError) {
          console.error(`    ❌ Erro ao criar "${form.name}":`, formError.message);
        } else {
          console.log(`    ✅ "${form.name}" criado (ID: ${newForm.id})`);
        }
      } catch (err) {
        console.error(`    ❌ Erro geral em "${form.name}":`, err.message);
      }
    }

    // Criar formulários NUTRI
    console.log('\n🥗 Criando formulários para NUTRI...');
    for (const form of nutriForms) {
      try {
        const { data: existingForm, error: checkError } = await supabaseAdmin
          .from('custom_forms')
          .select('id')
          .eq('name', form.name)
          .eq('is_template', true)
          .limit(1)
          .single();

        if (existingForm && !checkError) {
          console.log(`    ⚠️ Formulário "${form.name}" já existe, pulando...`);
          continue;
        }

        const { data: newForm, error: formError } = await supabaseAdmin
          .from('custom_forms')
          .insert({
            user_id: systemUserId,
            name: form.name,
            description: form.description,
            form_type: form.form_type,
            structure: form.structure,
            is_active: true,
            is_template: true // Marcar como template
          })
          .select()
          .single();

        if (formError) {
          console.error(`    ❌ Erro ao criar "${form.name}":`, formError.message);
        } else {
          console.log(`    ✅ "${form.name}" criado (ID: ${newForm.id})`);
        }
      } catch (err) {
        console.error(`    ❌ Erro geral em "${form.name}":`, err.message);
      }
    }

    console.log('\n✅ Formulários pré-montados criados com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Os formulários estão marcados como is_template=true');
    console.log('   2. Usuários podem visualizar e copiar esses templates');
    console.log('   3. Ao copiar, o usuário pode editar antes de salvar');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.error(error);
  }
}

createFormTemplates();

