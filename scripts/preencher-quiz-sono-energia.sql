-- ============================================================
-- Script: preencher-quiz-sono-energia.sql
-- Objetivo: substituir os conteúdos genéricos (Pergunta/Opção 1)
--           pelos textos completos usados no preview oficial
--           para os templates "Avaliação do Sono e Energia"
--           e "Quiz Energético" da área Nutri.
--
-- Uso:
--   1. Abra o SQL Editor do Supabase ou seu cliente favorito.
--   2. Execute TODO o bloco abaixo de uma vez.
--   3. Recarregue o catálogo para ver as perguntas atualizadas.
-- ============================================================

BEGIN;

-- ============================================================
-- 0) Templates que ainda estão com perguntas fictícias
-- ============================================================
--  - Descubra seu Perfil de Bem-Estar       (slug: descobr a-perfil-bem-estar)
--  - Diagnóstico de Parasitose              (slug: template-diagnostico-parasitose)
--  - Qual é o seu Tipo de Fome?             (slug: quiz-tipo-fome)
--  - Seu corpo está pedindo Detox?          (slug: quiz-pedindo-detox)
--  - Qual é seu perfil de intestino?        (slug: perfil-intestino)

-- 1) Avaliação do Sono e Energia
UPDATE templates_nutrition
SET
  content = '{
    "template_type": "quiz",
    "profession": "nutri",
    "questions": [
      {
        "id": 1,
        "question": "Como você se sente quando acorda?",
        "type": "multiple_choice",
        "options": [
          {"id": "renovada", "label": "Renovada e pronta para o dia"},
          {"id": "ok", "label": "Bem, mas preciso de alguns minutos"},
          {"id": "cansada", "label": "Cansada, demoro para despertar"},
          {"id": "exausta", "label": "Exausta, sinto que nem dormi"}
        ]
      },
      {
        "id": 2,
        "question": "Quanto tempo você leva para pegar no sono?",
        "type": "multiple_choice",
        "options": [
          {"id": "rapido", "label": "Adormeço em menos de 15 minutos"},
          {"id": "normal", "label": "Entre 15 e 30 minutos"},
          {"id": "demorado", "label": "Mais de 30 minutos"},
          {"id": "varia", "label": "Varia bastante a cada noite"}
        ]
      },
      {
        "id": 3,
        "question": "Você acorda durante a noite?",
        "type": "multiple_choice",
        "options": [
          {"id": "nao", "label": "Não, durmo a noite toda"},
          {"id": "uma_vez", "label": "Sim, 1 vez"},
          {"id": "duas_tres", "label": "Sim, 2-3 vezes"},
          {"id": "frequente", "label": "Sim, várias vezes e tenho dificuldade para voltar a dormir"}
        ]
      },
      {
        "id": 4,
        "question": "Como você descreve sua energia à tarde?",
        "type": "multiple_choice",
        "options": [
          {"id": "alta", "label": "Alta, me sinto produtiva"},
          {"id": "estavel", "label": "Estável, sem grandes oscilações"},
          {"id": "queda", "label": "Tenho uma queda forte depois do almoço"},
          {"id": "oscilante", "label": "Oscila entre picos e fadiga"}
        ]
      },
      {
        "id": 5,
        "question": "Com que frequência você usa cafeína ou estimulantes para se manter ativa?",
        "type": "multiple_choice",
        "options": [
          {"id": "quase_nunca", "label": "Quase nunca"},
          {"id": "uma_vez", "label": "1 vez ao dia"},
          {"id": "duas_tres", "label": "2-3 vezes ao dia"},
          {"id": "mais_quatro", "label": "4 ou mais vezes ao dia"}
        ]
      },
      {
        "id": 6,
        "question": "Você sente que recupera energia depois do trabalho/estudos?",
        "type": "multiple_choice",
        "options": [
          {"id": "rapido", "label": "Sim, recupero rápido"},
          {"id": "moderado", "label": "Levo algumas horas"},
          {"id": "dia_todo", "label": "Preciso do dia seguinte para voltar ao normal"},
          {"id": "nao_recupero", "label": "Quase nunca recupero totalmente"}
        ]
      },
      {
        "id": 7,
        "question": "Como é sua rotina antes de dormir?",
        "type": "multiple_choice",
        "options": [
          {"id": "ritual", "label": "Tenho ritual relaxante (luz baixa, leitura, respiração)"},
          {"id": "parcial", "label": "Tento desacelerar, mas ainda fico no celular/computador"},
          {"id": "sem_rotina", "label": "Vou dormir logo após fechar o computador/TV"},
          {"id": "imprevisivel", "label": "Não tenho horário fixo, durmo quando dá"}
        ]
      },
      {
        "id": 8,
        "question": "Depois de uma noite mal dormida, como fica sua alimentação no dia seguinte?",
        "type": "multiple_choice",
        "options": [
          {"id": "equilibrada", "label": "Consigo manter alimentação equilibrada"},
          {"id": "mais_cafeina", "label": "Aumento cafeína e beliscos doces"},
          {"id": "pulo_refeicoes", "label": "Pulo refeições ou como qualquer coisa"},
          {"id": "fome_excessiva", "label": "Sinto muita fome e vontade de carboidratos rápidos"}
        ]
      },
      {
        "id": 9,
        "question": "Qual é o impacto do seu sono no humor?",
        "type": "multiple_choice",
        "options": [
          {"id": "positivo", "label": "Me sinto equilibrada e confiante"},
          {"id": "leve_irritacao", "label": "Percebo leve irritação quando durmo mal"},
          {"id": "oscilacoes", "label": "Meu humor oscila bastante"},
          {"id": "irritada", "label": "Fico irritada e sem paciência"}
        ]
      },
      {
        "id": 10,
        "question": "Qual é a sua prioridade principal neste momento?",
        "type": "multiple_choice",
        "options": [
          {"id": "dormir_melhor", "label": "Dormir melhor e acordar descansada"},
          {"id": "energia_constante", "label": "Manter energia constante ao longo do dia"},
          {"id": "produtividade", "label": "Produzir sem depender de estimulantes"},
          {"id": "reduzir_ansiedade", "label": "Reduzir ansiedade noturna e mente acelerada"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'avaliacao-sono-energia';

-- 2) Quiz Energético
UPDATE templates_nutrition
SET
  content = '{
    "template_type": "quiz",
    "profession": "nutri",
    "questions": [
      {
        "id": 1,
        "question": "Como você descreve sua energia ao longo do dia?",
        "type": "multiple_choice",
        "options": [
          {"id": "sempre_alta", "label": "Alta o dia todo"},
          {"id": "estavel", "label": "Estável, com pequenas oscilações"},
          {"id": "queda_tarde", "label": "Cai no meio da tarde"},
          {"id": "baixa_constante", "label": "Baixa quase sempre"}
        ]
      },
      {
        "id": 2,
        "question": "Você sente necessidade de cochilos ou pausas para aguentar a rotina?",
        "type": "multiple_choice",
        "options": [
          {"id": "nunca", "label": "Nunca, sigo firme"},
          {"id": "as_vezes", "label": "Às vezes, quando o dia é intenso"},
          {"id": "frequente", "label": "Quase todos os dias"},
          {"id": "sempre", "label": "Sem cochilo não consigo render"}
        ]
      },
      {
        "id": 3,
        "question": "Como está a qualidade do seu sono?",
        "type": "multiple_choice",
        "options": [
          {"id": "otima", "label": "Ótima, acordo renovada"},
          {"id": "boa", "label": "Boa, mas poderia ser melhor"},
          {"id": "irregular", "label": "Irregular, tenho noites ruins"},
          {"id": "ruim", "label": "Ruim, acordo cansada"}
        ]
      },
      {
        "id": 4,
        "question": "Com que frequência você sente estresse ou mente acelerada?",
        "type": "multiple_choice",
        "options": [
          {"id": "raramente", "label": "Raramente"},
          {"id": "algumas_vezes", "label": "Algumas vezes por semana"},
          {"id": "quase_todo_dia", "label": "Quase todos os dias"},
          {"id": "constante", "label": "O tempo inteiro"}
        ]
      },
      {
        "id": 5,
        "question": "Como você se sente após as refeições principais?",
        "type": "multiple_choice",
        "options": [
          {"id": "energizada", "label": "Leve e energizada"},
          {"id": "satisfeita", "label": "Satisfeita e estável"},
          {"id": "sonolenta", "label": "Sonolenta ou com queda de energia"},
          {"id": "inchada", "label": "Inchada ou desconfortável"}
        ]
      },
      {
        "id": 6,
        "question": "Como está seu consumo de cafeína/estimulantes?",
        "type": "multiple_choice",
        "options": [
          {"id": "quase_nada", "label": "Quase nada"},
          {"id": "moderado", "label": "Uso moderado (1-2 doses/dia)"},
          {"id": "alto", "label": "Uso alto (3-4 doses/dia)"},
          {"id": "muito_alto", "label": "Uso muito alto (5+ doses/dia)"}
        ]
      },
      {
        "id": 7,
        "question": "Sua alimentação oferece refeições equilibradas ao longo do dia?",
        "type": "multiple_choice",
        "options": [
          {"id": "sim", "label": "Sim, tenho planejamento"},
          {"id": "quase", "label": "Na maior parte do tempo"},
          {"id": "pulo_refeicoes", "label": "Pulo refeições ou como correndo"},
          {"id": "desorganizada", "label": "Bastante desorganizada"}
        ]
      },
      {
        "id": 8,
        "question": "Quanto você se hidrata por dia?",
        "type": "multiple_choice",
        "options": [
          {"id": "mais3l", "label": "Mais de 3 litros"},
          {"id": "entre2e3", "label": "Entre 2 e 3 litros"},
          {"id": "ate2l", "label": "Até 2 litros"},
          {"id": "menos1l", "label": "Menos de 1 litro"}
        ]
      },
      {
        "id": 9,
        "question": "Qual é sua frequência de atividade física estruturada?",
        "type": "multiple_choice",
        "options": [
          {"id": "5x_semana", "label": "5x por semana ou mais"},
          {"id": "3x_semana", "label": "3-4x por semana"},
          {"id": "1x_semana", "label": "1-2x por semana"},
          {"id": "sem_rotina", "label": "Não tenho rotina de treinos"}
        ]
      },
      {
        "id": 10,
        "question": "Qual objetivo você quer alcançar primeiro?",
        "type": "multiple_choice",
        "options": [
          {"id": "energia_constante", "label": "Manter energia estável o dia todo"},
          {"id": "render_melhor", "label": "Render mais no trabalho/estudos"},
          {"id": "reduzir_estimulantes", "label": "Depender menos de café ou açúcar"},
          {"id": "melhorar_sono", "label": "Dormir melhor para recuperar energia"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'quiz-energetico';

-- 3) Descubra seu Perfil de Bem-Estar
UPDATE templates_nutrition
SET
  content = '{
    "template_type": "quiz",
    "profession": "nutri",
    "questions": [
      {
        "id": 1,
        "question": "Quando pensa em cuidar da saúde, o que vem primeiro?",
        "type": "multiple_choice",
        "options": [
          {"id": "estetica", "label": "Estética e aparência"},
          {"id": "equilibrio", "label": "Equilíbrio entre energia, sono e alimentação"},
          {"id": "saude", "label": "Resultados clínicos (exames, performance, composição)"},
          {"id": "estilo", "label": "Rotina leve, sem muitas regras"}
        ]
      },
      {
        "id": 2,
        "question": "Como você prioriza suas refeições?",
        "type": "multiple_choice",
        "options": [
          {"id": "visual", "label": "Penso em algo leve que ajude na aparência"},
          {"id": "sensacoes", "label": "Escolho o que vai me deixar bem e com energia"},
          {"id": "resultado", "label": "Analiso macros/calorias/objetivo"},
          {"id": "praticidade", "label": "O que for mais prático no dia"}
        ]
      },
      {
        "id": 3,
        "question": "Seu sono está...",
        "type": "multiple_choice",
        "options": [
          {"id": "irregular", "label": "Irregular, acordo cansada"},
          {"id": "oscilante", "label": "Oscila conforme minha rotina"},
          {"id": "estruturado", "label": "Bem estruturado com horário fixo"},
          {"id": "adequado", "label": "Adequado, mas posso ajustar"}
        ]
      },
      {
        "id": 4,
        "question": "Como você reage aos dias corridos?",
        "type": "multiple_choice",
        "options": [
          {"id": "perco_habitos", "label": "Deixo alimentação/exercício em segundo plano"},
          {"id": "adapto", "label": "Adapto com escolhas conscientes"},
          {"id": "sigo_plano", "label": "Sigo o plano mesmo com agenda cheia"},
          {"id": "faço_minimo", "label": "Faço o mínimo para manter-me bem"}
        ]
      },
      {
        "id": 5,
        "question": "Qual meta faz mais sentido hoje?",
        "type": "multiple_choice",
        "options": [
          {"id": "definicao", "label": "Definição corporal e autoestima"},
          {"id": "energia", "label": "Energia estável para viver bem"},
          {"id": "performance", "label": "Performance e métricas (exames, PRs, percentual de gordura)"},
          {"id": "rotina", "label": "Criar rotina leve e saudável"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'descoberta-perfil-bem-estar';

-- 4) Diagnóstico de Parasitose
UPDATE templates_nutrition
SET
  content = '{
    "template_type": "quiz",
    "profession": "nutri",
    "questions": [
      {
        "id": 1,
        "question": "Com que frequência você sente inchaço ou distensão abdominal?",
        "type": "multiple_choice",
        "options": [
          {"id": "raro", "label": "Raramente, quase nunca"},
          {"id": "semanal", "label": "Algumas vezes por semana"},
          {"id": "diario", "label": "Diariamente"},
          {"id": "constante", "label": "É constante e me incomoda bastante"}
        ]
      },
      {
        "id": 2,
        "question": "Você tem histórico de viagem recente, contato com água/solo contaminado ou consumo de alimentos crus?",
        "type": "multiple_choice",
        "options": [
          {"id": "nao", "label": "Não, nenhuma exposição"},
          {"id": "ocasional", "label": "Sim, ocasionalmente"},
          {"id": "recente", "label": "Sim, recentemente"},
          {"id": "frequente", "label": "Sim, faz parte da minha rotina"}
        ]
      },
      {
        "id": 3,
        "question": "Como estão seus hábitos intestinais?",
        "type": "multiple_choice",
        "options": [
          {"id": "regulares", "label": "Regulares, sem alterações"},
          {"id": "oscila", "label": "Oscila entre diarreia e constipação"},
          {"id": "diarreia", "label": "Diarreia frequente"},
          {"id": "constipacao", "label": "Constipação frequente"}
        ]
      },
      {
        "id": 4,
        "question": "Você apresenta sinais como coceira anal, perda de peso ou náusea?",
        "type": "multiple_choice",
        "options": [
          {"id": "nao", "label": "Não apresento"},
          {"id": "leves", "label": "Sinais leves e esporádicos"},
          {"id": "moderados", "label": "Sinais moderados"},
          {"id": "intensos", "label": "Sinais intensos ou persistentes"}
        ]
      },
      {
        "id": 5,
        "question": "Você já teve diagnóstico de parasitose antes?",
        "type": "multiple_choice",
        "options": [
          {"id": "nunca", "label": "Nunca"},
          {"id": "infancia", "label": "Sim, na infância"},
          {"id": "adulto", "label": "Sim, na vida adulta"},
          {"id": "recorrente", "label": "Sim, é recorrente"}
        ]
      },
      {
        "id": 6,
        "question": "Como está seu sistema imunológico atualmente?",
        "type": "multiple_choice",
        "options": [
          {"id": "forte", "label": "Fortalecido, raramente fico doente"},
          {"id": "oscilante", "label": "Oscilante, mas me recupero bem"},
          {"id": "sensivel", "label": "Sensível, fico doente com facilidade"},
          {"id": "comprometido", "label": "Comprometido ou em investigação"}
        ]
      },
      {
        "id": 7,
        "question": "Consome água filtrada/fervida e alimentos bem higienizados?",
        "type": "multiple_choice",
        "options": [
          {"id": "sempre", "label": "Sempre cuido muito"},
          {"id": "quase", "label": "Quase sempre"},
          {"id": "as_vezes", "label": "Às vezes esqueço"},
          {"id": "nao", "label": "Não tenho esse hábito com frequência"}
        ]
      },
      {
        "id": 8,
        "question": "Há animais domésticos ou contato frequente com pets?",
        "type": "multiple_choice",
        "options": [
          {"id": "nao", "label": "Não tenho contato"},
          {"id": "sim_vacinados", "label": "Sim, todos vacinados e vermifugados"},
          {"id": "sim_parcial", "label": "Sim, mas nem sempre seguem protocolo"},
          {"id": "sim_intensivo", "label": "Sim, convivo intensamente com animais"}
        ]
      },
      {
        "id": 9,
        "question": "Você sente mudança de apetite ou náuseas sem causa aparente?",
        "type": "multiple_choice",
        "options": [
          {"id": "nao", "label": "Não"},
          {"id": "leve", "label": "Sim, levemente"},
          {"id": "moderado", "label": "Sim, com frequência moderada"},
          {"id": "intenso", "label": "Sim, intensamente"}
        ]
      },
      {
        "id": 10,
        "question": "Qual prioridade você tem neste momento?",
        "type": "multiple_choice",
        "options": [
          {"id": "prevenir", "label": "Prevenir e monitorar"},
          {"id": "investigar", "label": "Investigar sintomas recentes"},
          {"id": "tratar", "label": "Buscar tratamento direcionado"},
          {"id": "caso_complexo", "label": "Tratar um caso complexo com apoio profissional"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'template-diagnostico-parasitose';

-- 5) Qual é o seu Tipo de Fome?
UPDATE templates_nutrition
SET
  content = '{
    "template_type": "quiz",
    "profession": "nutri",
    "questions": [
      {
        "id": 1,
        "question": "Quando o estresse bate, o que acontece com sua fome?",
        "type": "multiple_choice",
        "options": [
          {"id": "aumenta_muito", "label": "Aumenta muito, quero comer logo"},
          {"id": "oscila", "label": "Oscila, depende do dia"},
          {"id": "diminui", "label": "Diminui, perco a fome"},
          {"id": "rosto", "label": "Como qualquer coisa para aliviar emoções"}
        ]
      },
      {
        "id": 2,
        "question": "Após uma refeição equilibrada, quanto tempo leva para sentir fome real?",
        "type": "multiple_choice",
        "options": [
          {"id": "1h", "label": "Menos de 1 hora"},
          {"id": "2h", "label": "Entre 1 e 2 horas"},
          {"id": "3h", "label": "Entre 2 e 4 horas"},
          {"id": "4h", "label": "Mais de 4 horas"}
        ]
      },
      {
        "id": 3,
        "question": "Você consegue diferenciar fome física de vontade de comer?",
        "type": "multiple_choice",
        "options": [
          {"id": "sim", "label": "Sim, totalmente"},
          {"id": "quase", "label": "Quase sempre"},
          {"id": "pouco", "label": "Tenho dificuldade"},
          {"id": "nao", "label": "Não consigo diferenciar"}
        ]
      },
      {
        "id": 4,
        "question": "Em quais situações a vontade de comer aparece mesmo sem fome?",
        "type": "multiple_choice",
        "options": [
          {"id": "ansiedade", "label": "Quando fico ansiosa"},
          {"id": "festas", "label": "Em momentos sociais/festas"},
          {"id": "rotina", "label": "Durante a rotina, como distração"},
          {"id": "tarde", "label": "Fim de tarde/noite, quando desligo"}
        ]
      },
      {
        "id": 5,
        "question": "Como você se sente depois de comer sem fome física?",
        "type": "multiple_choice",
        "options": [
          {"id": "culpa", "label": "Sinto culpa ou arrependimento"},
          {"id": "inchaço", "label": "Sinto inchaço/desconforto"},
          {"id": "indiferente", "label": "Fico indiferente"},
          {"id": "conforto", "label": "Fico confortável, me acalma"}
        ]
      },
      {
        "id": 6,
        "question": "Qual destes hábitos mais descreve você?",
        "type": "multiple_choice",
        "options": [
          {"id": "planejamento", "label": "Planejo refeições e evito impulsos"},
          {"id": "picos", "label": "Tenho picos de fome e beliscos"},
          {"id": "esqueço", "label": "Esqueço de comer e depois exagero"},
          {"id": "emocional", "label": "Como guiada por emoções"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'quiz-tipo-fome';

-- 6) Seu corpo está pedindo Detox?
UPDATE templates_nutrition
SET
  content = '{
    "template_type": "quiz",
    "profession": "nutri",
    "questions": [
      {
        "id": 1,
        "question": "Como você descreve sua retenção de líquidos ou inchaço?",
        "type": "multiple_choice",
        "options": [
          {"id": "raro", "label": "Raro ou quase inexistente"},
          {"id": "leve", "label": "Leve, aparece em alguns dias"},
          {"id": "frequente", "label": "Frequente, me incomoda"},
          {"id": "constante", "label": "Constante e visível"}
        ]
      },
      {
        "id": 2,
        "question": "Sua digestão/prisão de ventre está...",
        "type": "multiple_choice",
        "options": [
          {"id": "boa", "label": "Boa, regular"},
          {"id": "oscilante", "label": "Oscilante, depende da semana"},
          {"id": "lenta", "label": "Lenta, preciso de ajuda"},
          {"id": "com_sintomas", "label": "Com sintomas intensos (gases, dores, refluxo)"}
        ]
      },
      {
        "id": 3,
        "question": "Como você se alimentou nas últimas semanas?",
        "type": "multiple_choice",
        "options": [
          {"id": "equilibrado", "label": "Equilibrado, com refeições caseiras"},
          {"id": "alguns_excessos", "label": "Alguns excessos isolados"},
          {"id": "muitos_excessos", "label": "Muitos ultraprocessados/alimentos industrializados"},
          {"id": "desregrado", "label": "Desregrado, sem rotina e com muitas saídas"}
        ]
      },
      {
        "id": 4,
        "question": "Qual é sua relação com hidratação?",
        "type": "multiple_choice",
        "options": [
          {"id": "excelente", "label": "Bebo água o dia todo"},
          {"id": "regular", "label": "Poderia beber mais"},
          {"id": "baixa", "label": "Bebo pouco, esqueço"},
          {"id": "quase_nada", "label": "Quase não bebo água"}
        ]
      },
      {
        "id": 5,
        "question": "Como você sente sua energia mental?",
        "type": "multiple_choice",
        "options": [
          {"id": "alta", "label": "Alta e estável"},
          {"id": "oscilante", "label": "Oscilante conforme a rotina"},
          {"id": "fadiga", "label": "Fadiga mental recorrente"},
          {"id": "exaustao", "label": "Exaustão e sensação de intoxicação"}
        ]
      },
      {
        "id": 6,
        "question": "Como você reagiria ao iniciar um protocolo Detox guiado?",
        "type": "multiple_choice",
        "options": [
          {"id": "focada", "label": "Focada, adoro seguir processos"},
          {"id": "ajuste", "label": "Preciso de adaptações à rotina"},
          {"id": "suporte", "label": "Preciso de suporte para não desistir"},
          {"id": "educacional", "label": "Quero entender conceitos antes de começar"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'quiz-pedindo-detox';

-- 7) Qual é seu perfil de intestino?
UPDATE templates_nutrition
SET
  content = '{
    "template_type": "quiz",
    "profession": "nutri",
    "questions": [
      {
        "id": 1,
        "question": "Com que frequência você evacua?",
        "type": "multiple_choice",
        "options": [
          {"id": "diario", "label": "Diariamente, textura saudável"},
          {"id": "alternado", "label": "Dias alternados"},
          {"id": "constipado", "label": "A cada 3 dias ou mais"},
          {"id": "diarreia", "label": "Tenho episódios de diarreia frequentes"}
        ]
      },
      {
        "id": 2,
        "question": "Você sente desconfortos como gases, dores ou distensão?",
        "type": "multiple_choice",
        "options": [
          {"id": "raro", "label": "Raramente"},
          {"id": "leve", "label": "Algumas vezes na semana"},
          {"id": "frequente", "label": "Frequentemente"},
          {"id": "constante", "label": "Constante, impacta meu bem-estar"}
        ]
      },
      {
        "id": 3,
        "question": "Qual é a sua relação com fibras, frutas e verduras?",
        "type": "multiple_choice",
        "options": [
          {"id": "alta", "label": "Consumo em todas as refeições"},
          {"id": "moderada", "label": "Consumo diário, mas poderia aumentar"},
          {"id": "baixa", "label": "Consumo pouco"},
          {"id": "quase_nada", "label": "Quase não consumo"}
        ]
      },
      {
        "id": 4,
        "question": "Você já teve diagnóstico de intolerâncias, alergias ou SII (síndrome do intestino irritável)?",
        "type": "multiple_choice",
        "options": [
          {"id": "nao", "label": "Não"},
          {"id": "suspeita", "label": "Suspeita, mas sem diagnóstico"},
          {"id": "sim_controlado", "label": "Sim, e está controlado"},
          {"id": "sim_ativo", "label": "Sim, ainda em investigação/tratamento"}
        ]
      },
      {
        "id": 5,
        "question": "Como o estresse emocional impacta seu intestino?",
        "type": "multiple_choice",
        "options": [
          {"id": "nao_afeta", "label": "Não noto impacto"},
          {"id": "moderado", "label": "Sinto alterações leves"},
          {"id": "forte", "label": "Sinto alterações fortes"},
          {"id": "desencadeia", "label": "Desencadeia crises e dor abdominal"}
        ]
      },
      {
        "id": 6,
        "question": "Você já usou antibióticos, antiácidos ou laxantes com frequência?",
        "type": "multiple_choice",
        "options": [
          {"id": "nao", "label": "Não, quase nunca"},
          {"id": "ocasional", "label": "Sim, ocasionalmente"},
          {"id": "frequente", "label": "Sim, com frequência"},
          {"id": "recente", "label": "Sim, recentemente ou em altas doses"}
        ]
      },
      {
        "id": 7,
        "question": "Quanto de água você consome por dia?",
        "type": "multiple_choice",
        "options": [
          {"id": "3l", "label": "3L ou mais"},
          {"id": "2l", "label": "2-3L"},
          {"id": "1l", "label": "1-2L"},
          {"id": "menos1", "label": "Menos de 1L"}
        ]
      },
      {
        "id": 8,
        "question": "Como é seu perfil alimentar atual?",
        "type": "multiple_choice",
        "options": [
          {"id": "natural", "label": "Base natural (caseira, mínima industrialização)"},
          {"id": "moderno", "label": "Equilibrado entre caseiro e prático"},
          {"id": "processado", "label": "Muitos industrializados"},
          {"id": "restrito", "label": "Pouca variedade ou dietas restritivas"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'perfil-intestino';

-- 8) Você é mais disciplinado ou emocional com a comida?
UPDATE templates_nutrition
SET
  content = '{
    "template_type": "quiz",
    "profession": "nutri",
    "questions": [
      {
        "id": 1,
        "question": "Quando o dia foge do planejado, como fica sua alimentação?",
        "type": "multiple_choice",
        "options": [
          {"id": "mantenho", "label": "Mantenho o plano com pequenas adaptações"},
          {"id": "meia_boca", "label": "Faço o possível, mas improviso"},
          {"id": "desando", "label": "Desando e deixo para recomeçar depois"},
          {"id": "compenso", "label": "Compenso com restrições ou jejuns"}
        ]
      },
      {
        "id": 2,
        "question": "O que mais dispara vontade de comer fora de hora?",
        "type": "multiple_choice",
        "options": [
          {"id": "fome", "label": "Fome física/horários muito espaçados"},
          {"id": "social", "label": "Situações sociais ou tédio"},
          {"id": "emocao", "label": "Emoções intensas (ansiedade, tristeza, alegria)"},
          {"id": "impulso", "label": "Impulso e falta de planejamento"}
        ]
      },
      {
        "id": 3,
        "question": "Você costuma preparar suas refeições ou lanches com antecedência?",
        "type": "multiple_choice",
        "options": [
          {"id": "sempre", "label": "Sempre, é parte da minha rotina"},
          {"id": "quase", "label": "Na maioria das vezes"},
          {"id": "raramente", "label": "Raramente, faço no dia"},
          {"id": "nunca", "label": "Nunca preparo antecipado"}
        ]
      },
      {
        "id": 4,
        "question": "Como você reage após comer algo que não estava no plano?",
        "type": "multiple_choice",
        "options": [
          {"id": "reviso", "label": "Reviso o restante do dia com calma"},
          {"id": "equilibro", "label": "Busco equilibrar com escolhas melhores"},
          {"id": "culpa", "label": "Sinto culpa e quero desistir"},
          {"id": "ignoro", "label": "Ignoro e continuo comendo impulsivamente"}
        ]
      },
      {
        "id": 5,
        "question": "Você já identifica sinais do corpo (fome, saciedade, emoções)?",
        "type": "multiple_choice",
        "options": [
          {"id": "claro", "label": "Sim, tenho leitura clara"},
          {"id": "parcial", "label": "Às vezes confundo ou ignoro"},
          {"id": "dificil", "label": "Tenho dificuldade para perceber"},
          {"id": "nao", "label": "Ainda não reconheço esses sinais"}
        ]
      },
      {
        "id": 6,
        "question": "Qual frase descreve melhor seu relacionamento com a comida?",
        "type": "multiple_choice",
        "options": [
          {"id": "estrategico", "label": "É estratégico: alimento meu corpo com propósito"},
          {"id": "equilibrado", "label": "Busco equilíbrio entre prazer e nutrição"},
          {"id": "refugio", "label": "Uso comida como refúgio ou recompensa"},
          {"id": "impulsivo", "label": "Como no automático e só percebo depois"}
        ]
      },
      {
        "id": 7,
        "question": "Quando recebe um plano alimentar, o que acontece depois de alguns dias?",
        "type": "multiple_choice",
        "options": [
          {"id": "sigo", "label": "Sigo com facilidade e faço ajustes conscientes"},
          {"id": "adapto", "label": "Adapto conforme a agenda e sigo razoavelmente"},
          {"id": "abandono", "label": "Começo bem mas abandono rapidamente"},
          {"id": "esqueço", "label": "Nem chego a aplicar, fico só na intenção"}
        ]
      },
      {
        "id": 8,
        "question": "Qual é o maior desafio hoje?",
        "type": "multiple_choice",
        "options": [
          {"id": "planejamento", "label": "Planejar e cozinhar"},
          {"id": "emocional", "label": "Controlar emoções e ansiedade"},
          {"id": "rotina", "label": "Manter consistência em semanas agitadas"},
          {"id": "foco", "label": "Evitar efeito sanfona de foco total x descontrole"}
        ]
      },
      {
        "id": 9,
        "question": "Como você vê a ajuda profissional?",
        "type": "multiple_choice",
        "options": [
          {"id": "ajuste_fino", "label": "Quero ajustes finos e performance"},
          {"id": "estrutura", "label": "Preciso de estrutura prática"},
          {"id": "emocional", "label": "Preciso de estratégias comportamentais"},
          {"id": "recomeco", "label": "Preciso recomeçar com suporte próximo"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND (
    slug = 'disciplinado-emocional'
    OR slug LIKE 'disciplinado-emocional-%'
    OR LOWER(name) LIKE LOWER('Você é mais disciplinado ou emocional com a comida%')
  );

-- 9) Você está se alimentando conforme sua rotina?
UPDATE templates_nutrition
SET
  content = '{
    "template_type": "quiz",
    "profession": "nutri",
    "questions": [
      {
        "id": 1,
        "question": "Como estão seus horários principais de refeição?",
        "type": "multiple_choice",
        "options": [
          {"id": "regulares", "label": "Regulares, mesmo nos dias corridos"},
          {"id": "semi_regulares", "label": "Quase regulares, mas às vezes atraso"},
          {"id": "pulo_refeicao", "label": "Pulo refeições com frequência"},
          {"id": "desorganizado", "label": "Totalmente desorganizado"}
        ]
      },
      {
        "id": 2,
        "question": "Você ajusta alimentação conforme suas demandas (treino, trabalho, estudos)?",
        "type": "multiple_choice",
        "options": [
          {"id": "sim", "label": "Sim, personalizo conforme o dia"},
          {"id": "parcial", "label": "Às vezes consigo"},
          {"id": "nao_consigo", "label": "Não consigo, faço sempre igual"},
          {"id": "sem_criterio", "label": "Como o que estiver disponível"}
        ]
      },
      {
        "id": 3,
        "question": "Como você se sente após as refeições?",
        "type": "multiple_choice",
        "options": [
          {"id": "energizada", "label": "Leve e energizada"},
          {"id": "ok", "label": "Ok, mas sinto fome logo"},
          {"id": "sonolenta", "label": "Pesada/sonolenta"},
          {"id": "incomoda", "label": "Desconforto ou inchaço"}
        ]
      },
      {
        "id": 4,
        "question": "Você leva lanches ou opções práticas quando passa muito tempo fora?",
        "type": "multiple_choice",
        "options": [
          {"id": "sempre", "label": "Sempre preparo com antecedência"},
          {"id": "as_vezes", "label": "Levo às vezes, quando lembro"},
          {"id": "raramente", "label": "Raramente, compro algo no caminho"},
          {"id": "nunca", "label": "Nunca, dependo do que encontro"}
        ]
      },
      {
        "id": 5,
        "question": "Quanto a sua rotina influencia suas escolhas alimentares?",
        "type": "multiple_choice",
        "options": [
          {"id": "planejada", "label": "Tenho planejamento baseado na rotina"},
          {"id": "adaptada", "label": "Adapto conforme compromissos"},
          {"id": "reagem", "label": "Reage aos imprevistos sem estratégia"},
          {"id": "improviso", "label": "Tudo é improvisado diariamente"}
        ]
      },
      {
        "id": 6,
        "question": "Qual é seu maior desafio hoje?",
        "type": "multiple_choice",
        "options": [
          {"id": "horarios", "label": "Horários fixos para comer"},
          {"id": "preparo", "label": "Preparar comida ou organizar compras"},
          {"id": "fome", "label": "Controlar fome/vontade entre refeições"},
          {"id": "planejamento", "label": "Manter consistência no fim do dia"}
        ]
      },
      {
        "id": 7,
        "question": "Há quanto tempo sente que sua alimentação não acompanha seu ritmo de vida?",
        "type": "multiple_choice",
        "options": [
          {"id": "recente", "label": "Há pouco tempo"},
          {"id": "meses", "label": "Alguns meses"},
          {"id": "ano", "label": "Cerca de um ano"},
          {"id": "muito_tempo", "label": "Há vários anos"}
        ]
      },
      {
        "id": 8,
        "question": "O que você espera ao buscar ajuda profissional agora?",
        "type": "multiple_choice",
        "options": [
          {"id": "organizar", "label": "Organizar horários e cardápios"},
          {"id": "energia", "label": "Melhorar energia e disposição"},
          {"id": "praticidade", "label": "Receber opções práticas para o dia a dia"},
          {"id": "acompanhar", "label": "Ter acompanhamento frequente para manter foco"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND (
    slug = 'avaliacao-rotina-alimentar'
    OR slug LIKE 'avaliacao-rotina-alimentar-%'
    OR LOWER(name) LIKE LOWER('Você está se alimentando conforme sua rotina%')
  );

COMMIT;


