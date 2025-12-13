-- ============================================
-- CONHECIMENTO NOEL - HOM GRAVADA (Link da Apresentação)
-- Treinamento completo sobre como usar, acompanhar e pedir indicações
-- ============================================
-- Execute este script no Supabase SQL Editor
-- IMPORTANTE: Após inserir, você precisa gerar os embeddings via API

BEGIN;

-- ============================================
-- 1. O QUE É E ONDE PEGAR O LINK DA HOM GRAVADA
-- ============================================
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'O que é o Link da HOM Gravada e onde encontrar',
  'hom-gravada-o-que-e-onde-encontrar',
  'mentor',
  'recrutamento',
  ARRAY['hom', 'hom gravada', 'link', 'apresentação', 'recrutamento', 'onde encontrar', 'meus links'],
  10,
  'O Link da HOM Gravada é sua apresentação de negócio personalizada que você pode compartilhar com qualquer pessoa, a qualquer momento.

**O que é:**
- Uma página exclusiva sua com a apresentação completa de negócio
- Contém vídeo da apresentação (YouTube) e informações sobre a oportunidade
- Cada consultor tem seu próprio link personalizado
- A pessoa assiste no ambiente interno da plataforma

**Onde encontrar seu link:**
1. Acesse "Meus Links" no menu lateral
2. Procure pelo card "Link da HOM gravada"
3. Você verá 3 botões:
   - 👁️ Preview: para ver como fica para quem recebe
   - 📋 Copiar Link: copia a mensagem completa para WhatsApp
   - 📱 Copiar QR: copia o QR code para compartilhar

**Seu link personalizado:**
Seu link segue o formato: https://www.ylada.com/pt/wellness/[seu-user-slug]/hom

**Por que usar:**
- Permite que pessoas assistam no seu tempo
- Ambiente profissional e confiável
- Você pode acompanhar quem assistiu
- Facilita compartilhamento via WhatsApp

**Dica importante:**
Sempre use o botão "Copiar Link" porque ele já copia a mensagem completa formatada para WhatsApp, com texto persuasivo e o link direto.',
  true
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- ============================================
-- 2. COMO EXPLICAR E CONDUZIR O LINK DA HOM GRAVADA
-- ============================================
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Como explicar e conduzir o Link da HOM Gravada para prospects',
  'hom-gravada-como-explicar-conduzir',
  'mentor',
  'recrutamento',
  ARRAY['hom', 'hom gravada', 'explicar', 'conduzir', 'prospect', 'como usar', 'script'],
  10,
  'Como explicar e conduzir o Link da HOM Gravada:

**1. CONTEXTO - Quando usar:**
- Quando a pessoa demonstra interesse em conhecer a oportunidade
- Quando não pode participar do HOM ao vivo
- Quando prefere assistir no próprio tempo
- Como primeira abordagem para apresentar o negócio

**2. COMO APRESENTAR:**

**Script de Apresentação (Leve):**
"Olha, tenho uma oportunidade interessante para compartilhar com você! É sobre o mercado de bebidas funcionais - um mercado que está crescendo muito. Quer conhecer? É só clicar no link que vou te enviar. São apenas alguns minutos e pode mudar sua perspectiva sobre renda e oportunidades!"

**Script de Apresentação (Direto):**
"Tenho uma apresentação de negócio que pode te interessar. É uma forma de trabalhar de casa e ganhar uma renda extra. Quer assistir? Vou te enviar o link."

**3. COMO ENVIAR:**
1. Vá em "Meus Links" → "Link da HOM gravada"
2. Clique em "📋 Copiar Link"
3. Cole no WhatsApp da pessoa
4. Envie a mensagem

**4. O QUE A PESSOA VAI VER:**
- Uma página profissional com o título "Oportunidade: Bebidas Funcionais"
- Vídeo da apresentação (YouTube)
- Dois botões de ação:
  * "💬 Quero tirar dúvida" → abre WhatsApp com você
  * "🚀 Gostei quero começar" → abre WhatsApp com você

**5. ACOMPANHAMENTO IMEDIATO (24-48h):**
Após enviar, aguarde 24-48h e faça follow-up:
"Oi! Conseguiu assistir a apresentação? O que achou?"

**6. OBJEÇÕES COMUNS E RESPOSTAS:**

**"Não assisti ainda"**
"Sem problema! Quando tiver um tempinho, dá uma olhada. São só alguns minutos e pode valer a pena."

**"Não me interessei"**
"Tudo bem! Obrigado por ter assistido. Se mudar de ideia, me avisa. E se conhecer alguém que possa se interessar, me indica?"

**"Preciso pensar"**
"Claro! Pensa à vontade. Se tiver alguma dúvida, pode me chamar."

