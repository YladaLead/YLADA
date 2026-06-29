-- 454 — Porta 3 (/[perfil] nu): colunas de apresentação do profissional.
-- Apresentação rica da página de entrada: manchete (headline) + foto (avatar_url).
-- Adição pura e idempotente; nada lê estas colunas com a flag PERFIL_NU_ENABLED OFF.
-- A CURADORIA dos diagnósticos em destaque NÃO usa schema: vive em
-- ylada_links.config_json.meta (perfil_destaque: bool, perfil_ordem: number).
-- @see blueprint-plataforma/Perfil_Nu_Porta3_Build.md
-- @see blueprint-plataforma/Paginas_Entrada_Arquitetura.md §1.1

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS headline text;

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS avatar_url text;

COMMENT ON COLUMN user_profiles.headline IS
  'Manchete curta (chamada) exibida no topo da página de entrada /[perfil] — o que o profissional resolve, em 1 linha.';
COMMENT ON COLUMN user_profiles.avatar_url IS
  'URL pública da foto do profissional exibida na página de entrada /[perfil].';
