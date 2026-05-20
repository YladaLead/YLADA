-- Remove "socrático/socrática" e travessão (—) de scripts Pro Líderes (copy mais humana no WhatsApp).

-- prolider_scripts (Y-Scripts / ferramentas)
UPDATE prolider_scripts
SET
  title = trim(
    regexp_replace(
      regexp_replace(
        regexp_replace(coalesce(title, ''), 'socrátic[oa]s?\s*', ' ', 'gi'),
        '\s*—\s*',
        ', ',
        'g'
      ),
      '\s+',
      ' ',
      'g'
    )
  ),
  content = trim(
    regexp_replace(
      regexp_replace(
        regexp_replace(content, 'socrátic[oa]s?\s*', ' ', 'gi'),
        '\s*—\s*',
        ', ',
        'g'
      ),
      '\s+',
      ' ',
      'g'
    )
  ),
  updated_at = now()
WHERE
  title ~* 'socrátic'
  OR content ~* 'socrátic'
  OR title LIKE '%—%'
  OR content LIKE '%—%';

-- Biblioteca Noel por tenant (grupos)
UPDATE leader_tenant_pl_script_sections
SET
  title = trim(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, 'socrátic[oa]s?\s*', ' ', 'gi'),
        '\s*—\s*',
        ', ',
        'g'
      ),
      '\s+',
      ' ',
      'g'
    )
  ),
  subtitle = CASE
    WHEN subtitle IS NULL THEN NULL
    ELSE trim(
      regexp_replace(
        regexp_replace(
          regexp_replace(subtitle, 'socrátic[oa]s?\s*', ' ', 'gi'),
          '\s*—\s*',
          ', ',
          'g'
        ),
        '\s+',
        ' ',
        'g'
      )
    )
  END,
  updated_at = now()
WHERE
  title ~* 'socrátic'
  OR coalesce(subtitle, '') ~* 'socrátic'
  OR title LIKE '%—%'
  OR coalesce(subtitle, '') LIKE '%—%';

UPDATE leader_tenant_pl_script_entries
SET
  title = trim(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, 'socrátic[oa]s?\s*', ' ', 'gi'),
        '\s*—\s*',
        ', ',
        'g'
      ),
      '\s+',
      ' ',
      'g'
    )
  ),
  subtitle = CASE
    WHEN subtitle IS NULL THEN NULL
    ELSE trim(
      regexp_replace(
        regexp_replace(
          regexp_replace(subtitle, 'socrátic[oa]s?\s*', ' ', 'gi'),
          '\s*—\s*',
          ', ',
          'g'
        ),
        '\s+',
        ' ',
        'g'
      )
    )
  END,
  body = trim(
    regexp_replace(
      regexp_replace(
        regexp_replace(body, 'socrátic[oa]s?\s*', ' ', 'gi'),
        '\s*—\s*',
        ', ',
        'g'
      ),
      '\s+',
      ' ',
      'g'
    )
  ),
  how_to_use = CASE
    WHEN how_to_use IS NULL THEN NULL
    ELSE trim(
      regexp_replace(
        regexp_replace(
          regexp_replace(how_to_use, 'socrátic[oa]s?\s*', ' ', 'gi'),
          '\s*—\s*',
          ', ',
          'g'
        ),
        '\s+',
        ' ',
        'g'
      )
    )
  END,
  updated_at = now()
WHERE
  title ~* 'socrátic'
  OR coalesce(subtitle, '') ~* 'socrátic'
  OR body ~* 'socrátic'
  OR coalesce(how_to_use, '') ~* 'socrátic'
  OR title LIKE '%—%'
  OR coalesce(subtitle, '') LIKE '%—%'
  OR body LIKE '%—%'
  OR coalesce(how_to_use, '') LIKE '%—%';
