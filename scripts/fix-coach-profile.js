require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixCoachProfile() {
  try {
    console.log('🔧 Corrigindo perfil do coach...');

    // Buscar o ID correto do auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    const coachAuthUser = authUsers.users.find(u => u.email === 'demo.coach@ylada.com');
    
    if (!coachAuthUser) {
      console.log('❌ Usuário auth não encontrado');
      return;
    }

    console.log('✅ Auth ID encontrado:', coachAuthUser.id);

    // Atualizar o perfil existente
    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({
        user_id: coachAuthUser.id,
        perfil: 'coach',
        nome_completo: 'Carlos Coach',
        bio: 'Especialista em transformação pessoal e profissional. Ajudo pessoas a conquistarem seus objetivos e viverem uma vida mais plena e realizada.',
        profession: 'coach'
      })
      .eq('email', 'demo.coach@ylada.com')
      .select()
      .single();

    if (updateError) {
      console.log('❌ Erro ao atualizar perfil:', updateError.message);
      return;
    }

    console.log('✅ Perfil atualizado:', updatedProfile);

    // Verificar se precisa criar na tabela users
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', coachAuthUser.id)
      .single();

    if (userError && userError.code === 'PGRST116') {
      // Usuário não existe, vamos criar
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          id: coachAuthUser.id,
          email: 'demo.coach@ylada.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createUserError) {
        console.log('❌ Erro ao criar usuário:', createUserError.message);
      } else {
        console.log('✅ Usuário criado na tabela users');
      }
    }

    console.log('\n🎉 PERFIL COACH CORRIGIDO!');

  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  }
}

fixCoachProfile();
