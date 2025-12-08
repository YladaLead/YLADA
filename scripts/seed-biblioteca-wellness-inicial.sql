-- ============================================
-- SEED INICIAL: Biblioteca Wellness System
-- Materiais, scripts e fluxos básicos
-- ============================================

-- Inserir alguns scripts oficiais iniciais
INSERT INTO wellness_scripts (codigo, titulo, descricao, categoria, texto, tags, ativo) VALUES
(
  'script-convite-leve-1',
  'Convite Leve - Produto',
  'Script para convidar alguém a conhecer produtos de forma leve',
  'convite',
  'Oi [Nome]! 👋

Lembrei de você hoje porque estou testando algo novo de bem-estar que pode te interessar.

É sobre bebidas funcionais que ajudam no dia a dia. Quer que eu te mostre rapidinho? 😊',
  ARRAY['convite', 'produto', 'leve'],
  true
),
(
  'script-convite-leve-2',
  'Convite Leve - Oportunidade',
  'Script para convidar alguém a conhecer a oportunidade de forma leve',
  'convite',
  'Oi [Nome]! 👋

Lembrei de você porque estou trabalhando com algo relacionado a bem-estar e acho que pode te interessar.

É uma forma de trabalhar com produtos que eu mesmo uso. Quer que eu te conte rapidinho? 😊',
  ARRAY['convite', 'oportunidade', 'leve'],
  true
),
(
  'script-follow-up-1',
  'Follow-up Leve',
  'Script para fazer follow-up de forma respeitosa',
  'follow-up',
  'Oi [Nome]! 😊

Tudo bem? Lembrei da nossa conversa e queria saber se você ainda tem interesse em saber mais sobre [produto/oportunidade].

Se não for o momento, sem problemas! Mas se quiser, posso te mostrar rapidinho. 💚',
  ARRAY['follow-up', 'respeitoso'],
  true
),
(
  'script-objecao-dinheiro',
  'Objeção: Falta de Dinheiro',
  'Resposta para quando a pessoa diz que não tem dinheiro',
  'objecao',
  'Entendo perfeitamente! 💚

A boa notícia é que você pode começar com um kit bem acessível, e os produtos duram bastante. 

Além disso, quando você indica para outras pessoas, você ganha comissão, então o investimento se paga rápido.

Quer que eu te mostre as opções de kit? Tem desde R$ 39,90.',
  ARRAY['objeção', 'dinheiro', 'investimento'],
  true
),
(
  'script-objecao-tempo',
  'Objeção: Falta de Tempo',
  'Resposta para quando a pessoa diz que não tem tempo',
  'objecao',
  'Entendo! Tempo é precioso mesmo! 😊

A boa notícia é que você não precisa de muito tempo. Com 15-30 minutos por dia já dá pra começar.

E você pode fazer no seu ritmo, quando conseguir. Não precisa virar sua vida de cabeça pra baixo.

Quer que eu te mostre como funciona na prática?',
  ARRAY['objeção', 'tempo', 'rotina'],
  true
)
ON CONFLICT (codigo) DO NOTHING;

-- Inserir alguns materiais iniciais (exemplos - URLs serão atualizadas depois)
INSERT INTO wellness_materiais (codigo, titulo, descricao, tipo, categoria, url, tags, ativo) VALUES
(
  'material-hom-curta',
  'HOM Curta (2-5 minutos)',
  'Apresentação curta da oportunidade Herbalife',
  'video',
  'apresentacao',
  'https://example.com/hom-curta',
  ARRAY['hom', 'apresentação', 'oportunidade'],
  true
),
(
  'material-hom-longa',
  'HOM Longa (15-20 minutos)',
  'Apresentação completa da oportunidade Herbalife',
  'video',
  'apresentacao',
  'https://example.com/hom-longa',
  ARRAY['hom', 'apresentação', 'completa'],
  true
),
(
  'material-cartilha-novo',
  'Cartilha do Novo Distribuidor',
  'Guia completo para novos distribuidores',
  'pdf',
  'cartilha',
  'https://example.com/cartilha-novo-distribuidor.pdf',
  ARRAY['cartilha', 'treinamento', 'novo'],
  true
)
ON CONFLICT (codigo) DO NOTHING;

-- Nota: Os fluxos já estão implementados nas páginas, mas podem ser migrados para o banco depois
-- Por enquanto, os fluxos funcionam como páginas estáticas
