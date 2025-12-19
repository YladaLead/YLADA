# 🔐 Guia de Acesso - Conta Demo YLADA

**Objetivo:** Configurar uma conta completa para demonstração, com todas as áreas liberadas e dados de teste.

---

## 🎯 O Que Este Guia Faz

1. ✅ **Explica como acessar** a plataforma (email/senha)
2. ✅ **Libera todos os 30 dias** da jornada YLADA
3. ✅ **Popula clientes demo** para testes
4. ✅ **Deixa tudo pronto** para demonstração

---

## 📧 COMO ACESSAR A PLATAFORMA

### Opção 1: Usar Conta Existente (Recomendado)

Se você já tem uma conta criada:

1. **Acesse:** https://ylada-app.vercel.app (ou seu domínio)
2. **Faça login** com seu email e senha existentes
3. **Pule para:** [Passo 2 - Descobrir User ID](#passo-2-descobrir-seu-user-id)

---

### Opção 2: Criar Nova Conta Demo

Se ainda não tem conta:

#### 2.1 - Criar conta via interface:

1. Acesse: https://ylada-app.vercel.app/signup
2. Preencha:
   - **Email:** `demo@ylada.app` (ou qualquer email seu)
   - **Senha:** `Demo@2025!` (ou qualquer senha forte)
3. Confirme o email (se necessário)
4. Faça login

#### 2.2 - Criar conta via Supabase Dashboard:

1. Acesse: Supabase Dashboard → Authentication → Users
2. Clique em **"Add user"**
3. Preencha:
   - **Email:** `demo@ylada.app`
   - **Password:** `Demo@2025!`
   - ✅ **Auto Confirm User** (marque esta opção)
4. Clique em **Create user**
5. Copie o **UUID** gerado

---

## 🚀 PASSO A PASSO COMPLETO

### Passo 1: Acessar Supabase SQL Editor

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto YLADA
3. Vá em: **SQL Editor** (menu lateral esquerdo)

---

### Passo 2: Descobrir seu User ID

Cole no SQL Editor e execute:

```sql
SELECT 
  id as user_id,
  email,
  created_at::date as criado_em
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
```

**Copie o UUID** (id) do usuário que você quer configurar.

Exemplo de resultado:
```
user_id: 550e8400-e29b-41d4-a716-446655440000
email: demo@ylada.app
criado_em: 2025-12-18
```

---

### Passo 3: Executar Script de Setup Completo

#### Opção A - Setup Completo (Recomendado) 🌟

**Use este se quiser:**
- ✅ Liberar jornada de 30 dias
- ✅ Popular 5 clientes demo
- ✅ Tudo em 1 comando

**Arquivo:** `scripts/SETUP-CONTA-DEMO-COMPLETO.sql`

1. Abra o arquivo
2. Procure por: `'SEU-USER-ID-AQUI'` (aparece várias vezes)
3. **Substitua TODAS as ocorrências** pelo seu UUID
4. Copie o script completo
5. Cole no Supabase SQL Editor
6. Clique em **RUN**

---

#### Opção B - Apenas Liberar Jornada

**Use este se quiser APENAS:**
- ✅ Liberar os 30 dias da jornada
- ❌ Não criar clientes demo

**Arquivo:** `scripts/LIBERAR-TODAS-AREAS-JORNADA.sql`

1. Abra o arquivo
2. Substitua `'SEU-USER-ID-AQUI'` pelo seu UUID (aparece 4x)
3. Execute no Supabase SQL Editor

---

#### Opção C - Apenas Popular Clientes

**Use este se quiser APENAS:**
- ✅ Criar 8 clientes demo
- ❌ Não mexer na jornada

**Arquivo:** `scripts/popular-demo-SUPABASE.sql`

1. Abra o arquivo
2. Substitua `'SEU-USER-ID-AQUI'` pelo seu UUID (aparece 8x)
3. Execute no Supabase SQL Editor

---

### Passo 4: Verificar se Funcionou

Execute no SQL Editor:

```sql
-- Verificar jornada
SELECT 
  COUNT(*) FILTER (WHERE completed = true) as dias_completos,
  30 as total_dias
FROM journey_progress
WHERE user_id = 'SEU-USER-ID'::uuid;

-- Deve retornar: 30/30 dias

-- Verificar clientes
SELECT COUNT(*) as clientes_criadas
FROM clients
WHERE user_id = 'SEU-USER-ID'::uuid
  AND email LIKE '%.demo@email.com';

-- Deve retornar: 5 (ou 8, dependendo do script usado)
```

---

### Passo 5: Fazer Login e Testar

1. Acesse a plataforma
2. Faça login com:
   - **Email:** O email da conta que você configurou
   - **Senha:** A senha que você definiu
3. Verifique:
   - ✅ Menu "Método" → Jornada → Todos os 30 dias devem estar desbloqueados
   - ✅ Menu "Gestão" → Clientes → Deve aparecer as clientes demo

---

## 📊 O Que Será Criado

### 🗓️ Jornada de 30 Dias

Todos os dias da **Semana 1 a 5** estarão:
- ✅ Desbloqueados
- ✅ Marcados como completos
- ✅ Checklists preenchidos

**Semanas:**
- Semana 1: Dias 1-7 (Base e Filosofia)
- Semana 2: Dias 8-14 (Captação de Leads)
- Semana 3: Dias 15-21 (Gestão de Clientes)
- Semana 4: Dias 22-28 (Escala e Automação)
- Semana 5: Dias 29-30 (Consolidação)

---

### 👥 Clientes Demo (5 perfis)

**1. Ana Silva** - Emagrecimento (ATIVA)
- Objetivo: Perder 10kg para casamento
- Evolução: -5.7kg em 2 meses
- Status: Cliente há 2 meses

**2. Mariana Costa** - Hipertrofia (ATIVA)
- Objetivo: Ganhar massa muscular
- Evolução: +4.1kg massa magra
- Status: Cliente há 4 meses

**3. Júlia Mendes** - Diabetes (ATIVA)
- Objetivo: Controlar diabetes tipo 2
- Evolução: Glicemia 145→108mg/dL
- Status: Cliente há 3 meses

**4. Beatriz Souza** - Lead (PRÉ-CONSULTA)
- Objetivo: Emagrecer
- Status: Primeira consulta agendada
- Origem: Quiz de emagrecimento

**5. Larissa Rodrigues** - Caso de Sucesso (FINALIZADA)
- Objetivo: Perder 12kg
- Resultado: -13.5kg em 6 meses! 🎉
- Status: Objetivo atingido

---

## 🔧 Scripts Disponíveis

### 📁 Setup e Configuração:
- `SETUP-CONTA-DEMO-COMPLETO.sql` ⭐ **Principal**
- `LIBERAR-TODAS-AREAS-JORNADA.sql` - Apenas jornada
- `popular-demo-SUPABASE.sql` - Apenas clientes

### 📖 Documentação:
- `GUIA-ACESSO-CONTA-DEMO.md` - Este arquivo
- `README-POPULAR-DEMO.md` - Detalhes sobre clientes demo

### 🧹 Limpeza:
```sql
-- Resetar jornada
DELETE FROM journey_progress WHERE user_id = 'SEU-USER-ID'::uuid;

-- Apagar clientes demo
DELETE FROM clients 
WHERE user_id = 'SEU-USER-ID'::uuid 
  AND email LIKE '%.demo@email.com';
```

---

## 🆘 Problemas Comuns

### ❌ "Erro: user_id não encontrado"
**Causa:** UUID incorreto  
**Solução:** Execute `SELECT id FROM auth.users` e copie o UUID correto

### ❌ "Erro: duplicate key violation"
**Causa:** Script executado 2x  
**Solução:** Normal! O script usa `ON CONFLICT`, já está atualizado

### ❌ "Erro: foreign key violation"
**Causa:** Tabela `journey_days` não existe  
**Solução:** Execute primeiro: `migrations/populate-jornada-30-dias.sql`

### ❌ Jornada não aparece liberada no frontend
**Causa 1:** Cache do navegador  
**Solução:** Ctrl+Shift+R (hard refresh) ou limpar cache

**Causa 2:** Não está logado com o usuário certo  
**Solução:** Saia e faça login novamente

### ❌ Clientes não aparecem
**Causa:** RLS (Row Level Security) ativo  
**Solução:** Confirme que está logado com o mesmo `user_id` usado no script

---

## 🎨 Personalizações

### Adicionar mais clientes:

Edite `SETUP-CONTA-DEMO-COMPLETO.sql` e adicione mais blocos `INSERT INTO clients`.

### Liberar apenas algumas semanas:

No script `LIBERAR-TODAS-AREAS-JORNADA.sql`, altere:
```sql
WHERE day_number BETWEEN 1 AND 30  -- Todos os dias
```

Para:
```sql
WHERE day_number BETWEEN 1 AND 14  -- Apenas 2 primeiras semanas
```

### Marcar dias como incompletos:

```sql
UPDATE journey_progress 
SET completed = false, completed_at = NULL
WHERE user_id = 'SEU-USER-ID'::uuid
  AND day_number > 7;  -- Dias 8+ ficam bloqueados
```

---

## 📋 Checklist de Setup

- [ ] Tenho acesso ao Supabase Dashboard
- [ ] Criei/tenho uma conta de usuário
- [ ] Descobri meu `user_id` (UUID)
- [ ] Substituí `'SEU-USER-ID-AQUI'` no script
- [ ] Executei o script no SQL Editor
- [ ] Verifiquei que retornou "30/30 dias"
- [ ] Fiz login na plataforma
- [ ] Confirmei que jornada está liberada
- [ ] Confirmei que clientes aparecem

---

## 🎯 Resumo Rápido

**Para setup completo em 3 passos:**

1. **Descobrir user_id:**
   ```sql
   SELECT id, email FROM auth.users;
   ```

2. **Executar script:**
   - Abrir: `scripts/SETUP-CONTA-DEMO-COMPLETO.sql`
   - Substituir: `'SEU-USER-ID-AQUI'` → seu UUID
   - Executar no Supabase SQL Editor

3. **Fazer login:**
   - Email: O que você usou
   - Senha: A que você definiu
   - Verificar: Jornada e Clientes

---

## 🔐 Dados de Acesso

**Email:** Use o email que você criou (ex: `demo@ylada.app`)  
**Senha:** Use a senha que você definiu (ex: `Demo@2025!`)

⚠️ **IMPORTANTE:**
- Estes são dados fictícios de exemplo
- Use seus próprios dados
- Guarde em local seguro

---

## 📞 Suporte

Se algo não funcionar:

1. Verifique se substituiu TODOS os `'SEU-USER-ID-AQUI'`
2. Confirme que o UUID está correto (execute `SELECT id FROM auth.users`)
3. Tente fazer logout e login novamente
4. Limpe o cache do navegador

---

**Criado em:** 2025-12-18  
**Versão:** 1.0  
**Compatível com:** YLADA Nutri Platform v2.0+

