# Recuperação de senha automática para todos

Objetivo: **todo mundo conseguir restaurar a senha sozinho, sem precisar chamar no WhatsApp.**

---

## O que já está implementado no código

1. **Uma única API para todas as áreas**  
   Nutri, Wellness e Coach usam a mesma rota: **POST /api/auth/forgot-password** (só enviam o e-mail). A área é definida pelo perfil do usuário no banco.

2. **Busca que funciona para qualquer usuário**  
   - Antes: `listUsers()` retornava só os primeiros 50 → a maioria não recebia e-mail.  
   - Agora: busca por **user_profiles** (e-mail) e depois **getUserById** → qualquer usuário cadastrado é encontrado.

3. **Resiliência a duplicatas**  
   Se houver mais de um perfil com o mesmo e-mail, o código usa `limit(1)` e envia o e-mail mesmo assim.

4. **Páginas de “Recuperar senha”**  
   - `/pt/wellness/recuperar-senha`  
   - `/pt/nutri/recuperar-senha`  
   - `/pt/coach/recuperar-senha`  
   - `/pt/recuperar-senha` (matriz)  
   Todas chamam a mesma API com `{ "email": "..." }`.

---

## Checklist para funcionar para todo mundo (produção)

| Item | Onde verificar | O que conferir |
|------|----------------|----------------|
| **1. Deploy** | Pipeline / hosting | Código atual (forgot-password com user_profiles + getUserById) está em produção. |
| **2. RESEND_API_KEY** | Variáveis de ambiente (produção) | Chave definida e válida. Sem ela o e-mail não é enviado (a API ainda responde “sucesso” por segurança). |
| **3. Domínio do link** | NEXT_PUBLIC_SITE_URL ou NEXT_PUBLIC_APP_URL_PRODUCTION | Deve ser a URL final do site (ex.: `https://www.ylada.com`) para o link no e-mail abrir no lugar certo. |
| **4. Redirect URLs no Supabase** | Supabase → Authentication → URL Configuration | Incluir: `https://www.ylada.com/auth/v1/verify`, `https://www.ylada.com/pt/wellness/reset-password`, `https://www.ylada.com/pt/nutri/reset-password`, `https://www.ylada.com/pt/coach/reset-password`. |
| **5. Perfil com e-mail** | Banco (opcional) | Todo usuário que pode fazer login deve ter um registro em **user_profiles** com a coluna **email** preenchida e igual ao e-mail em **auth.users**. O trigger `handle_new_user` já faz isso para usuários novos; usuários antigos podem precisar de um backfill (ver abaixo). |

---

## Se alguém ainda não receber o e-mail

1. **Logs do servidor**  
   Na hora em que a pessoa clica em “Recuperar senha”, procurar por:  
   - `🔍 Buscando usuário para reset de senha: <email>`  
   - `⚠️ Nenhum perfil encontrado` → usuário sem perfil com esse e-mail.  
   - `❌ Erro ao buscar usuário auth` → user_id do perfil não existe no Auth.  
   - `✅ Email customizado de reset enviado com sucesso` → envio OK (verificar spam/caixa de entrada).

2. **Diagnóstico no banco**  
   Usar o script **`scripts/verificar-recuperacao-senha-sdankfort.sql`** trocando o e-mail pelo da pessoa.  
   - Se **user_profiles** retornar 0 linhas para esse e-mail → criar/ajustar o perfil (user_id do auth.users + email = e-mail da pessoa).

3. **Detalhes**  
   Ver **`docs/PASSO-A-PASSO-RECUPERACAO-SENHA.md`**.

---

## Backfill: garantir perfil com e-mail para quem já está no Auth

Se no seu projeto existirem usuários em **auth.users** sem linha correspondente em **user_profiles** com o mesmo **email**, a recuperação de senha não vai encontrar esses usuários. O trigger `handle_new_user` já cuida dos novos; para os antigos, pode ser necessário rodar um script de backfill **uma vez** no Supabase (SQL Editor), por exemplo:

```sql
-- Criar perfil com email para usuários que existem no Auth mas não têm perfil com email preenchido
INSERT INTO user_profiles (user_id, email, nome_completo, perfil)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
  COALESCE(au.raw_user_meta_data->>'perfil', 'wellness')
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles up 
  WHERE up.user_id = au.id AND up.email IS NOT NULL AND up.email != ''
)
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  nome_completo = COALESCE(user_profiles.nome_completo, EXCLUDED.nome_completo),
  perfil = COALESCE(user_profiles.perfil, EXCLUDED.perfil);
```

(Ajuste o nome da constraint de `user_id` se na sua base for diferente, e rode com cuidado em produção.)

---

## Resumo

- **Código:** recuperação de senha já está centralizada e funciona para qualquer usuário que tenha perfil com e-mail (busca por user_profiles + getUserById, sem limite de 50).
- **Produção:** garantir deploy, RESEND_API_KEY, URL do site e Redirect URLs no Supabase.
- **Banco:** garantir que todo usuário que pode logar tenha em **user_profiles** o **email** preenchido (trigger para novos; backfill opcional para antigos).
- **Casos que ainda falham:** usar logs + script de diagnóstico + passo a passo em `PASSO-A-PASSO-RECUPERACAO-SENHA.md`.

Com isso, todo mundo consegue restaurar a senha de forma automática, sem depender de WhatsApp.
