# 🧪 Guia: Usuários de Teste para Nutri

## 📋 **Scripts Disponíveis**

### **1. Criar Usuários Sequenciais** (`criar-usuarios-teste-nutri.sql`)
Cria automaticamente 10 usuários:
- `nutri1@ylada.com` até `nutri10@ylada.com`
- Senha: `senha123`
- Status: Email confirmado, sem diagnóstico

### **2. Criar Usuários Customizados** (`criar-usuarios-teste-nutri-custom.sql`)
Cria usuários com emails específicos:
- `nutri1@ylada.com`
- `nutri2@ylada.com`
- `nutri3@ylada.com`
- E mais...

**Como personalizar:**
Edite o array `usuarios_teste` no script:
```sql
usuarios_teste TEXT[][] := ARRAY[
  ['nutri1@ylada.com', 'Nutricionista Teste 1'],
  ['nutri2@ylada.com', 'Nutricionista Teste 2'],
  -- Adicione mais aqui
];
```

### **3. Resetar Todos os Usuários de Teste** (`reset-todos-usuarios-teste.sql`)
Reseta todos os usuários que terminam com:
- `@ylada.com`

---

## 🚀 **Como Usar**

### **Passo 1: Criar Usuários**

**⚠️ IMPORTANTE:** O Supabase pode não permitir criar usuários diretamente via SQL em `auth.users`. Se o script falhar, use o **Método Manual** abaixo.

**Opção A: Tentar via SQL (pode não funcionar)**
```sql
-- Execute: criar-usuarios-teste-nutri-custom.sql
-- Se funcionar, ótimo! Se não, use o Método Manual
```

**Opção B: Método Manual (RECOMENDADO)**

1. **Acesse:** Supabase Dashboard → Authentication → Users
2. **Para cada email, clique em "Add User":**
   - Email: `nutri1@ylada.com`
   - Password: `senha123`
   - **Auto Confirm User:** ✅ (marcar esta opção!)
   - Clique em "Create User"
3. **Repita para todos os emails:**
   - `nutri2@ylada.com`
   - `nutri3@ylada.com`
   - `nutri4@ylada.com`
   - `nutri5@ylada.com`
4. **Depois execute:** `criar-perfis-usuarios-teste.sql` para criar os perfis

### **Passo 2: Criar Perfis (se usou Método Manual)**

Se você criou os usuários manualmente no Dashboard, execute:
```sql
-- Execute: criar-perfis-usuarios-teste.sql
-- Isso cria/atualiza os perfis em user_profiles
```

### **Passo 3: Verificar Usuários Criados**

O script já inclui uma query de verificação no final que mostra:
- ✅ Email
- ✅ Nome completo
- ✅ Status do diagnóstico
- ✅ Data de cadastro

### **Passo 4: Fazer Login e Testar**

1. Acesse: `http://localhost:3000/pt/nutri/login`
2. Use um dos emails criados
3. Senha: `senha123`
4. Teste o fluxo completo de onboarding

### **Passo 5: Resetar Quando Precisar**

```sql
-- Execute: reset-todos-usuarios-teste.sql
-- Reseta todos os usuários de teste de uma vez
```

---

## 📝 **Emails Criados**

### **Sequenciais:**
- `nutri1@ylada.com`
- `nutri2@ylada.com`
- `nutri3@ylada.com`
- ... até `nutri10@ylada.com`

### **Customizados:**
- `nutri1@ylada.com`
- `nutri2@ylada.com`
- `nutri3@ylada.com`
- `nutri4@ylada.com`
- `nutri5@ylada.com`
- (e mais conforme você configurar)

---

## 🔑 **Credenciais de Login**

**Email:** Qualquer um dos emails criados  
**Senha:** `senha123` (para todos)

---

## ✅ **Status dos Usuários**

Após criar, os usuários terão:
- ✅ Email confirmado (pode fazer login direto)
- ✅ Perfil configurado como `nutri`
- ❌ Sem diagnóstico (pronto para testar onboarding)
- ❌ Sem jornada iniciada

**Perfeito para testar o fluxo completo desde o início!**

---

## 🧹 **Limpeza**

### **Resetar um usuário específico:**
Use os scripts de reset individuais com o email específico.

### **Resetar todos de uma vez:**
```sql
-- Execute: reset-todos-usuarios-teste.sql
```

### **Deletar usuários (se necessário):**
```sql
-- CUIDADO: Isso deleta permanentemente!
DELETE FROM user_profiles 
WHERE email LIKE '%@ylada.com';

DELETE FROM auth.users 
WHERE email LIKE '%@ylada.com';
```

---

## 🎯 **Casos de Uso**

### **Teste 1: Onboarding Completo**
1. Criar usuário de teste
2. Fazer login
3. Completar diagnóstico
4. Verificar redirecionamento
5. Testar dashboard simplificado

### **Teste 2: Diferentes Fases**
1. Criar múltiplos usuários
2. Avançar alguns para Fase 2 ou 3
3. Testar sidebar progressivo
4. Verificar microcopy por fase

### **Teste 3: Reset e Repetir**
1. Testar fluxo completo
2. Resetar usuário
3. Testar novamente
4. Verificar consistência

---

## ⚠️ **Importante**

- Os usuários são criados com email **já confirmado**
- Senha padrão é `senha123` (mude em produção!)
- Use apenas para testes em ambiente de desenvolvimento
- Não use esses emails em produção

---

**Agora você tem usuários de teste prontos! 🚀**


