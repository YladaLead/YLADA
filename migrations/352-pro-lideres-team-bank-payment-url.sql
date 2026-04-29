-- Pro Líderes: URL de cobrança externa (banco, boleto, PIX copia-e-cola hospedado em página, etc.)
-- definida pelo líder; repassada ao convidado após cadastro/aceite (app).

ALTER TABLE public.leader_tenants
  ADD COLUMN IF NOT EXISTS team_bank_payment_url TEXT;

COMMENT ON COLUMN public.leader_tenants.team_bank_payment_url IS
  'HTTPS (ou HTTP) configurado pelo líder: link de pagamento/cobrança fora do MP YLADA, mostrado à equipe após aceitar convite.';
