-- Inserir os 9 PDFs do Método YLADA na Biblioteca
-- Categorias: Fundamentos do Método, Ferramentas Práticas, Gestão & GSAL, Materiais de Divulgação

-- Primeiro, atualizar a constraint da tabela para aceitar as novas categorias
ALTER TABLE library_files DROP CONSTRAINT IF EXISTS library_files_category_check;
ALTER TABLE library_files ADD CONSTRAINT library_files_category_check CHECK (
  category IN (
    'Scripts de Atendimento',
    'Checklists',
    'Templates',
    'PDFs educativos',
    'Materiais de apoio',
    'Fundamentos do Método',
    'Ferramentas Práticas',
    'Gestão & GSAL',
    'Materiais de Divulgação'
  )
);

-- PDF 1: Guia Completo do Método YLADA
INSERT INTO library_files (
  id,
  title,
  description,
  category,
  file_type,
  file_url,
  is_active,
  order_index
) VALUES (
  gen_random_uuid(),
  'Guia Completo do Método YLADA',
  'O manual prático que toda nutricionista deveria ter recebido, mas nunca recebeu. Este guia contém toda a fundamentação teórica e prática do Método YLADA, organizado de forma didática e aplicável.',
  'Fundamentos do Método',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-1-guia-completo',
  true,
  1
)
ON CONFLICT DO NOTHING;

-- PDF 2: Identidade & Postura Profissional
INSERT INTO library_files (
  id,
  title,
  description,
  category,
  file_type,
  file_url,
  is_active,
  order_index
) VALUES (
  gen_random_uuid(),
  'Identidade & Postura Profissional (Nutri-Empresária)',
  'Fundamentos da transformação profissional: como se posicionar como Nutri-Empresária, desenvolver identidade profissional e postura empresarial.',
  'Fundamentos do Método',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-2-identidade-postura',
  true,
  2
)
ON CONFLICT DO NOTHING;

-- PDF 3: Rotina & Produtividade YLADA
INSERT INTO library_files (
  id,
  title,
  description,
  category,
  file_type,
  file_url,
  is_active,
  order_index
) VALUES (
  gen_random_uuid(),
  'Rotina & Produtividade YLADA',
  'Como organizar sua rotina mínima e maximizar sua produtividade. Guia prático para implementar a Rotina Mínima YLADA no dia a dia.',
  'Fundamentos do Método',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-3-rotina-produtividade',
  true,
  3
)
ON CONFLICT DO NOTHING;

-- PDF 4: Captação Inteligente YLADA
INSERT INTO library_files (
  id,
  title,
  description,
  category,
  file_type,
  file_url,
  is_active,
  order_index
) VALUES (
  gen_random_uuid(),
  'Captação Inteligente YLADA',
  'Estratégias práticas para gerar leads diários e qualificados. Método 10-10-10, CTAs inteligentes e gestão de leads.',
  'Ferramentas Práticas',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-4-captacao-inteligente',
  true,
  4
)
ON CONFLICT DO NOTHING;

-- PDF 5: Fidelização & Experiência da Cliente
INSERT INTO library_files (
  id,
  title,
  description,
  category,
  file_type,
  file_url,
  is_active,
  order_index
) VALUES (
  gen_random_uuid(),
  'Fidelização & Experiência da Cliente',
  'Como criar um atendimento que encanta e fideliza clientes. Scripts, perguntas-poder, pós-atendimento e experiência completa.',
  'Ferramentas Práticas',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-5-fidelizacao-experiencia',
  true,
  5
)
ON CONFLICT DO NOTHING;

-- PDF 6: Gestão & Organização de Clientes (GSAL)
INSERT INTO library_files (
  id,
  title,
  description,
  category,
  file_type,
  file_url,
  is_active,
  order_index
) VALUES (
  gen_random_uuid(),
  'Gestão & Organização de Clientes (GSAL)',
  'Sistema completo de gestão simplificada: Gerar, Servir, Acompanhar, Lucrar. Guia prático do GSAL YLADA.',
  'Gestão & GSAL',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-6-gestao-gsal',
  true,
  6
)
ON CONFLICT DO NOTHING;

-- PDF 7: Ferramentas YLADA – Uso Prático
INSERT INTO library_files (
  id,
  title,
  description,
  category,
  file_type,
  file_url,
  is_active,
  order_index
) VALUES (
  gen_random_uuid(),
  'Ferramentas YLADA – Uso Prático',
  'Guia prático de uso das ferramentas de captação e atendimento. Como criar e usar quizzes, fluxos, templates e calculadoras.',
  'Ferramentas Práticas',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-7-ferramentas-uso-pratico',
  true,
  7
)
ON CONFLICT DO NOTHING;

-- PDF 8: Guia de Divulgação das Ferramentas
INSERT INTO library_files (
  id,
  title,
  description,
  category,
  file_type,
  file_url,
  is_active,
  order_index
) VALUES (
  gen_random_uuid(),
  'Guia de Divulgação das Ferramentas',
  'Estratégias para divulgar suas ferramentas e gerar mais leads. Como criar stories, posts, CTAs e campanhas de divulgação.',
  'Materiais de Divulgação',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-8-guia-divulgacao',
  true,
  8
)
ON CONFLICT DO NOTHING;

-- PDF 9: Manual Técnico das Ferramentas YLADA
INSERT INTO library_files (
  id,
  title,
  description,
  category,
  file_type,
  file_url,
  is_active,
  order_index
) VALUES (
  gen_random_uuid(),
  'Manual Técnico das Ferramentas YLADA',
  'Guia completo e avançado para uso técnico de todas as ferramentas do sistema. Inclui exemplos, boas práticas, modelos de devolutivas e FAQ técnico.',
  'Ferramentas Práticas',
  'pdf',
  '/pt/nutri/metodo/biblioteca/pdf-9-manual-tecnico',
  true,
  9
)
ON CONFLICT DO NOTHING;