**7. PRÓXIMOS PASSOS:**
- Se a pessoa clicar em "Gostei quero começar" → ela já está interessada, agende uma conversa
- Se clicar em "Quero tirar dúvida" → responda rapidamente e esclareça
- Se não responder → faça follow-up em 3-5 dias',
  true
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- ============================================
-- 3. COMO FAZER ACOMPANHAMENTO APÓS ENVIAR O LINK
-- ============================================
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Como fazer acompanhamento após enviar Link da HOM Gravada',
  'hom-gravada-acompanhamento',
  'mentor',
  'recrutamento',
  ARRAY['hom', 'hom gravada', 'acompanhamento', 'follow-up', 'verificar', 'assistiu'],
  10,
  'Estratégia completa de acompanhamento após enviar o Link da HOM Gravada:

**CRONOGRAMA DE ACOMPANHAMENTO:**

**1. PRIMEIRO CONTATO (24-48h após enviar):**
**Objetivo:** Verificar se recebeu e se assistiu

**Script:**
"Oi [nome]! Conseguiu assistir a apresentação que te enviei? O que achou?"

**Se não assistiu:**
"Sem problema! Quando tiver um tempinho, dá uma olhada. São só alguns minutos."

**Se assistiu e gostou:**
"Que bom que gostou! Quer que a gente marque uma conversa para você entender melhor como começar?"

**Se assistiu e não gostou:**
"Tudo bem, obrigado por ter assistido! Se mudar de ideia, me avisa. E se conhecer alguém que possa se interessar, me indica?"

**2. SEGUNDO CONTATO (5-7 dias após enviar):**
**Objetivo:** Reaquecer ou pedir indicação

**Se ainda não assistiu:**
"Oi [nome]! Lembra da apresentação que te enviei? Se ainda não assistiu, vale a pena dar uma olhada. São só alguns minutos e pode ser uma oportunidade interessante."

**Se assistiu mas não respondeu:**
"Oi [nome]! Vi que você assistiu a apresentação. O que achou? Alguma dúvida?"

**3. TERCEIRO CONTATO (10-14 dias após enviar):**
**Objetivo:** Fechar ou pedir indicação

**Script de Fechamento:**
"Oi [nome]! Passou um tempinho desde que você assistiu a apresentação. O que você decidiu? Ainda tem interesse ou prefere deixar para depois?"

**Se não tiver interesse:**
"Tudo bem! Obrigado por ter dado uma chance. Se conhecer alguém que possa se interessar, me indica? Isso me ajuda muito!"

**4. VERIFICAÇÃO DE VISUALIZAÇÃO:**

**Como verificar se a pessoa assistiu:**
- Se a pessoa clicou em "Gostei quero começar" ou "Quero tirar dúvida" → ela assistiu
- Se ela te respondeu sobre a apresentação → ela assistiu
- Se não respondeu nada → pode não ter assistido ainda

**5. SINAIS DE INTERESSE:**
- Clicou em "Gostei quero começar" → ALTA PRIORIDADE, responda imediatamente
- Clicou em "Quero tirar dúvida" → INTERESSE MÉDIO, responda em até 2h
- Visualizou mas não clicou → INTERESSE BAIXO, faça follow-up em 24-48h
- Não visualizou → REAQUECER em 3-5 dias

**6. PEDIDO DE INDICAÇÃO (sempre):**
Sempre que a pessoa disser que não tem interesse, peça indicação:

**Script:**
"Tudo bem! Obrigado por ter assistido. Uma coisa: você conhece alguém que possa se interessar por essa oportunidade? Pode ser alguém que está procurando uma renda extra ou querendo trabalhar de casa. Se conhecer, me indica? Isso me ajuda muito!"

**7. REGISTRO E ORGANIZAÇÃO:**
- Registre no sistema quem você enviou o link
- Marque data de envio
- Anote resposta da pessoa
- Acompanhe no sistema de leads/clientes',
  true
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- ============================================
-- 4. COMO VERIFICAR SE A PESSOA ASSISTIU
-- ============================================
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Como verificar se a pessoa assistiu a HOM Gravada',
  'hom-gravada-verificar-assistiu',
  'mentor',
  'recrutamento',
  ARRAY['hom', 'hom gravada', 'verificar', 'assistiu', 'visualizou', 'tracking'],
  9,
  'Como verificar se a pessoa assistiu a HOM Gravada:

**MÉTODOS DE VERIFICAÇÃO:**

**1. AÇÕES NA PÁGINA (Mais Confiável):**
A pessoa assistiu se:
- Clicou no botão "🚀 Gostei quero começar" → ALTA PRIORIDADE
- Clicou no botão "💬 Quero tirar dúvida" → INTERESSE MÉDIO
- Essas ações abrem WhatsApp automaticamente com você

**2. RESPOSTA DIRETA:**
A pessoa assistiu se:
- Te respondeu sobre a apresentação
- Fez perguntas sobre o negócio
- Comentou sobre o vídeo

