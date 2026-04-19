-- Harmoniza léxico pt-PT → pt-BR nos templates da biblioteca YLADA (dados já inseridos pela 326).
-- Seguro de correr várias vezes.

UPDATE pro_lideres_script_templates
SET title = replace(replace(title, 'contacto', 'contato'), 'Contacto', 'Contato')
WHERE title ILIKE '%contacto%';

UPDATE pro_lideres_script_templates
SET usage_hint = replace(replace(COALESCE(usage_hint, ''), 'contacto', 'contato'), 'Contacto', 'Contato')
WHERE usage_hint ILIKE '%contacto%';

UPDATE pro_lideres_script_templates
SET sequence_label = replace(replace(COALESCE(sequence_label, ''), 'contacto', 'contato'), 'Contacto', 'Contato')
WHERE sequence_label ILIKE '%contacto%';

UPDATE pro_lideres_script_templates
SET entries = replace(entries::text, 'Como está correndo por aí?', 'Como tem sido por aí?')::jsonb
WHERE entries::text LIKE '%correndo por aí%';
