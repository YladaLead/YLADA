# 🔑 Senha Provisória - Documentação

## ✅ Funcionalidade Implementada

Agora é possível gerar senhas provisórias para usuários que estão com problemas de acesso. A senha expira automaticamente em **3 dias**.

---

## 📋 Como Usar

### 1. **Gerar Senha Provisória**

1. Acesse `/admin/usuarios`
2. Clique em **"Editar"** no usuário que precisa de ajuda
3. Na seção **"🔑 Senha Provisória"**, clique em **"Gerar Senha Provisória"**
4. Confirme a ação
5. Uma senha será gerada e exibida em um modal

### 2. **Enviar pelo Canal de Suporte**

1. **Copie a senha** clicando no botão **"📋 Copiar"**
2. **Envie pelo canal de suporte** (WhatsApp, chat, etc.) com a mensagem:

```
Olá! Sua senha provisória é: [SENHA_GERADA]
Ela expira em 3 dias. Após fazer login, você poderá alterar sua senha.
```

### 3. **O Usuário Faz Login**

1. Usuário acessa a página de login
2. Usa o email dele + senha provisória
3. Se a senha ainda estiver válida (não expirou), faz login normalmente
4. Se a senha expirou, recebe mensagem: *"Sua senha provisória expirou. Entre em contato com o suporte para gerar uma nova."*

---

## 🔧 Configuração Inicial

### **Executar Script SQL**

Antes de usar, execute o script SQL no Supabase:

1. Acesse: **Supabase Dashboard → SQL Editor**
2. Execute o arquivo: `add-temporary-password-column.sql`
3. Isso adiciona a coluna `temporary_password_expires_at` na tabela `user_profiles`

---

## 📊 Como Funciona

### **Geração da Senha**

- **Comprimento:** 12 caracteres
- **Caracteres:** Letras maiúsculas, minúsculas, números e símbolos
- **Expiração:** 3 dias a partir da geração
- **Armazenamento:** Data de expiração salva em `user_profiles.temporary_password_expires_at`

### **Validação no Login**

1. Usuário faz login com email + senha provisória
2. Sistema verifica se existe `temporary_password_expires_at` no perfil
3. Se existe, verifica se ainda não expirou
4. Se expirou, bloqueia o login e mostra mensagem
5. Se não expirou, permite login e mostra aviso no console

---

## 🎯 Vantagens

1. ✅ **Segurança:** Senha expira automaticamente em 3 dias
2. ✅ **Praticidade:** Admin gera e envia pelo suporte
3. ✅ **Controle:** Data de expiração rastreada no banco
4. ✅ **UX:** Usuário recebe ajuda imediata pelo suporte

---

## 📝 Exemplo de Fluxo

### **Cenário: Usuário esqueceu a senha**

1. **Usuário:** "Esqueci minha senha, não consigo entrar"
2. **Suporte:** "Vou gerar uma senha provisória para você"
3. **Admin:** Gera senha provisória na área administrativa
4. **Suporte:** Envia senha pelo WhatsApp: "Sua senha provisória é: `Abc123!XyZ789`"
5. **Usuário:** Faz login com a senha provisória
6. **Sistema:** Valida que não expirou e permite login
7. **Usuário:** Altera a senha no perfil

---

## 🔍 Verificar Senhas Provisórias Ativas

Execute este SQL no Supabase:

```sql
-- Ver todas as senhas provisórias ativas
SELECT 
  up.email,
  up.nome_completo,
  up.temporary_password_expires_at,
  CASE 
    WHEN up.temporary_password_expires_at IS NULL THEN 'Sem senha provisória'
    WHEN up.temporary_password_expires_at > NOW() THEN 
      CONCAT('Válida por mais ', 
        EXTRACT(DAY FROM (up.temporary_password_expires_at - NOW()))::INT, 
        ' dia(s)')
    ELSE 'EXPIRADA'
  END as status
FROM user_profiles up
WHERE up.temporary_password_expires_at IS NOT NULL
ORDER BY up.temporary_password_expires_at DESC;
```

---

## ⚠️ Importante

- **Não compartilhe senhas por email** - Use apenas canais seguros (WhatsApp, chat interno)
- **Senhas expiram em 3 dias** - Após isso, é necessário gerar uma nova
- **Uma senha provisória substitui a anterior** - Se gerar uma nova, a anterior é invalidada
- **Usuário deve alterar a senha** - Após login, oriente a alterar no perfil

---

## ✅ Resumo

- ✅ API criada: `/api/admin/usuarios/[id]/temporary-password`
- ✅ Interface adicionada no modal de editar usuário
- ✅ Validação no login implementada
- ✅ Script SQL para adicionar coluna criado
- ✅ Documentação completa

**A funcionalidade está pronta para uso!**

