-- Inserir "Guia Completo do Método YLADA" na Biblioteca
-- Este é um PDF interno (página de leitura) que será exibido em /pt/nutri/metodo/biblioteca/guia-metodo-ylada

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
  'PDFs educativos',
  'pdf',
  '/pt/nutri/metodo/biblioteca/guia-metodo-ylada', -- URL interna para página de leitura
  true,
  1 -- Primeiro item da biblioteca
)
ON CONFLICT DO NOTHING;

