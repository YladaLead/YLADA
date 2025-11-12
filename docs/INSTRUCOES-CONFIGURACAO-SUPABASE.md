# 🚀 Instruções Rápidas - Configuração Supabase

## 📝 O que você precisa fazer:

### 1️⃣ **Executar Script SQL** (5 minutos)

1. Abra o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Abra o arquivo: `scripts/configuracao-supabase-completa.sql`
4. Copie e cole todo o conteúdo
5. Clique em **RUN** (ou F5)

✅ Isso vai criar/verificar:
- Tabela `access_tokens` (para tokens temporários)
- Tabela `templates_nutrition` (se não existir)
- Coluna `conversions_count` em `user_templates` (se não existir)
- Políticas RLS necessárias

---

### 2️⃣ **Configurar URLs de Autenticação** (2 minutos)

No **Supabase Dashboard**:

1. Vá em **Authentication** → **URL Configuration**

2. **Site URL:**
   ```
   https://www.ylada.com
   ```

3. **Redirect URLs** (adicione uma por uma):
   ```
   https://www.ylada.com/auth/callback
   https://www.ylada.com/auth/v1/verify
   https://www.ylada.com/pt/wellness/dashboard
   https://www.ylada.com/pt/wellness/bem-vindo
   https://www.ylada.com/pt/nutri/dashboard
   https://www.ylada.com/pt/coach/dashboard
   https://www.ylada.com/pt/nutra/dashboard
   https://www.ylada.com/migrado
   ```

4. **⚠️ IMPORTANTE:** 
   - Remova `http://localhost:3000` das URLs permitidas (ou deixe apenas para desenvolvimento)
   - Clique em **Save**

---

### 3️⃣ **Verificar Variáveis de Ambiente no Vercel** (1 minuto)

No **Vercel Dashboard** → Seu Projeto → **Settings** → **Environment Variables**:

Certifique-se de ter:
```
NEXT_PUBLIC_APP_URL_PRODUCTION=https://www.ylada.com
```

Se não tiver, adicione e faça um novo deploy.

---

## ✅ Pronto!

Depois disso, tudo deve funcionar:
- ✅ Usuários migrados não serão redirecionados para localhost
- ✅ Analytics vai coletar dados corretamente
- ✅ Templates vão funcionar com estatísticas
- ✅ Tokens de acesso vão funcionar

---

## 🔍 Como Verificar se Está Funcionando

Execute no **Supabase SQL Editor**:

```sql
-- Verificar tabelas
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('access_tokens', 'templates_nutrition', 'user_templates')
ORDER BY tablename;

-- Verificar coluna conversions_count
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_templates' 
  AND column_name = 'conversions_count';
```

Se retornar resultados, está tudo certo! ✅

