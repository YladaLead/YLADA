# 🧪 PLANO DE TESTES - SEGURANÇA YLADA

**Data:** Dezembro 2024  
**Status:** RLS Implementado ✅

---

## ✅ **TESTES CRÍTICOS A REALIZAR**

### 1️⃣ **Teste de Autenticação e Perfis**

#### Teste 1.1: Login por Perfil
- [ ] Criar conta como `nutri`
- [ ] Verificar redirecionamento para `/pt/nutri/dashboard`
- [ ] Tentar acessar `/pt/wellness/dashboard` → Deve redirecionar para login
- [ ] Repetir para `wellness`, `coach`, `nutra`

#### Teste 1.2: Área Admin
- [ ] Criar usuário com `is_admin = true`
- [ ] Verificar acesso a `/admin`
- [ ] Verificar se admin pode acessar todos os perfis
- [ ] Verificar se usuário comum não acessa `/admin`

---

### 2️⃣ **Teste de Isolamento de Dados (RLS)**

#### Teste 2.1: user_templates
**Como usuário Nutri:**
```sql
-- No Supabase SQL Editor (como usuário nutri)
SELECT * FROM user_templates;
-- Deve retornar APENAS templates do usuário logado
```

**Como usuário Wellness:**
```sql
-- No Supabase SQL Editor (como usuário wellness)
SELECT * FROM user_templates;
-- Deve retornar APENAS templates do usuário wellness logado
```

#### Teste 2.2: leads
**Como usuário Nutri:**
```sql
SELECT * FROM leads;
-- Deve retornar APENAS leads do usuário nutri
```

**Como usuário Wellness:**
```sql
SELECT * FROM leads;
-- Deve retornar APENAS leads do usuário wellness
```

#### Teste 2.3: Admin vê tudo
**Como admin:**
```sql
SELECT * FROM user_templates;
SELECT * FROM leads;
-- Admin deve ver todos os dados
```

---

### 3️⃣ **Teste de APIs Protegidas**

#### Teste 3.1: `/api/wellness/ferramentas`
**GET sem autenticação:**
```bash
curl http://localhost:3000/api/wellness/ferramentas
# Deve retornar 401 Unauthorized
```

**GET com autenticação (wellness):**
```bash
# Com cookie de sessão
curl -X GET http://localhost:3000/api/wellness/ferramentas \
  --cookie "sb-...=..." \
  -H "Cookie: sb-...=..."
# Deve retornar ferramentas do usuário wellness
```

**POST tentando usar user_id de outro:**
```bash
# Tentar criar ferramenta com user_id diferente
curl -X POST http://localhost:3000/api/wellness/ferramentas \
  -H "Content-Type: application/json" \
  -d '{"user_id": "outro-user-id", "slug": "teste", ...}'
# Deve IGNORAR user_id do body e usar do token
```

#### Teste 3.2: `/api/leads`
**GET sem autenticação:**
```bash
curl http://localhost:3000/api/leads
# Deve retornar 401 Unauthorized
```

**GET com autenticação:**
```bash
curl http://localhost:3000/api/leads \
  --cookie "sb-...=..."
# Deve retornar APENAS leads do usuário autenticado
```

**POST público (coleta de lead):**
```bash
# Criar um link primeiro, depois:
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "meu-link-teste",
    "name": "João Silva",
    "email": "joao@teste.com",
    "phone": "11999999999"
  }'
# Deve funcionar (público) e associar ao dono do link
```

---

### 4️⃣ **Teste de Coleta de Leads**

#### Teste 4.1: Criar link e coletar lead
1. [ ] Fazer login como `wellness`
2. [ ] Criar uma ferramenta/link
3. [ ] Acessar link público (sem login)
4. [ ] Preencher formulário de lead
5. [ ] Verificar se lead foi salvo
6. [ ] Fazer GET `/api/leads` (autenticado)
7. [ ] Verificar se lead aparece na lista

