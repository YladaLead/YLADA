require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCoachUser() {
  try {
    console.log('🔍 Verificando usuário coach...');

    // Verificar na tabela auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Erro ao listar usuários auth:', authError.message);
      return;
    }

    const coachAuthUser = authUsers.users.find(u => u.email === 'demo.coach@ylada.com');
    console.log('👤 Usuário auth coach:', coachAuthUser ? coachAuthUser.id : 'NÃO ENCONTRADO');

    // Verificar na tabela user_profiles
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'demo.coach@ylada.com');

    if (profileError) {
      console.log('❌ Erro ao buscar perfil:', profileError.message);
      return;
    }

    console.log('📋 Perfis encontrados:', profiles.length);
    if (profiles.length > 0) {
      console.log('✅ Perfil coach:', profiles[0]);
    }

    // Verificar se existe na tabela users (se houver)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'demo.coach@ylada.com');

    console.log('👥 Tabela users:', usersError ? 'ERRO: ' + usersError.message : `${users?.length || 0} registros`);

  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  }
}

checkCoachUser();
