# 🔐 Guia Completo - Como Configurar Administradores

## ✅ **Sistema Funcionando! Agora vamos configurar os administradores:**

### **📧 Onde Configurar Administradores:**

#### **1. No Supabase SQL Editor:**
- ✅ Acesse seu projeto no Supabase
- ✅ Vá em **SQL Editor**
- ✅ Execute os comandos abaixo

#### **2. Comandos para Configurar Administradores:**

```sql
-- 1. PRIMEIRO: Verificar usuários existentes
SELECT id, name, email, is_active, is_admin, created_at 
FROM professionals 
ORDER BY created_at DESC;

-- 2. TORNAR UM USUÁRIO ADMINISTRADOR
-- Substitua 'seu-email@exemplo.com' pelo email do usuário que você quer tornar admin
SELECT make_user_admin('seu-email@exemplo.com');

-- 3. VERIFICAR SE FUNCIONOU
SELECT * FROM list_admins();

-- 4. VERIFICAR USUÁRIO ESPECÍFICO
SELECT name, email, is_admin, is_active 
FROM professionals 
WHERE email = 'seu-email@exemplo.com';
```

### **🎯 Passo a Passo Detalhado:**

#### **Passo 1: Verificar Usuários Existentes**
```sql
SELECT id, name, email, is_active, is_admin, created_at 
FROM professionals 
ORDER BY created_at DESC;
```
**Resultado esperado:** Lista de todos os usuários cadastrados

#### **Passo 2: Tornar Usuário Administrador**
```sql
-- Exemplo: Tornar o usuário com email "admin@herbalead.com" administrador
SELECT make_user_admin('admin@herbalead.com');
```
**Resultado esperado:** "Usuário admin@herbalead.com foi promovido a administrador com sucesso!"

#### **Passo 3: Verificar Administradores**
```sql
SELECT * FROM list_admins();
```
**Resultado esperado:** Lista apenas dos usuários que são administradores

#### **Passo 4: Testar Login Administrativo**
- ✅ Acesse `/admin/login`
- ✅ Use o email e senha do usuário que você tornou admin
- ✅ Deve redirecionar para `/admin`

### **🔑 Informações Importantes:**

#### **1. Email e Senha do Administrador:**
- ✅ **Email:** O mesmo email usado no cadastro normal
- ✅ **Senha:** A mesma senha usada no login normal
- ✅ **Não precisa criar conta separada** - usa a conta existente

#### **2. Como Funciona:**
- ✅ Usuário faz cadastro normal em `/register`
- ✅ Você executa `make_user_admin('email@usuario.com')`
- ✅ Usuário pode fazer login em `/admin/login`
- ✅ Sistema verifica se `is_admin = true`

### **📋 Exemplo Prático:**

#### **Cenário: Você quer tornar o usuário "joao@empresa.com" administrador**

```sql
-- 1. Verificar se o usuário existe
SELECT name, email, is_active, is_admin 
FROM professionals 
WHERE email = 'joao@empresa.com';

-- 2. Tornar administrador
SELECT make_user_admin('joao@empresa.com');

-- 3. Verificar se funcionou
SELECT name, email, is_admin, is_active 
FROM professionals 
WHERE email = 'joao@empresa.com';
```

**Resultado esperado:**
```
name: João Silva
email: joao@empresa.com
is_admin: true
is_active: true
```

### **🛠️ Comandos Úteis para Gerenciamento:**

#### **1. Listar Todos os Administradores:**
```sql
SELECT * FROM list_admins();
```

#### **2. Ver Todos os Usuários:**
```sql
SELECT id, name, email, is_active, is_admin, created_at 
FROM professionals 
ORDER BY created_at DESC;
```

#### **3. Remover Privilégios de Administrador:**
```sql
-- Função para remover admin (se necessário)
UPDATE professionals 
SET is_admin = false 
WHERE email = 'email@exemplo.com';
```

#### **4. Ativar/Desativar Usuário:**
```sql
-- Ativar usuário
UPDATE professionals 
SET is_active = true 
WHERE email = 'email@exemplo.com';

-- Desativar usuário
UPDATE professionals 
SET is_active = false 
WHERE email = 'email@exemplo.com';
```

### **🚨 Solução de Problemas:**

#### **1. Usuário não encontrado:**
```sql
-- Verificar se o email está correto
SELECT email FROM professionals WHERE email LIKE '%parte_do_email%';
```

#### **2. Erro ao fazer login admin:**
- ✅ Verificar se `is_admin = true`
- ✅ Verificar se `is_active = true`
- ✅ Verificar se email e senha estão corretos

#### **3. Não consegue acessar /admin:**
- ✅ Verificar se executou o script SQL completo
- ✅ Verificar se o usuário é realmente admin
- ✅ Tentar fazer logout e login novamente

### **📱 Testando o Sistema:**

#### **1. Como Administrador:**
- ✅ Acesse `/admin/login`
- ✅ Faça login com email/senha do admin
- ✅ Deve ver o dashboard administrativo
- ✅ Pode gerenciar cursos, usuários, materiais

#### **2. Como Usuário Normal:**
- ✅ Acesse `/login` (login normal)
- ✅ Deve ir para `/user` (dashboard do usuário)
- ✅ Não deve conseguir acessar `/admin`

### **💡 Dicas Importantes:**

#### **1. Segurança:**
- ✅ **Não compartilhe** credenciais de administrador
- ✅ **Use emails corporativos** para administradores
- ✅ **Monitore** quem tem acesso administrativo

#### **2. Gerenciamento:**
- ✅ **Documente** quem são os administradores
- ✅ **Remova privilégios** quando necessário
- ✅ **Mantenha** apenas administradores necessários

#### **3. Backup:**
- ✅ **Anote** os emails dos administradores
- ✅ **Tenha** pelo menos 2 administradores
- ✅ **Teste** o acesso regularmente

## ✅ **Resumo - Como Configurar:**

### **1. Execute no Supabase SQL Editor:**
```sql
SELECT make_user_admin('seu-email@exemplo.com');
```

### **2. Acesse:**
- ✅ URL: `/admin/login`
- ✅ Email: o mesmo do cadastro normal
- ✅ Senha: a mesma do login normal

### **3. Pronto!**
- ✅ Você terá acesso completo ao painel administrativo
- ✅ Pode gerenciar cursos, usuários e configurações
- ✅ Sistema seguro e funcional

**Agora é só executar o comando SQL e fazer login!** 🎯✨












