# Passo a passo: quando alguém não recebe o e-mail de recuperação de senha

## Fluxo da recuperação de senha

1. Usuário acessa **Recuperar senha** (Wellness, Nutri ou Coach) e informa o e-mail.
2. Front chama **POST /api/auth/forgot-password** com `{ "email": "..." }`.
3. Backend:
   - Busca **user_profiles** por e-mail (coluna `email`, case-insensitive).
   - Se encontrar perfil, busca o usuário em **auth.users** por `user_id` (`getUserById`).
   - Gera link de recovery com Supabase e envia e-mail customizado via Resend.

Se o e-mail **não** for enviado, a causa está em um destes pontos: perfil ausente, auth ausente ou envio (Resend).

---

## Verificação para um e-mail específico (ex.: sdankfort@gmail.com)

### 1. Rodar o script de diagnóstico no Supabase

No **Supabase → SQL Editor**, execute o script:

**`scripts/verificar-recuperacao-senha-sdankfort.sql`**

(Substitua `sdankfort@gmail.com` no script se for outro usuário.)

### 2. Interpretar o resultado

| Situação | O que fazer |
|----------|-------------|
| **1. auth.users** retorna 0 linhas | O e-mail não está cadastrado no Auth. Usuário pode ter se cadastrado com outro e-mail ou o cadastro não foi concluído. Verificar no Supabase Auth → Users. |
| **2. user_profiles** retorna 0 linhas | O usuário existe no Auth mas não tem perfil com esse e-mail. **Criar/atualizar** um registro em `user_profiles` com `user_id` = id do auth.users e `email` = e-mail informado (e `perfil` = 'wellness' ou 'nutri' ou 'coach'). |
| **3. user_id diferente** | O `user_id` do perfil não bate com `auth.users`. Corrigir o perfil para usar o `user_id` correto do Auth. |
| **4. Duplicatas** | Se houver vários perfis com o mesmo e-mail, o código atual usa `limit(1)` e envia para um deles. Se ainda assim não funcionar, considerar limpar duplicatas (ver `fix-duplicatas-user-profiles.sql`). |
| **5. resumo**: em_auth >= 1 e em_user_profiles >= 1 | Dados OK para a rota. Se o e-mail ainda não chega, verificar: Resend (RESEND_API_KEY), caixa de spam e logs do servidor no momento do request. |

### 3. Conferir variáveis de ambiente

- **RESEND_API_KEY** definida (envio de e-mail).
- **NEXT_PUBLIC_SITE_URL** ou **NEXT_PUBLIC_APP_URL_PRODUCTION** corretos (link no e-mail).

### 4. Logs no servidor

Ao solicitar recuperação de senha, no console do servidor devem aparecer mensagens como:

- `🔍 Buscando usuário para reset de senha: sdankfort@gmail.com`
- `✅ Link de reset gerado com sucesso`
- `✅ Email customizado de reset enviado com sucesso via Resend para: sdankfort@gmail.com`

Se aparecer **"Nenhum perfil encontrado"** ou **"Email do auth não confere"**, o problema é perfil/auth (passos 1 e 2 acima).

---

## Resumo

- A rota **só envia** e-mail se existir **um perfil em user_profiles** com esse e-mail e um **usuário em auth.users** com o mesmo `user_id` e mesmo e-mail.
- Script de diagnóstico: **`scripts/verificar-recuperacao-senha-sdankfort.sql`** (trocar o e-mail no script para outro usuário).
- Duplicatas em `user_profiles` para o mesmo e-mail: o código usa `limit(1)` e continua enviando; se quiser limpar, use os scripts de fix de duplicatas.
