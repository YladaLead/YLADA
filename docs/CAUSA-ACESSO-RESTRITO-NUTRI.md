# Por que "Acesso Restrito" apareceu para usuários Nutri (e admin continuou entrando)

## O que mudou que quebrou

As páginas **Captar** (ferramentas), **Trilha** (metodo/jornada) e **Cursos** são protegidas pelo componente **RequireFeature**. Ele roda **no navegador** (é um client component com `'use client'`).

**Antes da correção**, o RequireFeature chamava direto as funções **hasFeatureAccess** e **hasAnyFeature** do arquivo `feature-helpers.ts`. Essas funções usam o **supabaseAdmin** para consultar a tabela `subscriptions` no banco.

O problema: **supabaseAdmin só existe no servidor.** No arquivo `src/lib/supabase.ts` está assim:

```ts
if (typeof window !== 'undefined') {
  return null as unknown as SupabaseClient  // no browser retorna null
}
```

Ou seja, no browser o `supabaseAdmin` é **null** de propósito (segurança: chave de serviço não pode ir para o cliente).

**O que acontecia na prática:**

1. Usuária Nutri abria Captar ou Trilha.
2. RequireFeature rodava **no navegador** e chamava `hasFeatureAccess(user.id, 'nutri', 'ferramentas')`.
3. Dentro de hasFeatureAccess: `supabaseAdmin.from('subscriptions')` → no browser **supabaseAdmin é null** → erro: **"Cannot read properties of null (reading 'from')"**.
4. O catch devolvia `false` → o componente mostrava **"Acesso Restrito"**.

**Por que admin continuava entrando?**

No RequireFeature, **antes** de chamar qualquer verificação de feature, há um bypass:

```ts
if (userProfile?.is_admin || userProfile?.is_support) {
  setHasAccess(true)
  return  // nem chama hasFeatureAccess
}
```

Então admin e suporte **nunca** executavam o código que usa supabaseAdmin no browser. Só usuários normais Nutri executavam → só eles quebravam.

---

## Resumo: o que mudou

- **O que “mudou”:** em algum momento passou a existir verificação de **feature no cliente** (RequireFeature chamando feature-helpers no browser). Esse código **nunca** poderia funcionar para não-admin, porque feature-helpers usa supabaseAdmin, que é null no browser.
- **Caminho certo:** a verificação de feature tem que rodar **no servidor**. Por isso a correção foi: RequireFeature **não** chamar mais feature-helpers no client; em vez disso, chamar a **API** `GET /api/nutri/feature/check`, que roda no servidor (onde supabaseAdmin existe) e devolve `hasAccess: true/false`.

---

## Correções aplicadas

1. **RequireFeature** passou a usar **só a API** `/api/[area]/feature/check` no client (sem importar hasFeatureAccess/hasAnyFeature).
2. **API** de feature check: no servidor, usa feature-helpers e ainda ganhou fallback para Nutri (assinatura ativa = libera ferramentas + cursos).
3. **feature-helpers**: fallback para Nutri com assinatura ativa e `features` vazio = tratar como `['ferramentas', 'cursos']`.
4. **ConditionalWidget**: não chamar API de ferramentas em rotas como `/pt/nutri/metodo/jornada` (evita 404).

Com isso, o caminho fica certo: **cliente** só chama **API**; **servidor** usa supabaseAdmin e regras de features/assinatura para decidir acesso.
