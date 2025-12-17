# 📝 Como Usar os Scripts SQL no Supabase

## ✅ **PROBLEMA CORRIGIDO**

Os scripts foram atualizados para funcionar no **Supabase SQL Editor** (não apenas no `psql`).

---

## 🚀 **COMO USAR**

### **1. Abrir Supabase SQL Editor**
- Acesse seu projeto no Supabase
- Vá em **SQL Editor** (menu lateral)
- Clique em **New Query**

### **2. Listar Emails Disponíveis (IMPORTANTE!)**

**⚠️ ANTES de usar qualquer script de reset, execute este primeiro:**

```sql
-- Execute: listar-emails-usuarios.sql
```

Este script mostra todos os emails de usuários Nutri disponíveis, para você escolher qual usar.

**Copie o email que você quer usar!**

### **3. Escolher o Script**

#### **Opção A: Reset Completo** (`reset-completo-teste.sql`)
- Reseta TUDO: diagnóstico, jornada, análises LYA
- Use para começar do zero

#### **Opção B: Reset Apenas Diagnóstico** (`reset-diagnostico-teste.sql`)
- Reseta apenas o diagnóstico
- Mantém jornada e análises

#### **Opção C: Reset Apenas Jornada** (`reset-jornada-teste.sql`)
- Reseta apenas o progresso da jornada
- Mantém diagnóstico

---

## 📋 **PASSO A PASSO**

### **Passo 1: Abrir o Script**
1. Abra o arquivo `.sql` desejado
2. Copie TODO o conteúdo

### **Passo 2: Substituir o Email**
No script, procure por:
```sql
v_email TEXT := 'seu-email@exemplo.com'; -- ⚠️ SUBSTITUA AQUI O EMAIL
```

**Substitua** `'seu-email@exemplo.com'` pelo email real do usuário de teste.

**Exemplo:**
```sql
v_email TEXT := 'nutri.teste@exemplo.com'; -- ⚠️ SUBSTITUA AQUI O EMAIL
```

### **Passo 3: Substituir Email na Query de Verificação**
No final do script, procure por:
```sql
WHERE up.email = 'seu-email@exemplo.com' -- ⚠️ SUBSTITUA AQUI O EMAIL
```

**Substitua** também aqui pelo mesmo email.

### **Passo 4: Executar**
1. Cole o script completo no Supabase SQL Editor
2. Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)
3. Verifique os resultados na aba **Results**

---

## ⚠️ **IMPORTANTE**

### **Substituir Email em 2 Lugares:**
1. ✅ Na variável `v_email` dentro do bloco `DO $$`
2. ✅ Na query `SELECT` de verificação no final

### **Exemplo Completo:**

```sql
DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'meu-email@teste.com'; -- ✅ Substituído aqui
BEGIN
  -- ... código ...
END $$;

-- Verificação
SELECT ...
WHERE up.email = 'meu-email@teste.com'; -- ✅ E aqui também
```

---

## 🧪 **TESTAR**

Após executar o script:

1. **Verificar mensagens:**
   - Deve aparecer: `Reset completo realizado para usuário: seu-email@exemplo.com`
   - Se aparecer erro, verifique se o email existe no `auth.users`

2. **Verificar resultados:**
   - A query de verificação no final mostra o status atual
   - Confirme que os dados foram resetados corretamente

---

## 🐛 **ERROS COMUNS**

### **Erro: "Usuário não encontrado"**
- ✅ Verifique se o email está correto
- ✅ Verifique se o usuário existe em `auth.users`
- ✅ Use o email exato (case-sensitive)

### **Erro: "syntax error at or near"**
- ✅ Certifique-se de ter substituído TODOS os emails
- ✅ Não deixe `'seu-email@exemplo.com'` no código
- ✅ Verifique aspas simples ao redor do email

### **Erro: "permission denied"**
- ✅ Verifique se está usando o SQL Editor (não precisa de permissões especiais)
- ✅ Se usar `psql`, certifique-se de ter permissões de admin

---

## 📚 **SCRIPTS DISPONÍVEIS**

| Script | O que faz | Quando usar |
|--------|-----------|-------------|
| `listar-emails-usuarios.sql` | Lista todos os emails | **Execute PRIMEIRO!** |
| `reset-completo-teste.sql` | Reseta TUDO | Começar do zero |
| `reset-diagnostico-teste.sql` | Reseta apenas diagnóstico | Testar onboarding novamente |
| `reset-jornada-teste.sql` | Reseta apenas jornada | Testar diferentes fases |

---

## ✅ **CHECKLIST ANTES DE EXECUTAR**

- [ ] **Executei `listar-emails-usuarios.sql` primeiro**
- [ ] **Copiei o email correto da lista**
- [ ] Email substituído na variável `v_email`
- [ ] Email substituído na query de verificação
- [ ] Email existe no sistema (verificado na lista)
- [ ] Script completo copiado (não apenas parte)
- [ ] Pronto para executar no Supabase SQL Editor

---

**Agora os scripts funcionam perfeitamente no Supabase! 🎉**


