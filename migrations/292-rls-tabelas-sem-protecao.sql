-- ============================================
-- MIGRATION 292: RLS em tabelas públicas sem proteção
-- ============================================
-- Corrige alertas do Supabase Security Advisor (rls_disabled_in_public).
-- Tabelas criadas em migrations anteriores sem ALTER ... ENABLE ROW LEVEL SECURITY.
-- O app usa supabaseAdmin (service_role), que ignora RLS; anon/authenticated ficam bloqueados.
-- ============================================

ALTER TABLE IF EXISTS diagnosis_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS noel_strategy_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS noel_conversation_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS noel_market_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS diagnosis_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS link_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ylada_diagnosis_archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ylada_diagnosis_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ylada_diagnosis_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS noel_user_profile_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS noel_conversation_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS quiz_nutri_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS whatsapp_disparo_abort ENABLE ROW LEVEL SECURITY;