#### Teste 4.2: Validação de dados
- [ ] Tentar enviar lead sem nome → Deve retornar erro
- [ ] Tentar enviar email inválido → Deve retornar erro
- [ ] Tentar enviar link expirado → Deve retornar 410
- [ ] Tentar enviar link inativo → Deve retornar 404

#### Teste 4.3: Rate limiting
- [ ] Enviar 6 leads em menos de 60 segundos
- [ ] Verificar se o 6º é bloqueado (rate limit)

---

### 5️⃣ **Teste de Proteção de Rotas Frontend**

#### Teste 5.1: ProtectedRoute
- [ ] Tentar acessar `/pt/nutri/dashboard` sem login
- [ ] Verificar redirecionamento para `/pt/nutri/login`
- [ ] Fazer login como nutri
- [ ] Verificar acesso ao dashboard

#### Teste 5.2: Isolamento de perfis
- [ ] Login como `nutri` → Acessa `/pt/nutri/dashboard` ✅
- [ ] Tentar acessar `/pt/wellness/dashboard` → Redireciona para nutri ✅
- [ ] Login como `wellness` → Acessa `/pt/wellness/dashboard` ✅
- [ ] Tentar acessar `/pt/nutri/dashboard` → Redireciona para wellness ✅

---

## 📋 **CHECKLIST DE VALIDAÇÃO**

### ✅ Funcionalidades Críticas
- [ ] Login funciona para todos os perfis
- [ ] Redirecionamento automático funciona
- [ ] RLS bloqueia acesso cruzado de dados
- [ ] APIs protegidas retornam 401 quando não autenticado
- [ ] APIs usam user_id do token (não aceitam parâmetro)
- [ ] Coleta de leads funciona (POST público)
- [ ] Listagem de leads funciona (GET autenticado)
- [ ] Admin acessa todos os dados
- [ ] Rate limiting funciona

### ✅ Segurança
- [ ] Impossível ver dados de outro usuário via API
- [ ] Impossível ver dados de outro usuário via SQL (RLS)
- [ ] Impossível manipular user_id na coleta de leads
- [ ] Validações bloqueiam dados inválidos
- [ ] Sanitização funciona corretamente

---

## 🔧 **FERRAMENTAS DE TESTE**

### Teste via Browser DevTools
```javascript
// Console do navegador (logado)
fetch('/api/wellness/ferramentas')
  .then(r => r.json())
  .then(console.log)

fetch('/api/leads')
  .then(r => r.json())
  .then(console.log)
```

### Teste via cURL (com sessão)
1. Fazer login no browser
2. Copiar cookie de sessão do DevTools
3. Usar no cURL:
```bash
curl -X GET http://localhost:3000/api/leads \
  -H "Cookie: sb-your-project-auth-token=..."
```

### Teste SQL no Supabase
```sql
-- Como usuário específico (simular)
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = 'user-id-aqui';

SELECT * FROM user_templates;
SELECT * FROM leads;
```

---

## 🐛 **PROBLEMAS COMUNS E SOLUÇÕES**

### Problema: RLS bloqueando tudo
**Solução:** Verificar se `auth.uid()` está retornando o ID correto
```sql
SELECT auth.uid(); -- Deve retornar UUID do usuário
```

### Problema: API retornando 401
**Solução:** Verificar se cookie de sessão está sendo enviado
- Verificar DevTools → Application → Cookies
- Verificar se cookie começa com `sb-`

### Problema: Admin não vê todos os dados
**Solução:** Verificar se `is_admin` está true no `user_profiles`
```sql
SELECT * FROM user_profiles WHERE is_admin = true;
```

---

## 📊 **RESULTADO ESPERADO**

Após todos os testes:
- ✅ Sistema completamente isolado por perfil
- ✅ Dados protegidos por RLS
- ✅ APIs funcionando corretamente
- ✅ Coleta de leads segura
- ✅ Pronto para produção

---

**Última atualização:** Dezembro 2024

