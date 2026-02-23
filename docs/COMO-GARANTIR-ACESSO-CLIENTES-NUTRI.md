# Como garantir que clientes Nutri tenham acesso após o login

**Padrão:** Todo cliente Nutri com **assinatura ativa** tem acesso a Captar (ferramentas), Trilha (jornada) e Cursos. O código e os dados estão padronizados para isso.

Checklist para que **qualquer cliente** (não admin) consiga acessar Captar, Trilha e Cursos depois de fazer login.

---

## 1. Código em produção (já corrigido)

Certifique-se de que o deploy está com as alterações que permitem acesso:

- **RequireFeature** chama a **API** `GET /api/nutri/feature/check` (não usa mais `feature-helpers` no browser).
- **API** de feature check tem fallback: Nutri com **assinatura ativa** recebe acesso a ferramentas e cursos mesmo se `features` estiver vazio.
- **feature-helpers**: Nutri com assinatura ativa e `features` vazio = tratado como `['ferramentas', 'cursos']`.
- **Webhook** Mercado Pago: sempre grava `features = ['ferramentas', 'cursos']` para Nutri (ou fallback se vier vazio).

Se isso já estiver em produção, o problema costuma ser **só dado no banco**.

---

## 2. O que o cliente precisa no banco

Para a API liberar acesso, o usuário precisa:

| Obrigatório | Onde | Descrição |
|-------------|------|-----------|
| Conta Auth | `auth.users` | E-mail confirmado, senha (ou link mágico). |
| Perfil | `user_profiles` | `user_id`, `perfil = 'nutri'`, `email`. |
| Assinatura ativa | `subscriptions` | `user_id`, `area = 'nutri'`, `status = 'active'`, `current_period_end` **no futuro**. Opcional mas recomendado: `features = ['ferramentas', 'cursos']`. |

Se **não** existir linha em `subscriptions` com `area = 'nutri'`, `status = 'active'` e `current_period_end > agora`, o cliente **não** terá acesso (a API nega). Com o fallback, mesmo que `features` esteja vazio, uma assinatura ativa já libera.

---

## 3. Cliente já pagou mas não tem acesso

Passos sugeridos:

### 3.1. Confirmar e-mail e assinatura

1. No **Supabase** → **Authentication** → **Users**: localize o usuário pelo e-mail e confirme que a conta existe.
2. Em **Table Editor** → **subscriptions**: filtre por `area = nutri` e veja se existe linha com o `user_id` dessa pessoa.
3. Se existir: verifique `status = 'active'` e `current_period_end` maior que a data de hoje. Se `features` estiver vazio, o **código em produção** (fallback) já deve liberar; se ainda bloquear, preencha `features` (próximo passo).
4. Se **não** existir assinatura: ela precisa ser criada (pagamento não criou ou webhook falhou). Use o passo 3.2 ou 3.3.

### 3.2. Só ajustar features (assinatura já existe)

No **SQL Editor** do Supabase, use a mesma lógica do script da Diana, trocando o e-mail:

```sql
DO $$
DECLARE
  v_user_id UUID;
  v_sub_id UUID;
  v_email TEXT := 'email-da-cliente@exemplo.com';  -- alterar
  v_area TEXT := 'nutri';
  v_features JSONB := '["ferramentas", "cursos"]'::jsonb;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(v_email) LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado: %', v_email;
  END IF;

  SELECT id INTO v_sub_id
  FROM subscriptions
  WHERE user_id = v_user_id AND area = v_area AND status = 'active'
  ORDER BY current_period_end DESC NULLS LAST
  LIMIT 1;

  IF v_sub_id IS NULL THEN
    RAISE EXCEPTION 'Nenhuma assinatura ativa para %. Crie uma (ver passo 3.3).', v_email;
  END IF;

  UPDATE subscriptions
  SET features = v_features, updated_at = NOW()
  WHERE id = v_sub_id;

  RAISE NOTICE 'Assinatura atualizada. Cliente pode recarregar a página ou fazer login de novo.';
END $$;
```

Depois peça para a cliente **recarregar a página** ou **sair e entrar de novo**.

### 3.3. Criar assinatura do zero (pagou mas não existe linha)

Se não houver nenhuma linha em `subscriptions` para esse `user_id` e `area = 'nutri'`, insira uma:

```sql
-- Troque o e-mail e, se quiser, o vencimento (ex.: 1 mês à frente).
INSERT INTO subscriptions (
  user_id,
  area,
  plan_type,
  features,
  status,
  current_period_start,
  current_period_end,
  stripe_subscription_id,
  stripe_customer_id,
  stripe_price_id,
  amount,
  currency,
  updated_at
)
SELECT
  u.id,
  'nutri',
  'monthly',
  '["ferramentas", "cursos"]'::jsonb,
  'active',
  NOW(),
  NOW() + INTERVAL '1 month',
  'mp_manual_' || gen_random_uuid()::text,
  'mp_customer',
  'mp_price',
  9700,
  'brl',
  NOW()
FROM auth.users u
WHERE LOWER(u.email) = LOWER('email-da-cliente@exemplo.com')
LIMIT 1;
```

Se der erro de coluna obrigatória (ex.: `ref_vendedor`), preencha no `INSERT` conforme o schema da sua tabela `subscriptions`.

---

## 4. Novos clientes (após pagamento)

- O **webhook** do Mercado Pago cria/atualiza a assinatura e já define `features` (ou fallback) para Nutri.
- Depois do login, a **API** de feature check + fallbacks libera Captar, Trilha e Cursos desde que exista assinatura ativa.
- Se um pagamento não criar assinatura (webhook falhou, etc.), use o passo 3.3 para criar a linha manualmente e, se possível, investigar o webhook.

---

## 5. Padronizar todos os clientes de uma vez (recomendado)

Para atualizar **todas** as assinaturas Nutri ativas que têm `features` vazio ou null e deixar o banco padronizado:

1. No Supabase → **SQL Editor**, execute o script:
   - **`scripts/padronizar-features-nutri-todos.sql`**
2. O script define `features = ['ferramentas', 'cursos']` para toda assinatura ativa Nutri que estiver com features vazio/null.
3. Depois disso, não é necessário rodar script por cliente; o padrão fica único.

O código já garante acesso por fallback (assinatura ativa = libera); o script só deixa o **dado** no banco alinhado ao padrão.

---

## 6. Resumo rápido

1. **Deploy** em produção com RequireFeature via API e fallbacks (Nutri com assinatura ativa = acesso).
2. **Uma vez:** rodar **`scripts/padronizar-features-nutri-todos.sql`** para padronizar todas as assinaturas Nutri no banco.
3. **Por cliente que ainda não entra:** verificar se existe assinatura ativa; se não existir, criar (passo 3.3).
4. Cliente **recarrega a página** ou faz **logout e login** de novo.

Com isso, todos os clientes Nutri com assinatura ativa passam a ter o mesmo acesso (Captar, Trilha, Cursos), de forma padronizada.
