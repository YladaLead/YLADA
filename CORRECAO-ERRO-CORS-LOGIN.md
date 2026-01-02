# 🔧 Correção: Erro CORS no Login

## ❌ Problema

**Erro no console:**
```
Access to fetch at 'https://fubynpjagxxqbyfj...' from origin 'https://www.ylada.com' 
has been blocked by CORS policy: Response to preflight request doesn't pass 
access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Causa:**
- O Supabase não está permitindo requisições de `https://www.ylada.com`
- A URL não está configurada nas URLs permitidas do Supabase

---

## ✅ Solução: Configurar URLs no Supabase

### Passo 1: Acessar Configurações do Supabase

1. Acesse: **Supabase Dashboard** → Seu Projeto
2. Vá em: **Authentication** → **URL Configuration**

### Passo 2: Configurar Site URL

**Site URL:**
```
https://www.ylada.com
```

### Passo 3: Adicionar Redirect URLs

Adicione **TODAS** estas URLs (uma por uma, clicando em "Add URL"):

```
https://www.ylada.com
https://www.ylada.com/auth/callback
https://www.ylada.com/auth/v1/verify
https://www.ylada.com/pt/nutri/login
https://www.ylada.com/pt/nutri/home
https://www.ylada.com/pt/nutri/dashboard
https://www.ylada.com/pt/wellness/login
https://www.ylada.com/pt/wellness/dashboard
https://www.ylada.com/pt/coach/login
https://www.ylada.com/pt/coach/dashboard
https://www.ylada.com/pt/nutra/login
https://www.ylada.com/pt/nutra/dashboard
```

### Passo 4: Salvar

Clique em **"Save"** ou **"Update"**

---

## 🔍 Verificação Adicional

### Verificar Variáveis de Ambiente

Certifique-se de que no **Vercel** (ou `.env.local`) está configurado:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fubynpjagxxqbyfjsile.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

**⚠️ IMPORTANTE:**
- Use a URL **completa** do Supabase (com `https://`)
- Não use `localhost` em produção

---

## 🧪 Testar Após Configuração

1. **Limpar cache do navegador:**
   - Chrome: `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
   - Ou usar modo anônimo

2. **Tentar login novamente:**
   - Acesse: `https://www.ylada.com/pt/nutri/login`
   - Preencha email e senha
   - Clique em "Entrar"

3. **Verificar console:**
   - Não deve aparecer mais erro de CORS
   - Login deve funcionar normalmente

---

## 📝 Notas

- **CORS é uma política de segurança** do navegador
- O Supabase precisa **explicitamente permitir** a origem `https://www.ylada.com`
- Se ainda não funcionar após configurar, pode levar alguns minutos para propagar
- Em desenvolvimento local (`localhost:3000`), pode precisar adicionar também

---

## 🆘 Se Ainda Não Funcionar

1. **Verificar se a URL do Supabase está correta:**
   - Deve começar com `https://`
   - Deve ser a URL completa do projeto

2. **Verificar se não há bloqueio de firewall/proxy**

3. **Tentar em outro navegador** para descartar problema específico

4. **Verificar logs do Supabase:**
   - Supabase Dashboard → Logs → Auth Logs
   - Ver se há tentativas de login sendo registradas










