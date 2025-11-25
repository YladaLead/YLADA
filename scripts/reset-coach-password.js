require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetCoachPassword() {
  try {
    console.log('🔑 Resetando senha da conta demo coach...');

    // Buscar o usuário
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.log('❌ Erro ao listar usuários:', listError.message);
      return;
    }

    const coachUser = authUsers.users.find(u => u.email === 'demo.coach@ylada.com');
    
    if (!coachUser) {
      console.log('❌ Usuário coach não encontrado');
      return;
    }

    console.log('✅ Usuário encontrado:', coachUser.email);

    // Resetar senha
    const { data, error } = await supabase.auth.admin.updateUserById(
      coachUser.id,
      { 
        password: 'demo123456',
        email_confirm: true
      }
    );

    if (error) {
      console.log('❌ Erro ao resetar senha:', error.message);
      return;
    }

    console.log('✅ Senha resetada com sucesso!');
    console.log('\n🎉 CREDENCIAIS DA CONTA DEMO COACH:');
    console.log('📧 Email: demo.coach@ylada.com');
    console.log('🔑 Senha: demo123456');
    console.log('👤 Nome: Carlos Coach');

  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  }
}

resetCoachPassword();
