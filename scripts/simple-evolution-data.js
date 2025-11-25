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

async function createSimpleEvolutionData() {
  console.log('📊 Criando dados simples de evolução...');

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

    // Dados básicos de evolução (apenas campos essenciais)
    const evolutions = [
      {
        measurement_date: '2024-06-01',
        weight: 68.0,
        height: 1.62, // em metros
        notes: 'Medição inicial pós-parto. Meta: 58kg'
      },
      {
        measurement_date: '2024-06-15',
        weight: 66.5,
        height: 1.62,
        notes: 'Primeira quinzena: -1.5kg. Boa aderência!'
      },
      {
        measurement_date: '2024-07-01',
        weight: 64.8,
        height: 1.62,
        notes: 'Primeiro mês: -3.2kg total. Introduzindo exercícios.'
      },
      {
        measurement_date: '2024-08-01',
        weight: 63.0,
        height: 1.62,
        notes: 'Segundo mês: -5kg total. Excelente progresso!'
      },
      {
        measurement_date: '2024-09-01',
        weight: 60.5,
        height: 1.62,
        notes: 'Terceiro mês: -7.5kg total. Mantendo massa muscular.'
      },
      {
        measurement_date: '2024-10-01',
        weight: 58.0,
        height: 1.62,
        notes: '🎉 META ATINGIDA! -10kg em 4 meses!'
      }
    ];

    let successCount = 0;
    for (const evolution of evolutions) {
      const bmi = evolution.weight / (evolution.height * evolution.height);
      
      try {
        const { error } = await supabaseAdmin
          .from('client_evolution')
          .insert({
            client_id: fernanda.id,
            user_id: userId,
            measurement_date: evolution.measurement_date,
            weight: evolution.weight,
            height: evolution.height,
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
          console.log(`    ✅ Evolução ${evolution.measurement_date} criada (${evolution.weight}kg)`);
        }
      } catch (err) {
        console.error(`    ❌ Exceção ao criar evolução ${evolution.measurement_date}:`, err.message);
      }
    }

    // Criar também para Maria (diabetes)
    const maria = clients.find(c => c.name === 'Maria Silva Santos');
    if (maria) {
      console.log(`\n👤 Criando evolução para Maria (${maria.id})`);
      
      const mariaEvolutions = [
        {
          measurement_date: '2024-09-15',
          weight: 78.0,
          height: 1.65,
          notes: 'Primeira medição. Diabetes descontrolado.'
        },
        {
          measurement_date: '2024-10-01',
          weight: 76.8,
          height: 1.65,
          notes: 'Primeira quinzena: -1.2kg. Glicemia melhorando.'
        },
        {
          measurement_date: '2024-10-15',
          weight: 75.2,
          height: 1.65,
          notes: 'Primeiro mês: -2.8kg. HbA1c de 8.2% para 7.1%!'
        },
        {
          measurement_date: '2024-11-01',
          weight: 73.8,
          height: 1.65,
          notes: 'Excelente! Diabetes controlado, energia alta.'
        }
      ];

      let mariaSuccess = 0;
      for (const evolution of mariaEvolutions) {
        const bmi = evolution.weight / (evolution.height * evolution.height);
        
        try {
          const { error } = await supabaseAdmin
            .from('client_evolution')
            .insert({
              client_id: maria.id,
              user_id: userId,
              measurement_date: evolution.measurement_date,
              weight: evolution.weight,
              height: evolution.height,
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
            mariaSuccess++;
            console.log(`    ✅ Evolução ${evolution.measurement_date} criada (${evolution.weight}kg)`);
          }
        } catch (err) {
          console.error(`    ❌ Exceção ao criar evolução ${evolution.measurement_date}:`, err.message);
        }
      }
      console.log(`  ✅ Maria: ${mariaSuccess} evoluções criadas`);
    }

    console.log(`\n✅ Fernanda: ${successCount} evoluções físicas criadas com sucesso!`);
    console.log('\n📊 Jornada completa da Fernanda:');
    console.log('   • Peso inicial: 68kg → Peso final: 58kg');
    console.log('   • Perda total: 10kg em 4 meses');
    console.log('   • IMC: 25.9 → 22.1 (peso normal)');
    console.log('\n🎬 Agora as abas de Evolução Física estão populadas!');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

createSimpleEvolutionData();
