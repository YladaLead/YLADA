-- Tabuladores iniciais para o espaço Pro Líderes do líder midiaseua@icloud.com (idempotente).
-- Se o e-mail no auth for outro (ex.: typo icloudd), ajuste o WHERE abaixo antes de aplicar.

INSERT INTO leader_tenant_tabulators (leader_tenant_id, label, sort_order)
SELECT lt.id, v.label, v.sort_order
FROM leader_tenants lt
INNER JOIN auth.users u ON u.id = lt.owner_user_id
CROSS JOIN (
  VALUES
    (0, 'Aline Souza'),
    (1, 'Cleuza Fonseca'),
    (2, 'Jolene Menegat'),
    (3, 'Jose Henrique Ibanez'),
    (4, 'Liege Campos Moura'),
    (5, 'Sebastiao Joanilson Ribeiro'),
    (6, 'Cleunice Silva'),
    (7, 'Gabriela Oliveira'),
    (8, 'Noemia Puntel de Camargo'),
    (9, 'Sandriomar Oliveira'),
    (10, 'Josana Bezerra'),
    (11, 'Liliane Cancian'),
    (12, 'Fatima Lima'),
    (13, 'Marilene Santos'),
    (14, 'Ana da Silva Valerio'),
    (15, 'Derli Vieira'),
    (16, 'Djair Bezerra Leite'),
    (17, 'Roselaine Gullich Fernandes'),
    (18, 'Jeniffer Rivarola Rocha'),
    (19, 'Kilzia Carvalho'),
    (20, 'Joice Cunegatti'),
    (21, 'Lilian Dippolito'),
    (22, 'Messias Soares de Carvalho'),
    (23, 'Maria da Conceicao Tenorio de Oliveira'),
    (24, 'Nilce Spindola da Silva'),
    (25, 'Donileide Reis'),
    (26, 'Lilian e Alexandre')
) AS v(sort_order, label)
WHERE lower(trim(u.email::text)) IN (
    lower(trim('midiaseua@icloud.com')),
    lower(trim('midiaseua@icloudd.com'))
  )
  AND NOT EXISTS (
    SELECT 1
    FROM leader_tenant_tabulators x
    WHERE x.leader_tenant_id = lt.id
      AND lower(trim(x.label)) = lower(trim(v.label))
  );
