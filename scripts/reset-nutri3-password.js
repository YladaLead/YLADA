require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Variáveis de ambiente não configuradas!');
  console.log('   Certifique-se de ter NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetNutri3Password() {
  try {
    console.log('🔑 Resetando senha da conta nutri3@ylada.com...\n');

    // Buscar o usuário
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.log('❌ Erro ao listar usuários:', listError.message);
      return;
    }

    const nutri3User = authUsers.users.find(u => u.email === 'nutri3@ylada.com');
    
    if (!nutri3User) {
      console.log('❌ Usuário nutri3@ylada.com não encontrado');
      console.log('\n💡 Dica: Crie o usuário primeiro no Supabase Dashboard:');
      console.log('   1. Acesse: Supabase Dashboard → Authentication → Users');
      console.log('   2. Clique em "Add User"');
      console.log('   3. Email: nutri3@ylada.com');
      console.log('   4. Password: senha123');
      console.log('   5. Marque "Auto Confirm User"');
      return;
    }

    console.log('✅ Usuário encontrado:', nutri3User.email);
    console.log('   ID:', nutri3User.id);

    // Resetar senha
    const { data, error } = await supabase.auth.admin.updateUserById(
      nutri3User.id,
      { 
        password: 'senha123',
        email_confirm: true
      }
    );

    if (error) {
      console.log('❌ Erro ao resetar senha:', error.message);
      return;
    }

    console.log('\n✅ Senha resetada com sucesso!');
    console.log('\n🎉 CREDENCIAIS DA CONTA:');
    console.log('📧 Email: nutri3@ylada.com');
    console.log('🔑 Senha: senha123');
    console.log('👤 Nome: Nutricionista Teste 3');
    console.log('\n💡 Agora você pode fazer login com essas credenciais!');

  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  }
}

resetNutri3Password();
