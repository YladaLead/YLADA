require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createCoachDemoAccount() {
  try {
    console.log('🚀 Criando conta demo para Coach...');

    // 1. Criar usuário de autenticação
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'demo.coach@ylada.com',
      password: 'demo123456',
      email_confirm: true
    });

    if (authError) {
      console.log('❌ Erro ao criar usuário:', authError.message);
      return;
    }

    console.log('✅ Usuário criado:', authUser.user.email);

    // 2. Criar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authUser.user.id,
        nome_completo: 'Carlos Coach',
        email: 'demo.coach@ylada.com',
        telefone: '(11) 99999-8888',
        perfil: 'coach',
        bio: 'Especialista em transformação pessoal e profissional. Ajudo pessoas a conquistarem seus objetivos e viverem uma vida mais plena e realizada.',
        especialidades: ['Coaching de Carreira', 'Liderança', 'Desenvolvimento Pessoal', 'Produtividade'],
        experiencia_anos: 8,
        formacao: 'Psicólogo, Certified Professional Coach (CPC), Master em Coaching Executivo'
      })
      .select()
      .single();

    if (profileError) {
      console.log('❌ Erro ao criar perfil:', profileError.message);
      return;
    }

    console.log('✅ Perfil criado para Carlos Coach');

    // 3. Criar configurações básicas
    const { error: configError } = await supabase
      .from('user_settings')
      .insert({
        user_id: authUser.user.id,
        notifications_email: true,
        notifications_whatsapp: true,
        theme: 'light',
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo'
      });

    if (configError) {
      console.log('❌ Erro ao criar configurações:', configError.message);
      return;
    }

    console.log('✅ Configurações criadas');

    console.log('\n🎉 CONTA DEMO COACH CRIADA COM SUCESSO!');
    console.log('📧 Email: demo.coach@ylada.com');
    console.log('🔑 Senha: demo123456');
    console.log('👤 Nome: Carlos Coach');
    console.log('🎯 Perfil: coach');

  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  }
}

createCoachDemoAccount();
