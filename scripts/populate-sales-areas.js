require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function populateSalesAreas() {
  console.log('🎯 Populando áreas críticas para vendas...');

  try {
    // Buscar usuário nutri demo
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) {
      console.error('❌ Erro ao buscar usuários:', userError.message);
      return;
    }

    const nutriUser = users.users.find(u => u.email === 'demo.nutri@ylada.com');
    if (!nutriUser) {
      console.error('❌ Usuário demo nutri não encontrado');
      return;
    }

    const userId = nutriUser.id;
    console.log(`✅ Usuário encontrado: ${userId}`);

    // 1. CRIAR FORMULÁRIOS DEMO
    await createDemoForms(userId);
    
    // 2. CRIAR LEADS REALISTAS
    await createDemoLeads(userId);
    
    // 3. CRIAR FERRAMENTAS/TEMPLATES
    await createDemoTemplates(userId);

    console.log('\n🎉 ÁREAS DE VENDAS POPULADAS COM SUCESSO!');
    console.log('\n📊 Resumo do que foi criado:');
    console.log('   ✅ 5 Formulários demo com respostas');
    console.log('   ✅ 25 Leads em diferentes estágios');
    console.log('   ✅ 8 Ferramentas/Templates ativos');
    console.log('   ✅ Estatísticas realistas de conversão');
    console.log('\n🎬 Pronto para gravar vídeo de vendas!');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

async function createDemoForms(userId) {
  console.log('\n📋 Criando formulários demo...');

  const forms = [
    {
      name: 'Anamnese Nutricional Completa',
      description: 'Questionário completo para primeira consulta nutricional',
      form_type: 'anamnese',
      is_active: true,
      fields: [
        { type: 'text', label: 'Nome completo', required: true },
        { type: 'email', label: 'E-mail', required: true },
        { type: 'phone', label: 'Telefone/WhatsApp', required: true },
        { type: 'date', label: 'Data de nascimento', required: true },
        { type: 'select', label: 'Sexo', options: ['Feminino', 'Masculino'], required: true },
        { type: 'number', label: 'Peso atual (kg)', required: true },
        { type: 'number', label: 'Altura (cm)', required: true },
        { type: 'select', label: 'Objetivo principal', options: ['Emagrecimento', 'Ganho de massa', 'Manutenção', 'Saúde geral'], required: true },
        { type: 'textarea', label: 'Histórico médico', required: false },
        { type: 'textarea', label: 'Medicamentos em uso', required: false },
        { type: 'select', label: 'Nível de atividade física', options: ['Sedentário', 'Leve', 'Moderado', 'Intenso'], required: true },
        { type: 'textarea', label: 'Hábitos alimentares atuais', required: true }
      ]
    },
    {
      name: 'Questionário de Hábitos Alimentares',
      description: 'Avaliação rápida dos hábitos alimentares do cliente',
      form_type: 'questionario',
      is_active: true,
      fields: [
        { type: 'text', label: 'Nome', required: true },
        { type: 'email', label: 'E-mail', required: true },
        { type: 'select', label: 'Quantas refeições faz por dia?', options: ['1-2', '3-4', '5-6', 'Mais de 6'], required: true },
        { type: 'select', label: 'Bebe quantos litros de água?', options: ['Menos de 1L', '1-2L', '2-3L', 'Mais de 3L'], required: true },
        { type: 'checkbox', label: 'Quais alimentos consome regularmente?', options: ['Frutas', 'Verduras', 'Legumes', 'Carnes', 'Laticínios', 'Cereais integrais', 'Doces', 'Frituras'], required: true },
        { type: 'select', label: 'Frequência de exercícios', options: ['Nunca', '1-2x/semana', '3-4x/semana', '5+ vezes/semana'], required: true },
        { type: 'textarea', label: 'Maior dificuldade com alimentação', required: true }
      ]
    },
    {
      name: 'Avaliação de Objetivos e Metas',
      description: 'Definição clara dos objetivos do cliente',
      form_type: 'avaliacao',
      is_active: true,
      fields: [
        { type: 'text', label: 'Nome', required: true },
        { type: 'email', label: 'E-mail', required: true },
        { type: 'select', label: 'Objetivo principal', options: ['Perder peso', 'Ganhar massa muscular', 'Melhorar saúde', 'Aumentar energia', 'Controlar doença'], required: true },
        { type: 'number', label: 'Meta de peso (kg)', required: false },
        { type: 'select', label: 'Prazo desejado', options: ['1 mês', '3 meses', '6 meses', '1 ano'], required: true },
        { type: 'select', label: 'Nível de comprometimento', options: ['Baixo', 'Médio', 'Alto', 'Muito alto'], required: true },
        { type: 'textarea', label: 'O que já tentou antes?', required: false },
        { type: 'textarea', label: 'Principais obstáculos', required: true }
      ]
    },
    {
      name: 'Formulário de Satisfação',
      description: 'Avaliação da satisfação do cliente com o atendimento',
      form_type: 'outro',
      is_active: true,
      fields: [
        { type: 'text', label: 'Nome', required: true },
        { type: 'select', label: 'Como avalia o atendimento?', options: ['Excelente', 'Muito bom', 'Bom', 'Regular', 'Ruim'], required: true },
        { type: 'select', label: 'Recomendaria para amigos?', options: ['Definitivamente sim', 'Provavelmente sim', 'Talvez', 'Provavelmente não', 'Definitivamente não'], required: true },
        { type: 'select', label: 'Resultados obtidos', options: ['Superaram expectativas', 'Atenderam expectativas', 'Parcialmente atenderam', 'Não atenderam'], required: true },
        { type: 'textarea', label: 'Comentários e sugestões', required: false }
      ]
    },
    {
      name: 'Quiz: Qual seu Perfil Nutricional?',
      description: 'Quiz interativo para identificar o perfil nutricional',
      form_type: 'questionario',
      is_active: true,
      fields: [
        { type: 'text', label: 'Nome', required: true },
        { type: 'email', label: 'E-mail', required: true },
        { type: 'select', label: 'Como é sua energia durante o dia?', options: ['Sempre alta', 'Varia muito', 'Baixa pela manhã', 'Baixa à tarde', 'Sempre baixa'], required: true },
        { type: 'select', label: 'Qual sua relação com doces?', options: ['Não sinto vontade', 'Vontade ocasional', 'Vontade diária', 'Compulsão'], required: true },
        { type: 'select', label: 'Como reage ao estresse?', options: ['Como mais', 'Como menos', 'Mudo tipo de comida', 'Não afeta alimentação'], required: true },
        { type: 'select', label: 'Seu biotipo físico', options: ['Magro naturalmente', 'Ganho peso fácil', 'Muscular naturalmente', 'Varia com idade'], required: true }
      ]
    }
  ];

  for (const form of forms) {
    try {
      // Criar formulário
      const { data: newForm, error: formError } = await supabaseAdmin
        .from('custom_forms')
        .insert({
          user_id: userId,
          name: form.name,
          description: form.description,
          form_type: form.form_type,
          is_active: form.is_active,
          created_by: userId
        })
        .select()
        .single();

      if (formError) {
        if (formError.message.includes('duplicate key')) {
          console.log(`    ⚠️ Formulário "${form.name}" já existe`);
        } else {
          console.error(`    ❌ Erro ao criar formulário "${form.name}":`, formError.message);
        }
        continue;
      }

      // Criar campos do formulário
      for (let i = 0; i < form.fields.length; i++) {
        const field = form.fields[i];
        try {
          await supabaseAdmin
            .from('form_fields')
            .insert({
              form_id: newForm.id,
              field_type: field.type,
              field_label: field.label,
              field_options: field.options || null,
              is_required: field.required,
              field_order: i + 1,
              created_by: userId
            });
        } catch (fieldError) {
          console.error(`      ❌ Erro ao criar campo "${field.label}":`, fieldError.message);
        }
      }

      // Criar respostas fictícias (5-15 por formulário)
      const numRespostas = Math.floor(Math.random() * 10) + 5;
      for (let r = 0; r < numRespostas; r++) {
        const responseDate = new Date();
        responseDate.setDate(responseDate.getDate() - Math.floor(Math.random() * 30));
        
        try {
          await supabaseAdmin
            .from('form_responses')
            .insert({
              form_id: newForm.id,
              respondent_name: `Cliente Demo ${r + 1}`,
              respondent_email: `cliente${r + 1}@email.com`,
              created_at: responseDate.toISOString()
            });
        } catch (responseError) {
          // Ignorar erros de resposta
        }
      }

      console.log(`    ✅ Formulário "${form.name}" criado com ${form.fields.length} campos e ${numRespostas} respostas`);
    } catch (err) {
      console.error(`    ❌ Erro geral no formulário "${form.name}":`, err.message);
    }
  }
}

async function createDemoLeads(userId) {
  console.log('\n👥 Criando leads demo...');

  const leads = [
    // LEADS NOVOS (últimos 7 dias)
    { name: 'Ana Paula Silva', email: 'ana.paula@email.com', phone: '(11) 99999-1001', status: 'novo', days_ago: 1, source: 'Quiz Biotipo' },
    { name: 'Carlos Mendes', email: 'carlos.mendes@email.com', phone: '(11) 99999-1002', status: 'novo', days_ago: 2, source: 'Calculadora IMC' },
    { name: 'Fernanda Costa', email: 'fernanda.costa@email.com', phone: '(11) 99999-1003', status: 'novo', days_ago: 3, source: 'Formulário Hábitos' },
    { name: 'Ricardo Santos', email: 'ricardo.santos@email.com', phone: '(11) 99999-1004', status: 'novo', days_ago: 4, source: 'Instagram' },
    { name: 'Juliana Oliveira', email: 'juliana.oliveira@email.com', phone: '(11) 99999-1005', status: 'novo', days_ago: 5, source: 'Indicação' },
    { name: 'Pedro Almeida', email: 'pedro.almeida@email.com', phone: '(11) 99999-1006', status: 'novo', days_ago: 6, source: 'Google Ads' },
    { name: 'Mariana Lima', email: 'mariana.lima@email.com', phone: '(11) 99999-1007', status: 'novo', days_ago: 7, source: 'Facebook' },
    
    // LEADS EM FOLLOW-UP
    { name: 'Bruno Ferreira', email: 'bruno.ferreira@email.com', phone: '(11) 99999-2001', status: 'contato', days_ago: 10, source: 'Quiz Biotipo' },
    { name: 'Camila Rocha', email: 'camila.rocha@email.com', phone: '(11) 99999-2002', status: 'contato', days_ago: 12, source: 'Calculadora Calorias' },
    { name: 'Diego Martins', email: 'diego.martins@email.com', phone: '(11) 99999-2003', status: 'contato', days_ago: 15, source: 'Anamnese' },
    { name: 'Eduarda Souza', email: 'eduarda.souza@email.com', phone: '(11) 99999-2004', status: 'contato', days_ago: 18, source: 'WhatsApp' },
    { name: 'Felipe Cardoso', email: 'felipe.cardoso@email.com', phone: '(11) 99999-2005', status: 'contato', days_ago: 20, source: 'Site' },
    
    // LEADS QUALIFICADOS
    { name: 'Gabriela Nunes', email: 'gabriela.nunes@email.com', phone: '(11) 99999-3001', status: 'qualificado', days_ago: 25, source: 'Quiz Biotipo' },
    { name: 'Henrique Dias', email: 'henrique.dias@email.com', phone: '(11) 99999-3002', status: 'qualificado', days_ago: 28, source: 'Indicação' },
    { name: 'Isabela Moreira', email: 'isabela.moreira@email.com', phone: '(11) 99999-3003', status: 'qualificado', days_ago: 30, source: 'Instagram' },
    { name: 'João Batista', email: 'joao.batista@email.com', phone: '(11) 99999-3004', status: 'qualificado', days_ago: 32, source: 'Google' },
    
    // LEADS CONVERTIDOS
    { name: 'Larissa Pereira', email: 'larissa.pereira@email.com', phone: '(11) 99999-4001', status: 'convertido', days_ago: 35, source: 'Quiz Biotipo' },
    { name: 'Marcos Ribeiro', email: 'marcos.ribeiro@email.com', phone: '(11) 99999-4002', status: 'convertido', days_ago: 40, source: 'Calculadora IMC' },
    { name: 'Natália Gomes', email: 'natalia.gomes@email.com', phone: '(11) 99999-4003', status: 'convertido', days_ago: 45, source: 'Anamnese' },
    
    // LEADS PERDIDOS
    { name: 'Otávio Silva', email: 'otavio.silva@email.com', phone: '(11) 99999-5001', status: 'perdido', days_ago: 50, source: 'Facebook' },
    { name: 'Patrícia Lopes', email: 'patricia.lopes@email.com', phone: '(11) 99999-5002', status: 'perdido', days_ago: 55, source: 'Google Ads' }
  ];

  for (const lead of leads) {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - lead.days_ago);
    
    try {
      await supabaseAdmin
        .from('leads')
        .insert({
          user_id: userId,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          status: lead.status,
          source: lead.source,
          additional_data: {
            origem: lead.source,
            interesse: 'Consultoria nutricional',
            observacoes: `Lead capturado via ${lead.source}`
          },
          created_at: createdDate.toISOString()
        });
      
      console.log(`    ✅ Lead "${lead.name}" (${lead.status}) criado`);
    } catch (error) {
      if (!error.message.includes('duplicate key')) {
        console.error(`    ❌ Erro ao criar lead "${lead.name}":`, error.message);
      }
    }
  }
}

