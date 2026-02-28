-- =====================================================
-- Template diagnostico: conteúdo para o VISITANTE/PACIENTE
-- (quem acessa o link), não para o médico/gerencial.
-- Projeto inicial: link atrai e qualifica possíveis pacientes;
-- perguntas sobre como a pessoa se sente, frequência, próximo passo.
-- Título alinhado à vitrine "Raio-X de Saúde".
-- =====================================================

UPDATE ylada_link_templates
SET
  schema_json = '{
    "title": "Raio-X de Saúde",
    "questions": [
      { "id": "q1", "text": "Nos últimos tempos, como você tem se sentido em relação a isso?", "type": "single", "options": ["Quero me cuidar mais", "Já estou buscando informações", "Às vezes penso nisso", "Ainda não parei para pensar"] },
      { "id": "q2", "text": "Com que frequência isso aparece na sua rotina?", "type": "single", "options": ["Todo dia", "Algumas vezes por semana", "Raramente", "Quase nunca"] },
      { "id": "q3", "text": "O que mais importa para você hoje?", "type": "single", "options": ["Entender melhor", "Saber por onde começar", "Falar com alguém que entende", "Só quero me informar"] }
    ],
    "results": [
      { "id": "r1", "label": "Vale a pena conversar", "minScore": 0, "headline": "Você está no momento certo", "description": "Suas respostas mostram que vale a pena dar o próximo passo. Que tal falar com um profissional que pode te orientar?" },
      { "id": "r2", "label": "Próximo passo", "minScore": 3, "headline": "Você já está pensando nisso", "description": "Você já está considerando isso na sua rotina. Um diálogo pode ajudar a clarear os próximos passos." },
      { "id": "r3", "label": "Boa hora para começar", "minScore": 6, "headline": "Um bom momento para se informar", "description": "Se quiser saber mais ou tirar dúvidas, use o botão abaixo para iniciar uma conversa." }
    ],
    "ctaDefault": "Quero falar no WhatsApp",
    "resultIntro": "Seu resultado:"
  }'::jsonb,
  updated_at = NOW()
WHERE id = 'a0000001-0001-4000-8000-000000000001';
