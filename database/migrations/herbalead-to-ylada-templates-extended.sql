-- =====================================================
-- HERBALEAD → YLADA TEMPLATES MIGRATION - EXTENDED
-- Templates de Quiz de Negócio/Empreendedorismo
-- =====================================================

-- =====================================================
-- 5. TEMPLATE: Quiz Ganhos e Prosperidade
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Quiz: Ganhos e Prosperidade',
  'quiz',
  'pt',
  'multi',
  'negocio',
  'capturar-leads',
  'Avalie se seu estilo de vida permite ganhar mais',
  'Descubra como seu estilo de vida impacta sua capacidade de gerar renda e prosperidade.',
  '{
    "questions": [
      {
        "id": 1,
        "question": "Como você vê sua situação financeira atual?",
        "type": "multipla",
        "options": ["Dificuldade para chegar ao final do mês", "Suficiente para sobreviver", "Confortável, mas sem sobrar", "Próspera, consigo investir"]
      },
      {
        "id": 2,
        "question": "Você tem uma fonte de renda adicional além do seu trabalho principal?",
        "type": "multipla",
        "options": ["Não, apenas uma fonte", "Sim, tenho freelas", "Sim, tenho um negócio paralelo", "Sim, tenho investimentos"]
      },
      {
        "id": 3,
        "question": "Quanto tempo por semana você dedica para desenvolvimento pessoal e profissional?",
        "type": "multipla",
        "options": ["Menos de 2 horas", "Entre 2-5 horas", "Entre 5-10 horas", "Mais de 10 horas"]
      },
      {
        "id": 4,
        "question": "Como você enxerga oportunidades de negócio?",
        "type": "multipla",
        "options": ["Difíceis de encontrar", "Raras, mas possíveis", "Frequentes, mas exigem planejamento", "Estão por toda parte"]
      },
      {
        "id": 5,
        "question": "Qual é seu principal obstáculo para aumentar sua renda?",
        "type": "multipla",
        "options": ["Falta de tempo", "Falta de conhecimento", "Falta de capital", "Medo de arriscar"]
      }
    ],
    "scoring": {
      "ranges": [
        {"min": 0, "max": 5, "result": "Baixo Potencial", "recommendations": ["Desenvolver habilidades essenciais", "Buscar mentoria", "Começar pequeno e escalar"]},
        {"min": 6, "max": 10, "result": "Potencial Moderado", "recommendations": ["Ampliar networking", "Diversificar fontes de renda", "Investir em educação"]},
        {"min": 11, "max": 15, "result": "Alto Potencial", "recommendations": ["Escalar negócio atual", "Investir com sabedoria", "Buscar parcerias estratégicas"]}
      ]
    }
  }',
  'Ver meu resultado de prosperidade',
  'Olá! Completei o Quiz de Ganhos e Prosperidade através do YLADA e gostaria de saber mais sobre como posso otimizar meu potencial de renda. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. TEMPLATE: Quiz Potencial e Crescimento
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Quiz: Potencial e Crescimento',
  'quiz',
  'pt',
  'multi',
  'desenvolvimento',
  'capturar-leads',
  'Descubra se seu potencial está sendo bem aproveitado',
  'Avalie seu nível atual de desenvolvimento e identifique oportunidades de crescimento pessoal e profissional.',
  '{
    "questions": [
      {
        "id": 1,
        "question": "Como você avalia seu desempenho atual?",
        "type": "multipla",
        "options": ["Abaixo do meu potencial", "Utilizando parte do potencial", "Bom uso do potencial", "Extraindo o máximo"]
      },
      {
        "id": 2,
        "question": "Com que frequência você estabelece e revisa metas?",
        "type": "multipla",
        "options": ["Raramente", "Anualmente", "Semestralmente", "Mensalmente ou com maior frequência"]
      },
      {
        "id": 3,
        "question": "Como você reage a feedbacks e críticas construtivas?",
        "type": "multipla",
        "options": ["Defensivamente", "Com relutância", "Com abertura", "Como oportunidade de crescimento"]
      },
      {
        "id": 4,
        "question": "Você investe em autoconhecimento e desenvolvimento pessoal?",
        "type": "multipla",
        "options": ["Não, não tenho tempo", "Às vezes", "Regularmente", "Constantemente"]
      },
      {
        "id": 5,
        "question": "Qual sua capacidade de se adaptar a mudanças?",
        "type": "multipla",
        "options": ["Baixa, prefiro estabilidade", "Moderada, preciso de tempo", "Boa, consigo me ajustar", "Alta, abraço mudanças"]
      }
    ],
    "scoring": {
      "ranges": [
        {"min": 0, "max": 5, "result": "Potencial Subutilizado", "recommendations": ["Definir metas claras", "Buscar mentorias", "Criar plano de desenvolvimento"]},
        {"min": 6, "max": 10, "result": "Crescimento Constante", "recommendations": ["Otimizar processos", "Acelerar crescimento", "Expandir competências"]},
        {"min": 11, "max": 15, "result": "Excelência em Desenvolvimento", "recommendations": ["Liderar equipes", "Contribuir com outros", "Ensinar o que aprendeu"]}
      ]
    }
  }',
  'Descobrir meu potencial',
  'Olá! Completei o Quiz de Potencial e Crescimento através do YLADA e gostaria de conversar sobre estratégias de desenvolvimento. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 7. TEMPLATE: Quiz Propósito e Equilíbrio
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Quiz: Propósito e Equilíbrio',
  'quiz',
  'pt',
  'multi',
  'desenvolvimento',
  'capturar-leads',
  'Descubra se seu dia a dia está alinhado com seus sonhos',
  'Avalie o equilíbrio entre sua vida profissional, pessoal e propósito de vida.',
  '{
    "questions": [
      {
        "id": 1,
        "question": "Você sente que tem clareza sobre seu propósito de vida?",
        "type": "multipla",
        "options": ["Não, estou perdido", "Parcialmente, tenho algumas pistas", "Sim, tenho uma direção clara", "Sim, vivo meu propósito diariamente"]
      },
      {
        "id": 2,
        "question": "Como você equilibra trabalho e vida pessoal?",
        "type": "multipla",
        "options": ["Vida pessoal muito prejudicada", "Dificilmente consigo equilibrar", "Consegue manter algum equilíbrio", "Tenho um equilíbrio saudável"]
      },
      {
        "id": 3,
        "question": "Suas atividades diárias contribuem para seus objetivos de longo prazo?",
        "type": "multipla",
        "options": ["Não, sinto que estou parado", "Pouco, às vezes sinto progresso", "Sim, vejo progresso regular", "Sim, avanço consistentemente"]
      },
      {
        "id": 4,
        "question": "Você dedica tempo para atividades que te trazem alegria e realização?",
        "type": "multipla",
        "options": ["Raramente", "De vez em quando", "Regularmente", "Diariamente"]
      },
      {
        "id": 5,
        "question": "Como você se sente em relação ao futuro?",
        "type": "multipla",
        "options": ["Ansioso e preocupado", "Inseguro", "Esperançoso", "Confiante e entusiasmado"]
      }
    ],
    "scoring": {
      "ranges": [
        {"min": 0, "max": 5, "result": "Desalinhamento", "recommendations": ["Refletir sobre valores pessoais", "Definir propósito claro", "Criar plano de vida"]},
        {"min": 6, "max": 10, "result": "Busca de Equilíbrio", "recommendations": ["Reorganizar prioridades", "Estabelecer limites", "Praticar autogerenciamento"]},
        {"min": 11, "max": 15, "result": "Propósito Alinhado", "recommendations": ["Manter foco", "Expander impacto", "Inspirar outros"]}
      ]
    }
  }',
  'Ver meu alinhamento',
  'Olá! Completei o Quiz de Propósito e Equilíbrio através do YLADA e gostaria de conversar sobre como posso viver de forma mais alinhada. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. TEMPLATE: Quiz Diagnóstico de Parasitas
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Quiz: Diagnóstico de Parasitas',
  'quiz',
  'pt',
  'multi',
  'saude',
  'capturar-leads',
  'Descubra se você tem parasitas que estão afetando sua saúde',
  'Avalie sintomas comuns relacionados a parasitas intestinais e obtenha orientações para melhorar sua saúde digestiva.',
  '{
    "questions": [
      {
        "id": 1,
        "question": "Você tem problemas digestivos frequentes?",
        "type": "multipla",
        "options": ["Não", "Às vezes", "Frequentemente", "Constantemente"]
      },
      {
        "id": 2,
        "question": "Como você se sente em relação à sua energia durante o dia?",
        "type": "multipla",
        "options": ["Com muita energia", "Energia moderada", "Sinto cansaço", "Muito cansado"]
      },
      {
        "id": 3,
        "question": "Você sente desconfortos abdominais?",
        "type": "multipla",
        "options": ["Raramente", "Ocasionalmente", "Frequentemente", "Sempre"]
      },
      {
        "id": 4,
        "question": "Sua qualidade de sono é boa?",
        "type": "multipla",
        "options": ["Excelente", "Boa", "Regular", "Ruim"]
      },
      {
        "id": 5,
        "question": "Você consome alimentos crus com frequência?",
        "type": "multipla",
        "options": ["Não", "Raramente", "Às vezes", "Frequentemente"]
      }
    ],
    "scoring": {
      "interpretation": "Avaliação de sintomas que podem indicar necessidade de limpeza intestinal e suporte digestivo",
      "recommendations": ["Consultar especialista em saúde digestiva", "Considerar protocolo de limpeza intestinal", "Melhorar hábitos de higiene alimentar"]
    }
  }',
  'Ver diagnóstico de saúde',
  'Olá! Completei o Quiz de Diagnóstico de Parasitas através do YLADA e gostaria de saber mais sobre protocolos de limpeza intestinal. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
SELECT 
    'Total de templates inseridos:' as info,
    COUNT(*) as total,
    profession,
    type
FROM templates_nutrition
WHERE profession IN ('multi', 'wellness')
GROUP BY profession, type
ORDER BY profession, type;