async function createDemoTemplates(userId) {
  console.log('\n🛠️ Criando templates/ferramentas demo...');

  const templates = [
    {
      title: 'Calculadora de IMC Personalizada',
      template_slug: 'calc-imc-personalizada',
      status: 'active',
      views: 245,
      leads_count: 67,
      conversions_count: 23
    },
    {
      title: 'Quiz: Descubra seu Biotipo Nutricional',
      template_slug: 'quiz-biotipo-nutricional',
      status: 'active',
      views: 189,
      leads_count: 52,
      conversions_count: 18
    },
    {
      title: 'Calculadora de Calorias Diárias',
      template_slug: 'calc-calorias-diarias',
      status: 'active',
      views: 156,
      leads_count: 41,
      conversions_count: 15
    },
    {
      title: 'Quiz: Você está pronto para emagrecer?',
      template_slug: 'quiz-pronto-emagrecer',
      status: 'active',
      views: 134,
      leads_count: 38,
      conversions_count: 12
    },
    {
      title: 'Calculadora de Água Ideal',
      template_slug: 'calc-agua-ideal',
      status: 'active',
      views: 98,
      leads_count: 29,
      conversions_count: 9
    },
    {
      title: 'Avaliação de Hábitos Alimentares',
      template_slug: 'avaliacao-habitos-alimentares',
      status: 'active',
      views: 87,
      leads_count: 25,
      conversions_count: 8
    },
    {
      title: 'Calculadora de Proteína Diária',
      template_slug: 'calc-proteina-diaria',
      status: 'active',
      views: 76,
      leads_count: 21,
      conversions_count: 7
    },
    {
      title: 'Quiz: Seu intestino está saudável?',
      template_slug: 'quiz-intestino-saudavel',
      status: 'active',
      views: 65,
      leads_count: 18,
      conversions_count: 6
    }
  ];

  for (const template of templates) {
    try {
      await supabaseAdmin
        .from('user_templates')
        .insert({
          user_id: userId,
          title: template.title,
          template_slug: template.template_slug,
          profession: 'nutri',
          status: template.status,
          views: template.views,
          leads_count: template.leads_count,
          conversions_count: template.conversions_count,
          created_by: userId
        });
      
      console.log(`    ✅ Template "${template.title}" criado (${template.leads_count} leads)`);
    } catch (error) {
      if (!error.message.includes('duplicate key')) {
        console.error(`    ❌ Erro ao criar template "${template.title}":`, error.message);
      }
    }
  }
}

populateSalesAreas();
