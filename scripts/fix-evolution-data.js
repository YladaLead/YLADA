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

async function fixEvolutionData() {
  console.log('🔧 Corrigindo dados de evolução com valores menores...');

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

    // Buscar clientes
    const { data: clients, error: clientsError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('user_id', userId);

    if (clientsError) {
      console.error('❌ Erro ao buscar clientes:', clientsError.message);
      return;
    }

    // Encontrar Fernanda
    const fernanda = clients.find(c => c.name === 'Fernanda Rodrigues');
    if (!fernanda) {
      console.error('❌ Fernanda não encontrada');
      return;
    }

    console.log(`👤 Criando evolução para Fernanda (${fernanda.id})`);

    // Dados de evolução com valores menores (compatíveis com numeric fields)
    const evolutions = [
      {
        measurement_date: '2024-06-01',
        weight: 68.0,
        height: 162,
        waist_circumference: 85.0,
        hip_circumference: 105.0,
        neck_circumference: 36.0,
        arm_circumference: 30.0,
        thigh_circumference: 62.0,
        body_fat_percentage: 32.0,
        muscle_mass: 48.0,
        water_percentage: 52.0,
        visceral_fat: 9.0,
        notes: 'Medição inicial pós-parto. Meta: 58kg'
      },
      {
        measurement_date: '2024-06-15',
        weight: 66.5,
        height: 162,
        waist_circumference: 83.0,
        hip_circumference: 103.0,
        neck_circumference: 35.5,
        arm_circumference: 29.5,
        thigh_circumference: 61.0,
        body_fat_percentage: 31.2,
        muscle_mass: 48.2,
        water_percentage: 52.8,
        visceral_fat: 8.0,
        notes: 'Primeira quinzena: -1.5kg. Boa aderência!'
      },
      {
        measurement_date: '2024-07-01',
        weight: 64.8,
        height: 162,
        waist_circumference: 81.0,
        hip_circumference: 101.0,
        neck_circumference: 35.0,
        arm_circumference: 29.0,
        thigh_circumference: 60.0,
        body_fat_percentage: 30.1,
        muscle_mass: 48.5,
        water_percentage: 53.5,
        visceral_fat: 7.0,
        notes: 'Primeiro mês: -3.2kg total. Introduzindo exercícios.'
      },
      {
        measurement_date: '2024-08-01',
        weight: 63.0,
        height: 162,
        waist_circumference: 78.0,
        hip_circumference: 98.0,
        neck_circumference: 34.5,
        arm_circumference: 28.5,
        thigh_circumference: 58.0,
        body_fat_percentage: 28.5,
        muscle_mass: 49.0,
        water_percentage: 54.2,
        visceral_fat: 6.0,
        notes: 'Segundo mês: -5kg total. Excelente progresso!'
      },
      {
        measurement_date: '2024-09-01',
        weight: 60.5,
        height: 162,
        waist_circumference: 75.0,
        hip_circumference: 96.0,
        neck_circumference: 34.0,
        arm_circumference: 28.0,
        thigh_circumference: 57.0,
        body_fat_percentage: 26.2,
        muscle_mass: 49.2,
        water_percentage: 55.0,
        visceral_fat: 5.0,
        notes: 'Terceiro mês: -7.5kg total. Mantendo massa muscular.'
      },
      {
        measurement_date: '2024-10-01',
        weight: 58.0,
        height: 162,
        waist_circumference: 70.0,
        hip_circumference: 95.0,
        neck_circumference: 33.5,
        arm_circumference: 27.5,
        thigh_circumference: 56.0,
        body_fat_percentage: 22.0,
        muscle_mass: 49.5,
        water_percentage: 56.0,
        visceral_fat: 4.0,
        notes: '🎉 META ATINGIDA! -10kg em 4 meses!'
      }
    ];

    let successCount = 0;
    for (const evolution of evolutions) {
      const bmi = evolution.weight / Math.pow(evolution.height / 100, 2);
      
      try {
        const { error } = await supabaseAdmin
          .from('client_evolution')
          .insert({
            client_id: fernanda.id,
            user_id: userId,
            measurement_date: evolution.measurement_date,
            weight: evolution.weight,
            height: evolution.height,
            waist_circumference: evolution.waist_circumference,
            hip_circumference: evolution.hip_circumference,
            neck_circumference: evolution.neck_circumference,
            arm_circumference: evolution.arm_circumference,
            thigh_circumference: evolution.thigh_circumference,
            body_fat_percentage: evolution.body_fat_percentage,
            muscle_mass: evolution.muscle_mass,
            water_percentage: evolution.water_percentage,
            visceral_fat: evolution.visceral_fat,
            bmi: parseFloat(bmi.toFixed(1)),
            notes: evolution.notes,
            created_by: userId,
            created_at: `${evolution.measurement_date}T10:00:00Z`
          });

        if (error) {
          if (error.message.includes('duplicate key')) {
            console.log(`    ⚠️ Evolução ${evolution.measurement_date} já existe`);
          } else {
            console.error(`    ❌ Erro ao criar evolução ${evolution.measurement_date}:`, error.message);
          }
        } else {
          successCount++;
          console.log(`    ✅ Evolução ${evolution.measurement_date} criada`);
        }
      } catch (err) {
        console.error(`    ❌ Exceção ao criar evolução ${evolution.measurement_date}:`, err.message);
      }
    }

    console.log(`\n✅ Fernanda: ${successCount} evoluções físicas criadas com sucesso!`);
    console.log('\n📊 Jornada completa da Fernanda:');
    console.log('   • Peso inicial: 68kg → Peso final: 58kg');
    console.log('   • Perda total: 10kg em 4 meses');
    console.log('   • Gordura corporal: 32% → 22% (-10%)');
    console.log('   • Cintura: 85cm → 70cm (-15cm)');
    console.log('   • Massa muscular: mantida e aumentada');
    console.log('\n🎬 Perfeito para demonstração de caso de sucesso!');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

fixEvolutionData();
