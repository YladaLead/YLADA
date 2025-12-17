# 📋 LEIA-ME PRIMEIRO - Scripts de Reset para Testes

## ⚠️ **ERRO COMUM: "Usuário não encontrado"**

Se você está vendo este erro:
```
ERROR: P0001: Usuário não encontrado com email: seu-email@exemplo.com
```

**Isso significa que você não substituiu o email placeholder!**

---

## ✅ **SOLUÇÃO: Passo a Passo**

### **PASSO 1: Listar Emails Disponíveis**

**Antes de usar qualquer script de reset, execute este primeiro:**

```sql
-- Execute: listar-emails-usuarios.sql
```

Este script mostra:
- ✅ Todos os emails de usuários Nutri
- ✅ Status do diagnóstico
- ✅ Fase atual da jornada
- ✅ Nome completo

**Copie o email que você quer usar!**

---

### **PASSO 2: Escolher o Script de Reset**

| Script | O que faz |
|--------|-----------|
| `reset-completo-teste.sql` | Reseta TUDO (diagnóstico + jornada + análises) |
| `reset-diagnostico-teste.sql` | Reseta apenas o diagnóstico |
| `reset-jornada-teste.sql` | Reseta apenas a jornada |

---

### **PASSO 3: Substituir o Email**

No script escolhido, procure por:

```sql
v_email TEXT := 'seu-email@exemplo.com'; -- ⚠️⚠️⚠️ SUBSTITUA AQUI
```

**Substitua** `'seu-email@exemplo.com'` pelo email que você copiou no Passo 1.

**Exemplo:**
```sql
v_email TEXT := 'nutri.teste@gmail.com'; -- ✅ Email real
```

---

### **PASSO 4: Substituir Email na Verificação**

No final do script, procure por:

```sql
WHERE up.email = 'seu-email@exemplo.com' -- ⚠️⚠️⚠️ SUBSTITUA AQUI
```

**Substitua** também aqui pelo mesmo email.

---

### **PASSO 5: Executar**

1. Cole o script completo no Supabase SQL Editor
2. Verifique que substituiu o email em **2 lugares**
3. Clique em **Run**

---

## 🎯 **EXEMPLO COMPLETO**

### **1. Primeiro, listar emails:**
```sql
-- Execute: listar-emails-usuarios.sql
-- Resultado: nutri.teste@gmail.com
```

### **2. Depois, usar no reset:**
```sql
DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'nutri.teste@gmail.com'; -- ✅ Substituído
BEGIN
  -- ... código ...
END $$;

-- Verificação
SELECT ...
WHERE up.email = 'nutri.teste@gmail.com'; -- ✅ Substituído também
```

---

## 🐛 **ERROS COMUNS**

### **Erro: "Usuário não encontrado"**
- ❌ Email não foi substituído
- ❌ Email está errado (typo)
- ✅ **Solução:** Execute `listar-emails-usuarios.sql` primeiro

### **Erro: "syntax error"**
- ❌ Aspas simples faltando ou extras
- ✅ **Solução:** Verifique as aspas ao redor do email

### **Erro: "permission denied"**
- ❌ Tentando executar em lugar errado
- ✅ **Solução:** Use o Supabase SQL Editor

---

## 📚 **ORDEM RECOMENDADA**

1. ✅ `listar-emails-usuarios.sql` (ver emails disponíveis)
2. ✅ Escolher script de reset
3. ✅ Substituir email em 2 lugares
4. ✅ Executar
5. ✅ Verificar resultado

---

## ✅ **CHECKLIST ANTES DE EXECUTAR**

- [ ] Executei `listar-emails-usuarios.sql` primeiro
- [ ] Copiei o email correto
- [ ] Substituí email na variável `v_email`
- [ ] Substituí email na query de verificação
- [ ] Verifiquei que o email existe (não tem typo)
- [ ] Pronto para executar!

---

**Agora você está pronto! 🚀**


