require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createSimpleForms() {
  console.log('📋 Criando formulários demo (versão simplificada)...');

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

    const forms = [
      {
        name: 'Anamnese Nutricional Completa',
        description: 'Questionário completo para primeira consulta nutricional',
        form_type: 'anamnese',
        is_active: true
      },
      {
        name: 'Questionário de Hábitos Alimentares',
        description: 'Avaliação rápida dos hábitos alimentares do cliente',
        form_type: 'questionario',
        is_active: true
      },
      {
        name: 'Avaliação de Objetivos e Metas',
        description: 'Definição clara dos objetivos do cliente',
        form_type: 'avaliacao',
        is_active: true
      },
      {
        name: 'Formulário de Satisfação',
        description: 'Avaliação da satisfação do cliente com o atendimento',
        form_type: 'outro',
        is_active: true
      },
      {
        name: 'Quiz: Qual seu Perfil Nutricional?',
        description: 'Quiz interativo para identificar o perfil nutricional',
        form_type: 'questionario',
        is_active: true
      }
    ];

    for (const form of forms) {
      try {
        // Criar formulário sem created_by
        const { data: newForm, error: formError } = await supabaseAdmin
          .from('custom_forms')
          .insert({
            user_id: userId,
            name: form.name,
            description: form.description,
            form_type: form.form_type,
            is_active: form.is_active
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

        // Criar algumas respostas fictícias
        const numRespostas = Math.floor(Math.random() * 15) + 5;
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

        console.log(`    ✅ Formulário "${form.name}" criado com ${numRespostas} respostas`);
      } catch (err) {
        console.error(`    ❌ Erro geral no formulário "${form.name}":`, err.message);
      }
    }

    console.log('\n✅ Formulários demo criados com sucesso!');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

createSimpleForms();