**3. TEMPO DE RESPOSTA:**
- Se enviou há mais de 48h e não respondeu → provavelmente não assistiu
- Se enviou há menos de 24h → pode estar assistindo ainda

**4. VERIFICAÇÃO ATIVA (Follow-up):**
**Script de Verificação:**
"Oi [nome]! Conseguiu assistir a apresentação que te enviei? O que achou?"

**Respostas possíveis:**
- "Sim, assisti" → pergunte o que achou
- "Ainda não" → incentive a assistir
- "Não me interessei" → peça indicação
- Sem resposta → reaquecer em 3-5 dias

**5. SINAIS INDIRETOS:**
A pessoa pode ter assistido se:
- Começou a te seguir nas redes sociais
- Fez perguntas sobre produtos
- Demonstrou interesse em renda extra
- Pediu mais informações

**6. QUANDO NÃO CONSEGUIR VERIFICAR:**
Se não conseguir confirmar se assistiu:
- Faça follow-up em 3-5 dias
- Pergunte diretamente: "Conseguiu assistir?"
- Se não assistiu, incentive: "Vale a pena dar uma olhada, são só alguns minutos"

**7. REGISTRO NO SISTEMA:**
- Marque no sistema se a pessoa assistiu
- Anote a data de visualização
- Registre a resposta/interesse
- Acompanhe próximos passos

**IMPORTANTE:**
Não seja invasivo. Se a pessoa não respondeu, dê espaço e faça follow-up depois de alguns dias.',
  true
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- ============================================
-- 5. COMO PEDIR INDICAÇÕES APÓS HOM GRAVADA
-- ============================================
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Como pedir indicações após enviar HOM Gravada',
  'hom-gravada-pedir-indicacoes',
  'mentor',
  'recrutamento',
  ARRAY['hom', 'hom gravada', 'indicações', 'pedir indicação', 'recrutamento'],
  10,
  'Como pedir indicações após enviar a HOM Gravada:

**QUANDO PEDIR INDICAÇÃO:**

**1. Quando a pessoa NÃO se interessou:**
**Momento ideal:** Imediatamente após ela dizer que não tem interesse

**Script:**
"Tudo bem! Obrigado por ter assistido e por ter dado uma chance. Uma coisa: você conhece alguém que possa se interessar por essa oportunidade? Pode ser alguém que está procurando uma renda extra, querendo trabalhar de casa, ou buscando uma segunda fonte de renda. Se conhecer, me indica? Isso me ajuda muito!"

**2. Quando a pessoa AINDA NÃO assistiu:**
**Momento ideal:** Após 5-7 dias sem resposta

**Script:**
"Oi [nome]! Se ainda não assistiu, tudo bem. Mas uma coisa: você conhece alguém que possa se interessar? Pode ser alguém que está procurando uma oportunidade de renda extra. Se conhecer, me indica?"

**3. Quando a pessoa GOSTOU mas não começou:**
**Momento ideal:** Após ela demonstrar interesse mas não tomar ação

**Script:**
"Entendo que você precisa pensar. Enquanto isso, você conhece alguém que possa se interessar? Às vezes é mais fácil indicar para outra pessoa primeiro, e depois você decide se quer também."

**COMO PEDIR EFETIVAMENTE:**

**Técnica 1 - Pedido Direto:**
"Você conhece alguém que possa se interessar? Pode ser alguém que está procurando uma renda extra ou querendo trabalhar de casa."

**Técnica 2 - Pedido com Contexto:**
"Essa oportunidade tem funcionado bem para pessoas que estão buscando uma segunda fonte de renda. Você conhece alguém nessa situação?"

**Técnica 3 - Pedido com Benefício:**
"Se você indicar alguém e essa pessoa começar, você também pode se beneficiar. Quer que eu te explique como funciona?"

**Técnica 4 - Pedido Leve:**
"Se conhecer alguém que possa se interessar, me avisa? Isso me ajuda muito!"

**O QUE FAZER QUANDO RECEBER INDICAÇÃO:**

**1. Agradeça imediatamente:**
"Obrigado pela indicação! Vou entrar em contato com [nome]."

**2. Peça permissão:**
"Posso falar que você me indicou? Ou prefere que eu não mencione?"

**3. Entre em contato rapidamente:**
- Contate a pessoa indicada em até 24h
- Use o mesmo link da HOM Gravada
- Mencione quem indicou (se tiver permissão)

**4. Dê feedback:**
"Entrei em contato com [nome indicado]. Obrigado pela indicação!"

**5. Mantenha relacionamento:**
Mesmo que a indicação não funcione, mantenha contato com quem indicou. Pode indicar mais pessoas depois.

**SCRIPTS PARA PEDIR INDICAÇÃO:**

