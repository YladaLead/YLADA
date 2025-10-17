# 📊 Guia Completo - Gerenciar Usuários e Administradores no Supabase

## ✅ **Onde Encontrar Usuários e Administradores:**

### **🗂️ Tabelas no Supabase:**

#### **1. Tabela Principal - `professionals`:**
- ✅ **Localização:** Supabase Dashboard → Table Editor → `professionals`
- ✅ **Contém:** Todos os usuários cadastrados
- ✅ **Campos importantes:**
  - `id` - ID único do usuário
  - `name` - Nome do usuário
  - `email` - Email do usuário
  - `is_active` - Se a conta está ativa (true/false)
  - `is_admin` - Se é administrador (true/false)
  - `admin_password` - Senha administrativa (criptografada)
  - `created_at` - Data de criação da conta

#### **2. Tabela de Autenticação - `auth.users`:**
- ✅ **Localização:** Supabase Dashboard → Authentication → Users
- ✅ **Contém:** Dados de login (email, senha normal)
- ✅ **Importante:** Esta tabela é gerenciada automaticamente pelo Supabase

### **📋 Como Visualizar Usuários:**

#### **1. Via Table Editor (Recomendado):**
```
1. Acesse seu projeto no Supabase
2. Vá em "Table Editor" no menu lateral
3. Clique na tabela "professionals"
4. Veja todos os usuários cadastrados
```

#### **2. Via SQL Editor:**
```sql
-- Ver todos os usuários
SELECT 
    id,
    name,
    email,
    is_active,
    is_admin,
    CASE 
        WHEN admin_password IS NOT NULL THEN 'Senha definida'
        ELSE 'Sem senha'
    END as password_status,
    created_at
FROM professionals 
ORDER BY created_at DESC;
```

### **👥 Como Gerenciar Administradores:**

#### **1. Tornar Usuário Administrador:**
```sql
-- Método 1: Apenas tornar admin (sem senha específica)
UPDATE professionals 
SET is_admin = true, is_active = true
WHERE email = 'usuario@exemplo.com';

-- Método 2: Tornar admin com senha administrativa
SELECT set_admin_password('usuario@exemplo.com', 'senha-admin-123');
```

#### **2. Remover Privilégios de Administrador:**
```sql
-- Remover apenas privilégios de admin
UPDATE professionals 
SET is_admin = false
WHERE email = 'usuario@exemplo.com';

-- Remover privilégios e senha administrativa
SELECT remove_admin_password('usuario@exemplo.com', 'senha-atual');
```

#### **3. Ativar/Desativar Usuário:**
```sql
-- Ativar usuário
UPDATE professionals 
SET is_active = true
WHERE email = 'usuario@exemplo.com';

-- Desativar usuário
UPDATE professionals 
SET is_active = false
WHERE email = 'usuario@exemplo.com';
```

### **🔍 Consultas Úteis:**

#### **1. Ver Apenas Administradores:**
```sql
SELECT 
    name,
    email,
    is_active,
    CASE 
        WHEN admin_password IS NOT NULL THEN 'Senha definida'
        ELSE 'Sem senha'
    END as password_status,
    created_at
FROM professionals 
WHERE is_admin = true
ORDER BY created_at DESC;
```

#### **2. Ver Usuários Ativos:**
```sql
SELECT 
    name,
    email,
    is_admin,
    created_at
FROM professionals 
WHERE is_active = true
ORDER BY created_at DESC;
```

#### **3. Ver Usuários Inativos:**
```sql
SELECT 
    name,
    email,
    is_admin,
    created_at
FROM professionals 
WHERE is_active = false
ORDER BY created_at DESC;
```

#### **4. Buscar Usuário Específico:**
```sql
-- Buscar por email
SELECT * FROM professionals WHERE email = 'usuario@exemplo.com';

-- Buscar por nome
SELECT * FROM professionals WHERE name LIKE '%João%';

-- Buscar por parte do email
SELECT * FROM professionals WHERE email LIKE '%@empresa.com';
```

### **📊 Interface Visual no Supabase:**

#### **1. Table Editor - `professionals`:**
```
┌─────────────────────────────────────────────────────────────┐
│ Table: professionals                                        │
├─────────────────────────────────────────────────────────────┤
│ id (uuid) │ name (text) │ email (text) │ is_active (bool) │
│ is_admin  │ admin_pass  │ created_at   │ updated_at       │
├─────────────────────────────────────────────────────────────┤
│ ...       │ João Silva  │ joao@...     │ true            │
│ true      │ [hash]      │ 2024-01-15   │ 2024-01-15      │
├─────────────────────────────────────────────────────────────┤
│ ...       │ Maria       │ maria@...    │ true            │
│ false     │ null        │ 2024-01-16   │ 2024-01-16      │
└─────────────────────────────────────────────────────────────┘
```

