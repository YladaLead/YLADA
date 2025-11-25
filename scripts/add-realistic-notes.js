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

async function addRealisticNotes() {
  console.log('📝 Adicionando notas realistas para demonstração...');

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

    // Adicionar notas detalhadas para cada cliente
    const clientNotes = {
      'Maria Silva Santos': [
        {
          type: 'nota_adicionada',
          title: '📋 Plano Alimentar Detalhado',
          description: `CAFÉ DA MANHÃ:
• Opção 1: 1 fatia pão integral + 1 ovo mexido + 1 xíc café s/açúcar
• Opção 2: 1 iogurte natural + 2 col sopa aveia + frutas vermelhas
• Opção 3: 1 tapioca pequena + 1 col sopa cottage + 1 fruta

LANCHE MANHÃ:
• 1 fruta + 10 castanhas OU 1 iogurte natural + canela

ALMOÇO:
• 100g proteína (frango/peixe/carne magra)
• 3 col sopa carboidrato integral (arroz/quinoa/batata doce)
• Salada verde à vontade + legumes refogados

LANCHE TARDE:
• 1 fruta + 1 col sopa pasta amendoim OU vitamina com leite vegetal

JANTAR:
• 100g proteína + salada grande + 2 col sopa carboidrato
• Opção: Omelete com legumes + salada

SUPLEMENTAÇÃO:
• Ômega 3 - 1 cápsula/dia
• Vitamina D - 2000UI/dia  
• Magnésio - 1 cápsula antes de dormir`,
          date: '2024-09-15T16:00:00Z'
        },
        {
          type: 'nota_adicionada',
          title: '🩺 Orientações para Diabetes',
          description: `CONTROLE GLICÊMICO:
• Monitorar glicemia em jejum e pós-prandial
• Meta: Jejum 70-100mg/dl, Pós-prandial <140mg/dl
• Anotar valores no diário alimentar

ALIMENTOS PERMITIDOS:
• Carboidratos integrais (aveia, quinoa, batata doce)
• Proteínas magras (frango, peixe, ovos, leguminosas)
• Gorduras boas (azeite, castanhas, abacate)
• Vegetais à vontade (exceto batata, mandioca)

ALIMENTOS EVITAR:
• Açúcar refinado e doces
• Refrigerantes e sucos industrializados  
• Pão branco, arroz branco
• Frituras e alimentos processados

HIDRATAÇÃO:
• Mínimo 2L água/dia
• Chás sem açúcar liberados
• Evitar bebidas alcoólicas`,
          date: '2024-09-16T10:00:00Z'
        },
        {
          type: 'registro_emocional',
          title: '😊 Avaliação Emocional - Semana 2',
          description: `ESTADO EMOCIONAL: Motivada e confiante

PONTOS POSITIVOS:
• Conseguiu seguir o plano 6 dias da semana
• Não teve episódios de compulsão
• Dormindo melhor (7h por noite)
• Mais energia durante o dia

DESAFIOS:
• Fim de semana em família (tentações)
• Ansiedade no trabalho (reuniões importantes)
• Vontade de doce no período pré-menstrual

ESTRATÉGIAS:
• Preparar lanches saudáveis para levar ao trabalho
• Técnicas de respiração para ansiedade
• Opções de sobremesas saudáveis para família

PRÓXIMOS PASSOS:
• Incluir caminhada 3x/semana
• Receitas de doces fit para TPM`,
          date: '2024-09-28T15:30:00Z'
        }
      ],
      'Roberto Silva Mendes': [
        {
          type: 'nota_adicionada',
          title: '🫀 Dieta DASH para Hipertensão',
          description: `PRINCÍPIOS DA DIETA DASH:
• Rica em frutas, vegetais e grãos integrais
• Proteínas magras (peixe, frango, leguminosas)
• Laticínios com baixo teor de gordura
• Redução significativa do sódio

METAS DIÁRIAS:
• Sódio: máximo 1500mg/dia
• Potássio: 4700mg/dia (banana, laranja, espinafre)
• Magnésio: 500mg/dia (castanhas, sementes)
• Cálcio: 1200mg/dia (laticínios, vegetais verdes)

SUBSTITUIÇÕES IMPORTANTES:
• Sal comum → temperos naturais (ervas, alho, limão)
• Embutidos → carnes frescas
• Enlatados → alimentos frescos ou congelados
• Refrigerantes → água com gás + limão

MONITORAMENTO:
• Pressão arterial 2x/dia (manhã e noite)
• Peso semanal
• Circunferência abdominal mensal`,
          date: '2024-10-01T17:00:00Z'
        },
        {
          type: 'nota_adicionada',
          title: '📊 Resultados dos Exames - Mês 1',
          description: `EVOLUÇÃO LABORATORIAL:

LIPIDOGRAMA:
• Colesterol Total: 220mg/dl (era 280mg/dl) ⬇️ -60mg/dl
• LDL: 140mg/dl (era 180mg/dl) ⬇️ -40mg/dl  
• HDL: 45mg/dl (era 40mg/dl) ⬆️ +5mg/dl
• Triglicerídeos: 150mg/dl (era 200mg/dl) ⬇️ -50mg/dl

PRESSÃO ARTERIAL:
• Média manhã: 135/88 mmHg (era 150/95)
• Média noite: 130/85 mmHg (era 145/90)
• Melhora de 15/7 mmHg na média geral

ANTROPOMETRIA:
• Peso: 83.2kg (era 85kg) ⬇️ -1.8kg
• Cintura: 99cm (era 102cm) ⬇️ -3cm
• IMC: 28.1 (era 28.7)

PRÓXIMOS OBJETIVOS:
• Colesterol total <200mg/dl
• PA <130/80 mmHg
• Perda de mais 3kg`,
          date: '2024-11-10T11:00:00Z'
        }
      ],
      'Fernanda Rodrigues': [
        {
          type: 'programa_concluido',
          title: '🎉 SUCESSO: Meta Alcançada!',
          description: `RESULTADOS FINAIS - 4 MESES DE ACOMPANHAMENTO:

PERDA DE PESO:
• Peso inicial: 68kg
• Peso final: 58kg  
• TOTAL PERDIDO: 10kg ✨
• Meta era 58kg - OBJETIVO ATINGIDO!

COMPOSIÇÃO CORPORAL:
• Gordura corporal: 32% → 22% (-10%)
• Massa muscular: mantida (48kg)
• Circunferência cintura: 85cm → 70cm (-15cm)
• Circunferência quadril: 105cm → 95cm (-10cm)

BENEFÍCIOS ALCANÇADOS:
• Energia aumentou significativamente
• Qualidade do sono melhorou
• Autoestima restaurada
• Roupas pré-gravidez servindo novamente
• Amamentação mantida com sucesso

HÁBITOS CONSOLIDADOS:
• 5-6 refeições pequenas por dia
• Hidratação adequada (2.5L/dia)
• Exercícios 4x/semana
• Controle das porções
• Escolhas alimentares conscientes

PLANO DE MANUTENÇÃO:
• Consultas trimestrais para acompanhamento
• Flexibilidade 80/20 (80% saudável, 20% flexível)
• Monitoramento mensal do peso
• Atividade física regular

PARABÉNS FERNANDA! 👏`,
          date: '2024-10-15T11:00:00Z'
        }
      ],
      'Ana Carolina Lima': [
        {
          type: 'nota_adicionada',
          title: '📋 Preparação para Primeira Consulta',
          description: `ANAMNESE PRÉVIA RECEBIDA:

DADOS PESSOAIS:
• Idade: 45 anos
• Profissão: Professora
• Estado civil: Casada, 2 filhos

HISTÓRICO MÉDICO:
• Diabetes Tipo 2 há 3 anos
• Hipertensão leve controlada
• Hipotireoidismo (Puran T4 75mcg)
• Histórico familiar: diabetes (mãe), hipertensão (pai)

MEDICAMENTOS ATUAIS:
• Metformina 850mg - 2x/dia
• Losartana 50mg - 1x/dia  
• Levotiroxina 75mcg - jejum

OBJETIVOS PRINCIPAIS:
• Controlar melhor a glicemia
• Perder 8-10kg com segurança
• Aumentar disposição e energia
• Melhorar qualidade de vida

EXAMES RECENTES (Outubro/2024):
• Glicemia jejum: 145mg/dl (elevada)
• HbA1c: 7.8% (meta <7%)
• Colesterol: 210mg/dl
• TSH: 2.1 (normal)

PRIMEIRA CONSULTA AGENDADA:
📅 25/11/2024 às 14h00
🎯 Foco: Plano alimentar para diabéticos`,
          date: '2024-11-19T09:30:00Z'
        }
      ]
    };

    // Adicionar notas para cada cliente
    for (const client of clients) {
      const notes = clientNotes[client.name];
      if (!notes) continue;

      console.log(`\n📝 Adicionando notas para: ${client.name}`);
      
      for (const note of notes) {
        try {
          const { error } = await supabaseAdmin
            .from('client_history')
            .insert({
              client_id: client.id,
              user_id: userId,
              activity_type: note.type,
              title: note.title,
              description: note.description,
              created_by: userId,
              created_at: note.date
            });

          if (error && !error.message.includes('duplicate key')) {
            console.error(`    ❌ Erro ao criar nota "${note.title}":`, error.message);
          }
        } catch (err) {
          // Ignorar erros de duplicata
        }
      }
      
      console.log(`  ✅ ${notes.length} notas detalhadas adicionadas`);
    }

    console.log('\n✅ Notas realistas adicionadas com sucesso!');
    console.log('\n📋 Agora os clientes têm:');
    console.log('   • Planos alimentares detalhados');
    console.log('   • Orientações médicas específicas');
    console.log('   • Avaliações emocionais');
    console.log('   • Resultados de exames');
    console.log('   • Histórico completo de evolução');
    console.log('\n🎬 Perfeito para gravação de vídeos demonstrativos!');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

addRealisticNotes();