**Script Curto:**
"Você conhece alguém que possa se interessar? Se conhecer, me indica?"

**Script Médio:**
"Tudo bem! Obrigado por ter assistido. Uma coisa: você conhece alguém que está procurando uma renda extra ou querendo trabalhar de casa? Se conhecer, me indica? Isso me ajuda muito!"

**Script Completo:**
"Entendo perfeitamente. Obrigado por ter dado uma chance e assistido a apresentação. Uma coisa que pode me ajudar: você conhece alguém que possa se interessar por essa oportunidade? Pode ser alguém que está procurando uma renda extra, querendo trabalhar de casa, ou buscando uma segunda fonte de renda. Se conhecer, me indica? Isso me ajuda muito e pode ser uma oportunidade interessante para essa pessoa também."

**IMPORTANTE:**
- Sempre peça indicação quando a pessoa não se interessar
- Seja educado e não insista
- Agradeça sempre, mesmo que não receba indicação
- Mantenha relacionamento com quem indicou',
  true
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- ============================================
-- 6. ESTRATÉGIA COMPLETA DE RECRUTAMENTO COM HOM GRAVADA
-- ============================================
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Estratégia completa de recrutamento usando HOM Gravada',
  'hom-gravada-estrategia-recrutamento',
  'mentor',
  'recrutamento',
  ARRAY['hom', 'hom gravada', 'recrutamento', 'estratégia', 'sistema', 'processo'],
  10,
  'Estratégia completa de recrutamento usando a HOM Gravada:

**SISTEMA DE RECRUTAMENTO COM HOM GRAVADA:**

**FASE 1: IDENTIFICAÇÃO DE PROSPECTS**
- Liste pessoas que podem se interessar
- Priorize: pessoas que buscam renda extra, querem trabalhar de casa, estão insatisfeitas com trabalho atual
- Registre no sistema de leads

**FASE 2: APRESENTAÇÃO (HOM GRAVADA)**
- Envie o link da HOM Gravada via WhatsApp
- Use o botão "Copiar Link" em "Meus Links"
- A mensagem já vem formatada com texto persuasivo
- Envie para 5-10 pessoas por dia (meta mínima)

**FASE 3: ACOMPANHAMENTO (24-48h)**
- Verifique se a pessoa assistiu
- Responda rapidamente se ela clicou em "Gostei quero começar"
- Faça follow-up se não respondeu

**FASE 4: QUALIFICAÇÃO**
- Se interessou → agende conversa para explicar como começar
- Se não interessou → peça indicação
- Se ainda não assistiu → reaquecer em 3-5 dias

**FASE 5: FECHAMENTO OU INDICAÇÃO**
- Se fechou → parabéns! Agora é onboarding
- Se não fechou → peça indicação
- Se indicou → entre em contato com a indicação

**META SEMANAL SUGERIDA:**
- 35-50 envios de link da HOM Gravada por semana
- 5-10 conversas de follow-up por semana
- 2-5 pedidos de indicação por semana
- 1-3 novos recrutados por semana

**ROTINA DIÁRIA:**
1. Manhã: Enviar 5-10 links da HOM Gravada
2. Tarde: Fazer follow-up de links enviados há 24-48h
3. Noite: Responder pessoas que clicaram nos botões

**FERRAMENTAS NECESSÁRIAS:**
- Link da HOM Gravada (em "Meus Links")
- Sistema de registro de leads
- WhatsApp para comunicação
- Calendário para agendar conversas

**MÉTRICAS PARA ACOMPANHAR:**
- Quantos links enviou esta semana
- Quantas pessoas assistiram
- Quantas pessoas se interessaram
- Quantas indicações recebeu
- Quantos novos recrutados

**DICAS DE SUCESSO:**
- Seja consistente: envie links todos os dias
- Não desista: nem todos vão se interessar
- Peça indicação sempre: cada "não" é uma oportunidade de indicação
- Responda rápido: quem clica em "Gostei" está quente
- Mantenha registro: anote tudo no sistema

**OBJEÇÕES COMUNS:**
- "Não tenho tempo" → "São só alguns minutos, vale a pena"
- "Não me interesso" → "Tudo bem, conhece alguém que possa se interessar?"
- "Preciso pensar" → "Claro, enquanto isso, conhece alguém que possa se interessar?"
- "Já tenho trabalho" → "Entendo, mas pode ser uma renda extra"

**IMPORTANTE:**
A HOM Gravada é sua ferramenta principal de recrutamento. Use todos os dias. Quanto mais pessoas você apresentar, mais chances de recrutar.',
  true
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

COMMIT;

-- ============================================
-- NOTA: Após executar este script, você precisa gerar os embeddings
-- Execute via API: POST /api/admin/wellness/knowledge/generate-embeddings
-- Ou use o script: scripts/gerar-embeddings-lousas.ts
-- ============================================









