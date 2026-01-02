# ⚡ Quick Start - Conta Demo em 5 Minutos

**Objetivo:** Configurar conta demo o mais rápido possível.

---

## 🔥 Setup em 3 Comandos

### 1️⃣ Descobrir User ID
```sql
SELECT id, email FROM auth.users LIMIT 5;
```
**→ Copie o UUID**

---

### 2️⃣ Executar Setup Completo

Abra: `scripts/SETUP-CONTA-DEMO-COMPLETO.sql`

Substitua: `'SEU-USER-ID-AQUI'` pelo UUID copiado (Ctrl+H para substituir tudo)

Execute no Supabase SQL Editor

---

### 3️⃣ Verificar
```sql
-- Jornada
SELECT COUNT(*) FROM journey_progress WHERE user_id = 'SEU-UUID'::uuid AND completed = true;
-- Deve retornar: 30

-- Clientes
SELECT COUNT(*) FROM clients WHERE user_id = 'SEU-UUID'::uuid AND email LIKE '%.demo@email.com';
-- Deve retornar: 5
```

---

## 🔐 Login

**URL:** https://ylada-app.vercel.app

**Email:** O email da sua conta  
**Senha:** A senha da sua conta

**Se não tem conta:**
- Crie em: /signup
- Ou crie no Supabase Dashboard → Authentication → Add user

---

## ✅ O Que Foi Criado

### Jornada YLADA:
- ✅ **30 dias** desbloqueados
- ✅ **5 semanas** completas
- ✅ Todos os checklists marcados

### Clientes Demo:
1. Ana Silva - Emagrecimento (ativa)
2. Mariana Costa - Hipertrofia (ativa)
3. Júlia Mendes - Diabetes (ativa)
4. Beatriz Souza - Lead (pré-consulta)
5. Larissa Rodrigues - Sucesso (finalizada)

---

## 🆘 Problema?

### Script não roda:
```sql
-- Verificar se tabelas existem:
SELECT COUNT(*) FROM journey_days;      -- Deve retornar 30
SELECT COUNT(*) FROM clients;           -- Deve retornar algo
```

### UUID inválido:
```sql
-- Listar todos os usuários:
SELECT id::text as uuid_para_copiar, email FROM auth.users;
```

### Jornada não aparece liberada:
- Faça logout e login novamente
- Limpe cache: Ctrl+Shift+R
- Verifique se está logado com o email certo

---

## 🧹 Resetar Tudo

```sql
-- Apagar progresso da jornada
DELETE FROM journey_progress WHERE user_id = 'SEU-UUID'::uuid;

-- Apagar clientes demo
DELETE FROM clients WHERE user_id = 'SEU-UUID'::uuid AND email LIKE '%.demo@email.com';
```

---

## 📁 Arquivos

**Setup:**
- `SETUP-CONTA-DEMO-COMPLETO.sql` ← Use este!

**Documentação:**
- `GUIA-ACESSO-CONTA-DEMO.md` ← Guia completo
- `README-POPULAR-DEMO.md` ← Detalhes das clientes

**Opcionais:**
- `LIBERAR-TODAS-AREAS-JORNADA.sql` ← Só jornada
- `popular-demo-SUPABASE.sql` ← Só clientes (8 perfis)

---

## 🎯 Pronto!

Agora acesse a plataforma e veja:
- Menu **"Método"** → Jornada → 30 dias liberados
- Menu **"Gestão"** → Clientes → 5 clientes demo

**Boa demonstração! 🚀**












