-- Pro Líderes: URL opcional só para fluxo Pix (ex. checkout MP com Pix, página com QR, link externo).
-- Complementa team_bank_payment_url (cartão / assinatura MP). O convidado escolhe após o cadastro.

ALTER TABLE public.leader_tenants
  ADD COLUMN IF NOT EXISTS team_bank_pix_payment_url TEXT;

COMMENT ON COLUMN public.leader_tenants.team_bank_pix_payment_url IS
  'HTTPS (ou HTTP) configurado pelo líder: link de pagamento via Pix para o liderado, após escolha no fluxo de convite.';

COMMENT ON COLUMN public.leader_tenants.team_bank_payment_url IS
  'HTTPS (ou HTTP): link cartão / Mercado Pago (assinatura) ou cobrança genérica; no convite, opção «cartão» quando há também link Pix.';
