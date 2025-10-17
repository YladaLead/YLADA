# 🔧 **Correção - Acesso aos Cursos**

## 🚨 **Problema Identificado:**
- ✅ **Usuário logado** na área de membros
- ✅ **Não consegue acessar** cursos e materiais
- ✅ **Possível problema** de tabelas ou políticas RLS

## 🔍 **Diagnóstico:**

### **1. Verificar Console do Navegador:**
1. ✅ Acesse `/course`
2. ✅ Abra Console (F12 → Console)
3. ✅ Observe as mensagens de erro:
   - `❌ Erro ao carregar cursos`
   - `❌ Erro ao verificar acesso`
   - `❌ Failed to fetch`

### **2. Verificar Tabelas no Supabase:**
Execute no Supabase SQL Editor:
```sql
-- Arquivo: sql/check_course_tables.sql
-- Verifica se todas as tabelas existem
```

### **3. Verificar Status do Usuário:**
Execute no Supabase SQL Editor:
```sql
-- Verificar se o usuário está ativo
SELECT 
    id,
    name,
    email,
    is_active,
    is_admin,
    created_at
FROM professionals 
WHERE email = 'seu-email@exemplo.com';
```

## 🛠️ **Solução Completa:**

### **Passo 1: Executar Script de Correção**
Execute no Supabase SQL Editor:
```sql
-- Arquivo: sql/fix_course_access.sql
-- Cria todas as tabelas e políticas necessárias
```

### **Passo 2: Verificar se Funcionou**
Após executar o script, verifique:
1. ✅ **Tabelas criadas** (courses, course_modules, course_materials, etc.)
2. ✅ **Políticas RLS** configuradas
3. ✅ **Curso de exemplo** inserido
4. ✅ **Módulos e materiais** criados

### **Passo 3: Testar Acesso**
1. ✅ **Faça logout** e login novamente
2. ✅ **Acesse** `/course`
3. ✅ **Verifique** se o curso aparece
4. ✅ **Teste** a inscrição no curso
5. ✅ **Teste** o acesso aos materiais

## 🎯 **Possíveis Causas:**

### **1. Tabelas Não Existem**
- ❌ **Tabela courses** não criada
- ❌ **Tabela course_modules** não criada
- ❌ **Tabela course_materials** não criada
- ❌ **Tabela course_enrollments** não criada

### **2. Políticas RLS Incorretas**
- ❌ **RLS habilitado** mas sem políticas
- ❌ **Políticas restritivas** demais
- ❌ **Usuário não reconhecido** como ativo

### **3. Dados Não Inseridos**
- ❌ **Nenhum curso** cadastrado
- ❌ **Nenhum módulo** criado
- ❌ **Nenhum material** disponível

### **4. Usuário Inativo**
- ❌ **is_active = false** na tabela professionals
- ❌ **Conta suspensa** ou desativada
- ❌ **Problema de autenticação**

## 🔧 **Soluções Implementadas:**

### **1. Criação Automática de Tabelas**
```sql
-- Cria tabelas se não existirem
CREATE TABLE IF NOT EXISTS courses (...)
CREATE TABLE IF NOT EXISTS course_modules (...)
CREATE TABLE IF NOT EXISTS course_materials (...)
CREATE TABLE IF NOT EXISTS course_enrollments (...)
CREATE TABLE IF NOT EXISTS user_course_progress (...)
```

### **2. Políticas RLS Corretas**
```sql
-- Políticas para usuários ativos
CREATE POLICY "courses_select_active_users" ON courses
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM professionals 
    WHERE professionals.id = auth.uid() 
    AND professionals.is_active = true
  )
);
```

### **3. Dados de Exemplo**
```sql
-- Insere curso de exemplo
INSERT INTO courses (title, description, ...)
VALUES ('HerbaLead Master Course', 'Curso completo...', ...);

-- Insere módulos de exemplo
INSERT INTO course_modules (course_id, title, ...)
VALUES (course_id, 'Visão Geral da Plataforma', ...);
```

### **4. Materiais de Apoio**
```sql
-- Insere materiais de exemplo
INSERT INTO course_materials (module_id, title, file_path, ...)
VALUES (module_id, 'Guia de Cadastro', '/course/materials/01-guia-cadastro.md', ...);
```

## 📋 **Checklist de Verificação:**

### **✅ Antes da Correção:**
- ❌ Usuário não consegue acessar cursos
- ❌ Página de cursos vazia
- ❌ Erros no console do navegador
- ❌ Tabelas não existem no Supabase

### **✅ Após a Correção:**
- ✅ **Tabelas criadas** no Supabase
- ✅ **Políticas RLS** configuradas
- ✅ **Curso de exemplo** disponível
- ✅ **Módulos e materiais** criados
- ✅ **Usuário consegue** se inscrever
- ✅ **Materiais podem** ser baixados

## 🚀 **Próximos Passos:**

### **1. Execute o Script:**
```sql
-- Execute: sql/fix_course_access.sql
-- No Supabase SQL Editor
```

### **2. Verifique os Resultados:**
- ✅ **Confirme** que as tabelas foram criadas
- ✅ **Verifique** que o curso aparece
- ✅ **Teste** a inscrição no curso
- ✅ **Teste** o download de materiais

### **3. Se Ainda Não Funcionar:**
- ✅ **Verifique** se o usuário está ativo
- ✅ **Confirme** as políticas RLS
- ✅ **Teste** com outro usuário
- ✅ **Verifique** logs do console

## 🎉 **Resultado Esperado:**

### **Após a correção:**
1. ✅ **Página de cursos** carrega normalmente
2. ✅ **Curso "HerbaLead Master Course"** aparece
3. ✅ **Usuário pode** se inscrever no curso
4. ✅ **Módulos são** exibidos corretamente
5. ✅ **Materiais podem** ser baixados
6. ✅ **Progresso é** salvo corretamente

### **Estrutura Criada:**
- ✅ **1 curso** (HerbaLead Master Course)
- ✅ **6 módulos** (Visão Geral, Cadastro, Links, Quiz, Vendas, Avançado)
- ✅ **5 materiais** (PDFs de apoio)
- ✅ **Políticas RLS** para usuários ativos
- ✅ **Sistema de inscrições** funcionando

**Execute o script de correção e teste o acesso aos cursos!** 🎯✨