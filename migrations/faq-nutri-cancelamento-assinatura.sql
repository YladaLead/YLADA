-- =====================================================
-- FAQ Nutri — cancelamento / assinatura / Mercado Pago
-- Alimenta o bot em POST /api/nutri/support/chat (relevância >= 3)
-- Execute no Supabase quando quiser ativar (idempotente por pergunta)
-- =====================================================

INSERT INTO faq_responses (
  area,
  pergunta,
  palavras_chave,
  resposta_completa,
  resposta_resumida,
  categoria,
  subcategoria,
  tags,
  ordem_prioridade,
  ativo
)
SELECT
  'nutri',
  'Como cancelar minha assinatura ou parar a cobrança do plano pago?',
  ARRAY[
    'cancelar', 'cancelamento', 'cancela', 'desistir', 'desistência',
    'assinatura', 'assinante', 'recorrência', 'recorrencia',
    'plano', 'pro', 'professional', 'mensalidade', 'mensal',
    'cobrança', 'cobranca', 'renovação', 'renovacao', 'renovar',
    'pagamento', 'cartão', 'cartao', 'mercado', 'pago', 'mercadopago',
    'reembolso', 'devolução', 'devolucao', 'estorno'
  ],
  '📌 CANCELAR ASSINATURA / PARAR A COBRANÇA

Você consegue fazer isso direto na sua conta, sem precisar chamar no WhatsApp.

📝 ONDE CANCELAR (Nutri)
   → Entre em Configuração: /pt/nutri/configuracao
   → Na seção de assinatura / plano, use a opção para cancelar ou gerenciar assinatura
   → O sistema vai pedir um motivo e mostrar orientações (incluindo plano gratuito)

Se você usa a conta na matriz YLADA (área principal), o caminho é Configuração em /pt/configuracao — mesmo tipo de fluxo.

⏱️ O QUE ACONTECE DEPOIS
   → Você mantém acesso ao que já está pago até o fim do período atual
   → Depois disso não há nova cobrança do plano pago
   → Sua conta pode continuar no plano gratuito (com limites), para você seguir usando link, diagnóstico e Noel no que couber no free

💳 MERCADO PAGO
   → Se a assinatura foi feita pelo Mercado Pago, ao confirmar o cancelamento no app a renovação também é interrompida lá (além de atualizarmos no sistema)
   → Dúvidas sobre extrato ou contestação no MP: você pode conferir também no app ou site do Mercado Pago

💡 DICA
   → Se a mensagem automática não bater com o seu caso, use a opção “Falar com atendente humano” aqui no suporte — estamos treinando as respostas para cobrir cada vez mais situações por aqui.',
  'Cancele em Configuração (/pt/nutri/configuracao). Você usa até o fim do período pago; depois não renova. No Mercado Pago a recorrência também para ao confirmar no app. Pode ficar no plano gratuito com limites.',
  'conta',
  'assinatura',
  ARRAY['billing', 'pagamento', 'cancelamento', 'mercado_pago'],
  85,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM faq_responses
  WHERE area = 'nutri'
    AND pergunta = 'Como cancelar minha assinatura ou parar a cobrança do plano pago?'
);

INSERT INTO faq_responses (
  area,
  pergunta,
  palavras_chave,
  resposta_completa,
  resposta_resumida,
  categoria,
  subcategoria,
  tags,
  ordem_prioridade,
  ativo
)
SELECT
  'nutri',
  'Cancelo o plano pago e perco minha conta ou o plano gratuito?',
  ARRAY[
    'gratuito', 'gratis', 'free', 'perder', 'conta', 'sumir', 'excluir',
    'depois', 'cancelar', 'plano', 'acesso', 'mensalidade'
  ],
  '📌 PLANO GRATUITO APÓS CANCELAR A COBRANÇA

Não precisa “sumir” da YLADA.

✅ O QUE MANTÉM
   → Cancelar a cobrança do plano pago não apaga sua conta automaticamente
   → Quando o período já pago acabar, você passa para o plano gratuito, com limites (por exemplo: menos diagnósticos ativos e limites mensais de conversas / uso do Noel, conforme o produto no momento)

✅ O QUE FAZ SENTIDO NA PRÁTICA
   → Muita gente mantém o gratuito para não perder o hábito de divulgar o link e acompanhar respostas
   → Se um dia o plano pago fizer sentido de novo, você pode voltar

Para cancelar só a cobrança, use Configuração → fluxo de assinatura (/pt/nutri/configuracao na área Nutri).',
  'Cancelar o pago não apaga a conta: após o período pago você fica no gratuito com limites.',
  'conta',
  'assinatura',
  ARRAY['gratuito', 'retencao'],
  80,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM faq_responses
  WHERE area = 'nutri'
    AND pergunta = 'Cancelo o plano pago e perco minha conta ou o plano gratuito?'
);
