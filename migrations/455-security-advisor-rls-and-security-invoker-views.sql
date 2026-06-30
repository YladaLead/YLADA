-- Correção dos alertas do Supabase Security Advisor (28/06/2026).
-- Origem: a migration 453 criou 2 tabelas sem ENABLE ROW LEVEL SECURITY,
-- e 7 views ficaram com SECURITY DEFINER (rodam com a permissão do criador,
-- furando o RLS de quem consulta). Ver e-mail rls_disabled_in_public.

-- ── 1. Liga RLS nas 2 tabelas de config (Pró Líderes vídeo compartilhável).
-- Acesso é SEMPRE via service-role (supabaseAdmin), que ignora RLS — por isso
-- não há policy: ligar o RLS apenas bloqueia o acesso público anon/authenticated
-- pela API (PostgREST). O app continua intacto.
ALTER TABLE public.prolider_hom_herbalife_config  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prolider_inicio_rapido_config  ENABLE ROW LEVEL SECURITY;

-- ── 2. Faz as 7 views de analytics respeitarem o RLS de quem consulta.
-- security_invoker = on → a view usa as permissões/RLS do usuário que consulta,
-- não as do criador. Consultas via service-role (painel admin) seguem passando.
ALTER VIEW public.cancel_analytics              SET (security_invoker = on);
ALTER VIEW public.v_intent_answers_by_segment   SET (security_invoker = on);
ALTER VIEW public.v_intent_top_by_segment       SET (security_invoker = on);
ALTER VIEW public.v_intent_trends_monthly       SET (security_invoker = on);
ALTER VIEW public.v_intent_combinations         SET (security_invoker = on);
ALTER VIEW public.v_intent_answer_conversion    SET (security_invoker = on);
ALTER VIEW public.v_intent_top_ranked_detailed  SET (security_invoker = on);
