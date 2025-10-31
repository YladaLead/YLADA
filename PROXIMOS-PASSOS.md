# 🚀 PRÓXIMOS PASSOS - YLADA

**Status Atual:** ✅ RLS Executado  
**Data:** Dezembro 2024

---

## ✅ **O QUE JÁ ESTÁ PRONTO**

1. ✅ Sistema de autenticação completo
2. ✅ RLS policies implementadas e executadas
3. ✅ APIs protegidas (`/api/wellness/ferramentas`, `/api/leads`)
4. ✅ Proteção de rotas frontend
5. ✅ Isolamento de dados por perfil

---

## 🎯 **AÇÕES IMEDIATAS (PRÓXIMAS 24H)**

### 1️⃣ **Validar RLS Funcionando**

Execute no Supabase SQL Editor:
```sql
-- Verificar políticas ativas
SELECT tablename, policyname FROM pg_policies 
WHERE tablename IN ('user_profiles', 'user_templates', 'leads');

-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'user_templates', 'leads');
```

**Resultado esperado:** Todas as políticas listadas e `rowsecurity = true`

---

### 2️⃣ **Criar Usuários de Teste**

#### Via Supabase Dashboard:
1. Acesse **Authentication > Users**
2. Crie usuários para cada perfil:
   - `nutri@teste.com` → Perfil: `nutri`
   - `wellness@teste.com` → Perfil: `wellness`
   - `coach@teste.com` → Perfil: `coach`
   - `nutra@teste.com` → Perfil: `nutra`
   - `admin@teste.com` → Perfil: `admin` (marcar `is_admin = true`)

#### Ou via SQL (após criar no Auth):
```sql
-- Atualizar perfis dos usuários criados
UPDATE user_profiles SET perfil = 'nutri' WHERE email = 'nutri@teste.com';
UPDATE user_profiles SET perfil = 'wellness' WHERE email = 'wellness@teste.com';
UPDATE user_profiles SET perfil = 'coach' WHERE email = 'coach@teste.com';
UPDATE user_profiles SET perfil = 'nutra' WHERE email = 'nutra@teste.com';
UPDATE user_profiles SET perfil = 'admin', is_admin = true WHERE email = 'admin@teste.com';
```

---

### 3️⃣ **Testar Login e Redirecionamento**

Para cada perfil:
1. [ ] Acessar `/pt/nutri/login` → Fazer login → Verificar redirecionamento
2. [ ] Acessar `/pt/wellness/login` → Fazer login → Verificar redirecionamento
3. [ ] Acessar `/pt/coach/login` → Fazer login → Verificar redirecionamento
4. [ ] Acessar `/pt/nutra/login` → Fazer login → Verificar redirecionamento
5. [ ] Acessar `/admin/login` → Fazer login como admin → Verificar acesso

---

### 4️⃣ **Testar Isolamento de Dados**

#### Teste 4.1: Criar dados como Nutri
1. Login como `nutri@teste.com`
2. Criar uma ferramenta/template
3. Criar um lead (via formulário público)

#### Teste 4.2: Tentar acessar como Wellness
1. Logout
2. Login como `wellness@teste.com`
3. Tentar listar ferramentas:
   ```bash
   GET /api/wellness/ferramentas
   ```
   **Resultado esperado:** Lista vazia (não vê dados do nutri)

#### Teste 4.3: Verificar no SQL
```sql
-- Como usuário nutri (via Supabase SQL Editor)
-- Simular: SET LOCAL request.jwt.claim.sub = 'user-id-nutri';
SELECT * FROM user_templates;
-- Deve retornar apenas templates do nutri

-- Como usuário wellness
SELECT * FROM user_templates;
-- Deve retornar apenas templates do wellness
```

---

### 5️⃣ **Testar API de Leads**

#### Teste 5.1: Criar Link e Coletar Lead
1. Login como `wellness@teste.com`
2. Criar uma ferramenta (gera um slug)
3. Acessar o link público: `/{slug}`
4. Preencher formulário de lead (sem estar logado)
5. Verificar se lead foi salvo

#### Teste 5.2: Listar Leads (Autenticado)
```bash
# No browser, logado como wellness
GET /api/leads
```
**Resultado esperado:** Retorna apenas leads do wellness

---

## 📋 **CHECKLIST DE VALIDAÇÃO**

### Segurança
- [ ] RLS ativo em todas as tabelas
- [ ] Políticas criadas corretamente
- [ ] Isolamento de dados funcionando
- [ ] APIs retornam 401 quando não autenticado
- [ ] Impossível ver dados de outro usuário

### Funcionalidades
- [ ] Login funciona para todos os perfis
- [ ] Redirecionamento automático funciona
- [ ] Dashboards acessíveis apenas pelo perfil correto
- [ ] Coleta de leads funciona (público)
- [ ] Listagem de leads funciona (autenticado)

### Performance
- [ ] Queries RLS não estão lentas
- [ ] Índices estão criados
- [ ] Rate limiting funciona

---

## 🔧 **FERRAMENTAS ÚTEIS**

### Verificar Logs no Supabase
1. Acesse **Logs > Postgres Logs**
2. Filtre por queries com `SELECT` para ver RLS em ação

### Testar RLS via SQL (Simular Usuário)
```sql
-- No Supabase SQL Editor (executar como admin)
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = 'user-id-aqui';

-- Testar query
SELECT * FROM user_templates;
-- Deve retornar apenas do usuário simulado
```

### Testar APIs via Browser DevTools
```javascript
// Console do navegador (logado)
fetch('/api/wellness/ferramentas', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(console.log)
```

---

## 🐛 **PROBLEMAS COMUNS**

### Problema: RLS bloqueando tudo
**Causa:** `auth.uid()` retornando NULL  
**Solução:** Verificar se usuário está autenticado via Supabase Auth

### Problema: Admin não vê todos os dados
**Causa:** `is_admin` não está true ou função `is_admin()` não existe  
**Solução:** Verificar `user_profiles.is_admin = true` e criar função helper

### Problema: APIs retornando 401
**Causa:** Cookie de sessão não está sendo enviado  
**Solução:** Verificar se login foi feito corretamente e cookie existe

---

## 📊 **MÉTRICAS DE SUCESSO**

Após validar todos os testes:
- ✅ 100% de isolamento de dados
- ✅ 0% de vazamento entre perfis
- ✅ 100% de APIs protegidas
- ✅ 0% de acessos não autorizados

---

## 🎉 **PRÓXIMOS DESENVOLVIMENTOS (FUTURO)**

1. **Dashboard Analytics**
   - Métricas de leads por perfil
   - Gráficos de conversão
   - Relatórios automáticos

2. **Integração Stripe**
   - Assinaturas por perfil
   - Planos diferenciados
   - Cobrança automática

3. **Notificações**
   - Email quando lead é capturado
   - Alertas de conversão
   - Relatórios semanais

4. **Exportação de Dados**
   - CSV de leads
   - PDF de relatórios
   - Integração com CRMs

---

**Última atualização:** Dezembro 2024  
**Próxima revisão:** Após validação dos testes

