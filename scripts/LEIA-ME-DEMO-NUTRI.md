# 🎯 Setup Conta Demo - demo.nutri@ylada.com

**Conta:** demo.nutri@ylada.com  
**Objetivo:** Liberar todas as áreas e popular dados de teste

---

## ⚡ SUPER SIMPLES - 2 Passos

### 1️⃣ Executar Script

**Arquivo:** `scripts/SETUP-DEMO-NUTRI-YLADA.sql`

1. Acesse: Supabase Dashboard → SQL Editor
2. Abra o arquivo `SETUP-DEMO-NUTRI-YLADA.sql`
3. **Copie TUDO**
4. Cole no SQL Editor
5. Clique **RUN**

**Pronto!** O script:
- ✅ Busca automaticamente o user_id de `demo.nutri@ylada.com`
- ✅ Libera todos os 30 dias da jornada
- ✅ Cria 5 clientes demo
- ✅ Registra evolução física

**Não precisa substituir nada!** É automático! 🚀

---

### 2️⃣ Fazer Login

**URL:** https://ylada-app.vercel.app

**Email:** `demo.nutri@ylada.com`  
**Senha:** A senha que você definiu para essa conta

---

## ✅ O Que Foi Liberado

### 🗓️ Jornada YLADA (30 Dias)

**Todas as 5 semanas** estão desbloqueadas:
- ✅ Semana 1 (Dias 1-7): Base e Filosofia
- ✅ Semana 2 (Dias 8-14): Captação de Leads
- ✅ Semana 3 (Dias 15-21): Gestão de Clientes
- ✅ Semana 4 (Dias 22-28): Escala e Automação
- ✅ Semana 5 (Dias 29-30): Consolidação

**Onde ver:** Menu "Método" → Jornada

---

### 👥 Clientes Demo (5 Perfis)

**1. Ana Silva** - Emagrecimento
- Status: Ativa há 2 meses
- Evolução: -5.7kg (78.5kg → 72.8kg)
- Objetivo: Casamento em abril/2026

**2. Mariana Costa** - Hipertrofia
- Status: Ativa há 4 meses
- Evolução: +4.1kg massa magra
- Perfil: Atleta, treina 6x/semana

**3. Júlia Mendes** - Diabetes
- Status: Ativa há 3 meses
- Evolução: Glicemia 145 → 108mg/dL
- Sucesso: Médico reduziu medicação!

**4. Beatriz Souza** - Lead
- Status: Pré-consulta
- Origem: Quiz de emagrecimento
- 1ª consulta: Próxima semana

**5. Larissa Rodrigues** - Caso de Sucesso! 🎉
- Status: Finalizada
- Resultado: -13.5kg em 6 meses
- Meta atingida e mantida!

**Onde ver:** Menu "Gestão" → Clientes

---

## 🔍 Verificar se Funcionou

Execute no Supabase SQL Editor:

```sql
-- Verificar jornada
SELECT 
  COUNT(*) FILTER (WHERE completed = true) as dias_completos
FROM journey_progress jp
JOIN auth.users u ON u.id = jp.user_id
WHERE u.email = 'demo.nutri@ylada.com';
-- Deve retornar: 30

-- Verificar clientes
SELECT 
  name, status
FROM clients c
JOIN auth.users u ON u.id = c.user_id
WHERE u.email = 'demo.nutri@ylada.com'
  AND c.email LIKE '%.demo@email.com';
-- Deve retornar: 5 clientes
```

---

## 🆘 Problemas?

### ❌ "Conta demo.nutri@ylada.com não encontrada"

**Causa:** Conta não existe no banco  
**Solução:** Crie a conta primeiro:

1. Supabase Dashboard → Authentication → Users
2. Clique "Add user"
3. Email: `demo.nutri@ylada.com`
4. Password: Defina uma senha forte
5. ✅ Marque "Auto Confirm User"
6. Clique "Create user"

Depois execute o script novamente.

---

### ❌ Jornada não aparece liberada no frontend

**Solução 1:** Hard refresh  
- Pressione: `Ctrl + Shift + R` (Windows/Linux)
- Ou: `Cmd + Shift + R` (Mac)

**Solução 2:** Logout e Login  
- Saia da conta
- Entre novamente

**Solução 3:** Limpar cache  
- Configurações do navegador → Limpar cache

---

### ❌ Clientes não aparecem

**Causa:** Ainda não está logado  
**Solução:** Faça login com `demo.nutri@ylada.com`

---

## 🧹 Resetar Tudo

Se quiser recomeçar do zero:

```sql
-- Apagar progresso da jornada
DELETE FROM journey_progress 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'demo.nutri@ylada.com');

-- Apagar clientes demo
DELETE FROM clients 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'demo.nutri@ylada.com')
  AND email LIKE '%.demo@email.com';
```

Depois execute o script de setup novamente.

---

## 📊 Comandos Úteis

### Ver user_id da conta:
```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'demo.nutri@ylada.com';
```

### Ver todas as clientes:
```sql
SELECT c.name, c.status, c.email
FROM clients c
JOIN auth.users u ON u.id = c.user_id
WHERE u.email = 'demo.nutri@ylada.com';
```

### Ver progresso por semana:
```sql
SELECT 
  week_number, 
  COUNT(*) as dias_completos
FROM journey_progress jp
JOIN auth.users u ON u.id = jp.user_id
WHERE u.email = 'demo.nutri@ylada.com'
  AND completed = true
GROUP BY week_number
ORDER BY week_number;
```

---

## 🎯 Resumo

**Arquivo para executar:**
```
scripts/SETUP-DEMO-NUTRI-YLADA.sql
```

**Não precisa substituir nada!**  
O script busca automaticamente a conta `demo.nutri@ylada.com`

**Resultado:**
- ✅ 30 dias da jornada liberados
- ✅ 5 clientes demo criadas
- ✅ Tudo pronto para demonstração!

**Login:**
- Email: `demo.nutri@ylada.com`
- Senha: A que você definiu

---

## 📁 Outros Arquivos

- `SETUP-DEMO-NUTRI-YLADA.sql` ← **Execute este!**
- `COMANDOS-ESSENCIAIS.txt` ← Cola de comandos
- `GUIA-ACESSO-CONTA-DEMO.md` ← Guia geral
- `popular-demo-SUPABASE.sql` ← 8 clientes (opcional)

---

**🎉 Pronto! Execute o script e faça login para ver tudo funcionando!**