#### **2. Authentication - Users:**
```
┌─────────────────────────────────────────────────────────────┐
│ Authentication → Users                                      │
├─────────────────────────────────────────────────────────────┤
│ Email              │ Created At │ Last Sign In │ Status    │
├─────────────────────────────────────────────────────────────┤
│ joao@empresa.com   │ 2024-01-15 │ 2024-01-20   │ Active    │
│ maria@empresa.com  │ 2024-01-16 │ 2024-01-19   │ Active    │
└─────────────────────────────────────────────────────────────┘
```

### **🛠️ Operações Comuns:**

#### **1. Adicionar Novo Usuário Manualmente:**
```sql
-- Inserir novo usuário na tabela professionals
INSERT INTO professionals (name, email, is_active, is_admin)
VALUES ('Novo Usuário', 'novo@exemplo.com', true, false);
```

#### **2. Atualizar Dados do Usuário:**
```sql
-- Atualizar nome do usuário
UPDATE professionals 
SET name = 'Nome Atualizado'
WHERE email = 'usuario@exemplo.com';

-- Atualizar email (cuidado com isso)
UPDATE professionals 
SET email = 'novo-email@exemplo.com'
WHERE email = 'email-antigo@exemplo.com';
```

#### **3. Definir Senha Administrativa:**
```sql
-- Definir senha administrativa para usuário existente
SELECT set_admin_password('usuario@exemplo.com', 'senha-admin-123');
```

#### **4. Verificar Status Completo:**
```sql
-- Ver status completo de um usuário
SELECT 
    name,
    email,
    is_active,
    is_admin,
    CASE 
        WHEN admin_password IS NOT NULL THEN 'Senha definida'
        ELSE 'Sem senha'
    END as password_status,
    created_at,
    updated_at
FROM professionals 
WHERE email = 'usuario@exemplo.com';
```

### **📱 Como Acessar no Supabase:**

#### **1. Via Dashboard:**
```
1. Acesse https://supabase.com
2. Faça login na sua conta
3. Selecione seu projeto HerbaLead
4. No menu lateral, clique em "Table Editor"
5. Clique na tabela "professionals"
```

#### **2. Via SQL Editor:**
```
1. Acesse https://supabase.com
2. Faça login na sua conta
3. Selecione seu projeto HerbaLead
4. No menu lateral, clique em "SQL Editor"
5. Cole e execute as consultas SQL
```

### **🔍 Filtros Úteis na Interface:**

#### **1. No Table Editor:**
- ✅ **Filtrar por `is_admin = true`** - Ver apenas administradores
- ✅ **Filtrar por `is_active = true`** - Ver apenas usuários ativos
- ✅ **Ordenar por `created_at`** - Ver usuários mais recentes primeiro
- ✅ **Buscar por email** - Encontrar usuário específico

#### **2. No Authentication:**
- ✅ **Filtrar por status** - Active, Inactive, etc.
- ✅ **Ordenar por data** - Último login, criação, etc.
- ✅ **Buscar por email** - Encontrar usuário específico

### **📊 Relatórios Úteis:**

#### **1. Estatísticas Gerais:**
```sql
-- Total de usuários
SELECT COUNT(*) as total_usuarios FROM professionals;

-- Total de administradores
SELECT COUNT(*) as total_admins FROM professionals WHERE is_admin = true;

-- Total de usuários ativos
SELECT COUNT(*) as usuarios_ativos FROM professionals WHERE is_active = true;

-- Usuários criados hoje
SELECT COUNT(*) as usuarios_hoje 
FROM professionals 
WHERE DATE(created_at) = CURRENT_DATE;
```

#### **2. Relatório de Administradores:**
```sql
-- Relatório completo de administradores
SELECT 
    name,
    email,
    is_active,
    CASE 
        WHEN admin_password IS NOT NULL THEN 'Senha definida'
        ELSE 'Sem senha'
    END as password_status,
    created_at,
    updated_at
FROM professionals 
WHERE is_admin = true
ORDER BY created_at DESC;
```

### **🚨 Importante:**

#### **1. Sincronização:**
- ✅ **Tabela `professionals`** - Dados do usuário (nome, admin, etc.)
- ✅ **Tabela `auth.users`** - Dados de login (email, senha normal)
- ✅ **Sempre manter sincronizadas** as duas tabelas

#### **2. Segurança:**
- ✅ **Não edite diretamente** a tabela `auth.users`
- ✅ **Use sempre** as funções SQL para alterar senhas
- ✅ **Monitore** quem tem acesso administrativo

#### **3. Backup:**
- ✅ **Exporte regularmente** a tabela `professionals`
- ✅ **Documente** quem são os administradores
- ✅ **Tenha sempre** pelo menos 2 administradores

## ✅ **Resumo - Onde Encontrar:**

### **1. Usuários Normais:**
- ✅ **Supabase → Table Editor → `professionals`**
- ✅ **Ou:** Supabase → Authentication → Users

### **2. Administradores:**
- ✅ **Supabase → Table Editor → `professionals`**
- ✅ **Filtrar por:** `is_admin = true`

### **3. Gerenciar Administradores:**
- ✅ **Via SQL Editor** com as funções criadas
- ✅ **Via Table Editor** editando diretamente

**Agora você sabe exatamente onde encontrar e gerenciar todos os usuários e administradores!** 🎯✨












