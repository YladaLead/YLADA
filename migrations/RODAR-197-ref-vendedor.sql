-- =====================================================
-- Migration 197: coluna ref_vendedor em subscriptions
-- Rode este arquivo no Supabase (SQL Editor) UMA VEZ.
-- Sem ela, o webhook do Mercado Pago falha com PGRST204
-- e o pagamento não é reconhecido.
-- =====================================================

-- Atribuição de venda ao vendedor (ex: paula) ou matriz (ida)
-- null/ausente na URL = venda da matriz (ida); ref=paula na URL = Paula
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS ref_vendedor VARCHAR(100) DEFAULT NULL;

COMMENT ON COLUMN subscriptions.ref_vendedor IS 'Identificador do vendedor que atribuiu a venda (ex: paula). Sem ref na URL = ida (matriz). Preenchido via ref=paula na URL do checkout.';
