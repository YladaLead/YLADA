# 🔍 **Diagnóstico - Problema de Sincronização Supabase**

## 🚨 **Problema Identificado:**
- ✅ **Curso excluído** no painel administrativo
- ✅ **Curso reaparece** após atualizar a página
- ✅ **Possível problema** de conexão ou sincronização com Supabase

## 🔧 **Passos para Diagnosticar:**

### **1. Verificar Console do Navegador:**
1. ✅ Acesse `/admin`
2. ✅ Abra o Console (F12 → Console)
3. ✅ Tente excluir um curso
4. ✅ Observe as mensagens de log:
   - `🔄 Carregando dados do Supabase...`
   - `🗑️ Iniciando exclusão do curso...`
   - `✅ Curso excluído com sucesso`
   - `🎉 Todos os dados carregados com sucesso!`

### **2. Verificar Erros de Conexão:**
Se aparecerem erros como:
- ❌ `Failed to fetch`
- ❌ `Network error`
- ❌ `Authentication error`
- ❌ `RLS policy error`

### **3. Testar Conexão Direta:**
Execute no Console do navegador:
```javascript
// Testar conexão básica
fetch('/api/test-supabase')
  .then(response => response.json())
  .then(data => console.log('✅ Conexão OK:', data))
  .catch(error => console.error('❌ Erro:', error))
```

### **4. Verificar Variáveis de Ambiente:**
No Console do navegador:
```javascript
// Verificar se as variáveis estão definidas
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

## 🛠️ **Soluções Possíveis:**

### **Solução 1: Verificar Credenciais Supabase**
1. ✅ Acesse Supabase Dashboard
2. ✅ Vá em Settings → API
3. ✅ Copie URL e anon key
4. ✅ Crie arquivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key_aqui
```

### **Solução 2: Verificar Políticas RLS**
Execute no Supabase SQL Editor:
```sql
-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('courses', 'course_modules', 'course_materials')
ORDER BY tablename, policyname;
```

### **Solução 3: Verificar Dados no Banco**
Execute no Supabase SQL Editor:
```sql
-- Verificar se o curso realmente foi excluído
SELECT 
    id,
    title,
    description,
    is_active,
    created_at,
    updated_at
FROM courses 
ORDER BY created_at DESC;

-- Verificar módulos
SELECT 
    id,
    course_id,
    title,
    is_active
FROM course_modules 
ORDER BY created_at DESC;

-- Verificar materiais
SELECT 
    id,
    module_id,
    title,
    is_active
FROM course_materials 
ORDER BY created_at DESC;
```

### **Solução 4: Recriar Políticas RLS**
Execute no Supabase SQL Editor:
```sql
-- Recriar políticas para administradores
DROP POLICY IF EXISTS "courses_admin_all" ON courses;
CREATE POLICY "courses_admin_all" ON courses
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM professionals 
    WHERE professionals.id = auth.uid() 
    AND professionals.is_admin = true
  )
);

DROP POLICY IF EXISTS "course_modules_admin_all" ON course_modules;
CREATE POLICY "course_modules_admin_all" ON course_modules
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM professionals 
    WHERE professionals.id = auth.uid() 
    AND professionals.is_admin = true
  )
);

DROP POLICY IF EXISTS "course_materials_admin_all" ON course_materials;
CREATE POLICY "course_materials_admin_all" ON course_materials
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM professionals 
    WHERE professionals.id = auth.uid() 
    AND professionals.is_admin = true
  )
);
```

## 🔍 **Diagnóstico Avançado:**

### **1. Verificar Logs do Supabase:**
1. ✅ Acesse Supabase Dashboard
2. ✅ Vá em Logs → API
3. ✅ Procure por erros relacionados a DELETE
4. ✅ Verifique se há erros de RLS

### **2. Testar Operações Individuais:**
```sql
-- Testar exclusão manual
DELETE FROM course_materials WHERE module_id IN (
  SELECT id FROM course_modules WHERE course_id = 'ID_DO_CURSO'
);

DELETE FROM course_modules WHERE course_id = 'ID_DO_CURSO';

DELETE FROM courses WHERE id = 'ID_DO_CURSO';
```

### **3. Verificar Sessão de Admin:**
```javascript
// No console do navegador
const adminSession = localStorage.getItem('admin_session')
console.log('Admin Session:', adminSession)

// Verificar se está logado como admin
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)
```

## 🎯 **Próximos Passos:**

### **Se o problema persistir:**
1. ✅ **Verificar logs** do console do navegador
2. ✅ **Verificar logs** do Supabase Dashboard
3. ✅ **Testar conexão** com script de diagnóstico
4. ✅ **Verificar políticas RLS** no banco
5. ✅ **Recriar políticas** se necessário

### **Se funcionar:**
1. ✅ **Verificar se** as notificações aparecem
2. ✅ **Verificar se** os dados são recarregados
3. ✅ **Testar outras operações** (criar, editar)

## 📞 **Informações para Suporte:**

### **Colete estas informações:**
- ✅ **Mensagens do console** do navegador
- ✅ **Erros do Supabase** Dashboard
- ✅ **Status das políticas RLS**
- ✅ **Dados das tabelas** após exclusão
- ✅ **Configuração das variáveis** de ambiente

**Execute os passos de diagnóstico e me informe os resultados!** 🔍✨












